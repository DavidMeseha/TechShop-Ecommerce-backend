import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { responseDto } from "../utilities";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;

export function userAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!ACCESS_SECRET)
    return res.status(500).json(responseDto("ENV server Error", false));
  if (!token) return res.status(403).json(responseDto("Not Authorized"));

  jwt.verify(token, ACCESS_SECRET, (err, payload) => {
    if (err || !payload) return res.status(403).json(responseDto(err, false));
    const user: { isRegistered: boolean } = JSON.parse(JSON.stringify(payload));

    if (!user.isRegistered)
      return res.status(401).json(responseDto("You Need to Signup", false));

    res.locals.user = JSON.parse(JSON.stringify(payload));
    next();
  });
}

export function apiAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!ACCESS_SECRET)
    return res.status(500).json(responseDto("ENV server Error", false));
  if (!token) return res.status(403).json(responseDto("Not Authorized", false));

  jwt.verify(token, ACCESS_SECRET, (err, payload) => {
    if (err || !payload) return res.status(403).json(responseDto(err, false));

    res.locals.user = JSON.parse(JSON.stringify(payload));
    next();
  });
}
