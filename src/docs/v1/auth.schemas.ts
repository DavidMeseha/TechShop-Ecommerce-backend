export const authSchemas = {
  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', format: 'password' },
    },
  },

  RegisterRequest: {
    type: 'object',
    required: ['email', 'password', 'firstName', 'lastName', 'confirmPassword'],
    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
      confirmPassword: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      gender: { type: 'string', enum: ['male', 'female', null] },
      dayOfBirth: { type: 'number' },
      monthOfBirth: { type: 'number' },
      yearOfBirth: { type: 'number' },
    },
  },

  TokenResponse: {
    type: 'object',
    properties: {
      token: { type: 'string' },
      user: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          isVendor: { type: 'boolean' },
          isRegistered: { type: 'boolean' },
          imageUrl: { type: 'string' },
          language: { type: 'string' },
        },
      },
    },
  },

  UserDataResponse: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      isVendor: { type: 'boolean' },
      isRegistered: { type: 'boolean' },
      imageUrl: { type: 'string' },
      language: { type: 'string' },
    },
  },

  LoginResponse: {
    type: 'object',
    properties: {
      token: { type: 'string' },
      expiry: { type: 'number' },
      user: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          isVendor: { type: 'boolean' },
          isRegistered: { type: 'boolean' },
          imageUrl: { type: 'string' },
          language: { type: 'string' },
        },
      },
    },
  },

  LogoutResponse: {
    type: 'object',
    properties: {
      status: { type: 'string' },
    },
  },
};
