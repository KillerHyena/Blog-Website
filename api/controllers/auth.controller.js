import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// ---------------- Signup ----------------
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(400, '⚠️ All fields are required'));
  }

  try {
    // check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return next(errorHandler(400, 'User already exists 🚫'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: '🚀 Welcome aboard! Your account is ready.',
      user: { id: newUser.id, username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    next(error);
  }
};

// ---------------- Signin ----------------
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, '⚠️ All fields are required'));
  }

  try {
    const validUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!validUser) {
      return next(errorHandler(404, 'User not found ❌'));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password ❌'));
    }

    const token = jwt.sign(
      { id: validUser.id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );

    // remove password before sending
    const { password: pass, ...rest } = validUser;

    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// ---------------- Google Auth ----------------
export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const token = jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user;
      return res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    }

    // generate random password for google users
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        username:
          name.toLowerCase().replace(/\s+/g, '') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      },
    });

    const token = jwt.sign(
      { id: newUser.id, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET
    );

    const { password, ...rest } = newUser;
    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
