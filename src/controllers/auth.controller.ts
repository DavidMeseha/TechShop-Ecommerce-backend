import { json, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Users, { IUser } from "../models/Users";
import bcrypt from "bcrypt-nodejs";
import Joi from "joi";
import { responseDto } from "../utilities";
import { IUserTokenPayload } from "../global-types";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

type LoginRequestBody = { email: string; password: string };
type RegisterRequestBody = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female" | null;
  dayOfBirth: number;
  monthOfBirth: number;
  yearOfBirth: number;
};

const RegisterSchema = Joi.object<RegisterRequestBody>({
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  gender: Joi.string().equal("male", "female", null).required(),
  password: Joi.string().min(8),
  confirmPassword: Joi.ref("password"),
  dayOfBirth: Joi.number().integer().max(31).min(1),
  monthOfBirth: Joi.number().integer().max(12).min(1),
  yearOfBirth: Joi.number()
    .integer()
    .max(new Date().getFullYear())
    .min(new Date().getFullYear() - 100),
});

export async function checkToken(req: Request, res: Response) {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    if (!ACCESS_TOKEN_SECRET)
      return res.status(500).json(responseDto("ENV Server Error"));

    try {
      const userToken = jwt.verify(
        token,
        ACCESS_TOKEN_SECRET
      ) as IUserTokenPayload;

      if (!userToken)
        return res.status(400).json(responseDto("Token not valid"));

      const foundUser = await Users.findById(userToken._id)
        .select(
          "firstName lastName email isRegistered isLogin isVendor language"
        )
        .then((result) => result?.toJSON());

      if (
        foundUser &&
        ((foundUser.isLogin && foundUser.isRegistered) ||
          !foundUser.isRegistered)
      )
        return res.status(200).json(foundUser);
      else res.status(400).json(responseDto("Token not valid"));
    } catch (err) {
      return res.status(400).json("Token not valid");
    }
  } else {
    res.status(400).json(responseDto("No valid token provided"));
  }
}

export async function guestToken(req: Request, res: Response) {
  try {
    const newUser = await Users.create({
      isRegistered: false,
      isVendor: false,
    })
      .then((user) => user.toJSON())
      .then((userJson) => {
        delete userJson.password;
        delete userJson.likes;
        delete userJson.recentProducts;
        delete userJson.saves;
        delete userJson.cart;

        return userJson;
      })
      .catch((err) => {
        console.log(err.message);
        return null;
      });

    if (!newUser)
      return res
        .status(500)
        .json(
          responseDto(
            "guest created but ENV Server Error on creating access token"
          )
        );

    if (!ACCESS_TOKEN_SECRET)
      return res
        .status(500)
        .json(
          responseDto(
            "guest created but ENV Server Error on creating access token"
          )
        );

    jwt.sign(
      { ...newUser },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "400d" },
      (err, token) => {
        if (err)
          return res.status(500).json(responseDto("could not create token"));
        return res.status(200).json({
          user: newUser,
          token,
        });
      }
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(
        responseDto(
          "guest created but ENV Server Error on creating access token"
        )
      );
  }
}

export async function login(req: Request, res: Response) {
  const { email, password }: LoginRequestBody = req.body;
  const user = await Users.findOne({ email: email })
    .select(
      "_id firstName lastName email isRegistered isVendor language password"
    )
    .then((result) => result?.toJSON());

  if (!user) return res.status(401).json(responseDto("Email Not Found"));
  const passwordMatching = bcrypt.compareSync(password, user.password ?? "");

  if (!passwordMatching)
    return res.status(401).json(responseDto("Wrong Email or Password"));

  if (!ACCESS_TOKEN_SECRET)
    return res
      .status(500)
      .json(responseDto("user created but ENV Server Error"));

  delete user.password;
  jwt.sign(
    { ...user },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" },
    async (err, token) => {
      if (err)
        return res.status(500).json(responseDto("could not create token"));
      res.status(200).json({ user, token });
      await Users.updateOne({ _id: user._id }, { isLogin: true });
    }
  );
}

export async function register(req: Request, res: Response) {
  const registerForm: RegisterRequestBody = req.body;

  const { error, value } = RegisterSchema.validate({ ...registerForm });
  if (error) return res.status(400).json(error.message);

  const emailDublicate = !!(await Users.findOne({ email: value.email }));
  if (emailDublicate)
    return res.status(400).json(responseDto("Email is already in use"));

  let newUser = await Users.create({
    ...value,
    isRegistered: true,
    isLogin: false,
    dateOfBirth: {
      day: value.dayOfBirth,
      month: value.monthOfBirth,
      year: value.yearOfBirth,
    },
  })
    .then((user) => user.toJSON())
    .catch(() =>
      res.status(500).json(responseDto("Server Error Creating user"))
    );

  if (newUser)
    res.status(201).json(responseDto("Registerd Successfully", true));
  else res.status(500).json(responseDto("Failed to create user in databse"));
}

export async function logout(req: Request, res: Response) {
  const user: IUserTokenPayload = res.locals.user;
  Users.updateOne({ _id: user._id }, { isLogin: false });
  res.status(200).json("success");
}
