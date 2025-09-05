import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const test = (req, res) => {
  res.json({ message: '✅ API is working!' });
};

// ---------------- Update User ----------------
export const updateUser = async (req, res, next) => {
  if (req.user.id !== parseInt(req.params.userId)) {
    return next(errorHandler(403, '⛔ You are not allowed to update this user'));
  }

  const updates = {};

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    updates.password = bcryptjs.hashSync(req.body.password, 10);
  }

  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
    }
    if (req.body.username.includes(' ')) {
      return next(errorHandler(400, 'Username cannot contain spaces'));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, 'Username must be lowercase'));
    }
    if (!/^[a-zA-Z0-9]+$/.test(req.body.username)) {
      return next(errorHandler(400, 'Username can only contain letters and numbers'));
    }
    updates.username = req.body.username;
  }

  if (req.body.email) updates.email = req.body.email;
  if (req.body.profilePicture) updates.profilePicture = req.body.profilePicture;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(req.params.userId) },
      data: updates,
    });

    const { password, ...rest } = updatedUser;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// ---------------- Delete User ----------------
export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== parseInt(req.params.userId)) {
    return next(errorHandler(403, '⛔ You are not allowed to delete this user'));
  }
  try {
    await prisma.user.delete({
      where: { id: parseInt(req.params.userId) },
    });
    res.status(200).json('🗑️ User has been deleted');
  } catch (error) {
    next(error);
  }
};

// ---------------- Signout ----------------
export const signout = (req, res, next) => {
  try {
    res.clearCookie('access_token').status(200).json('👋 User has been signed out');
  } catch (error) {
    next(error);
  }
};

// ---------------- Get All Users (Admin Only) ----------------
export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, '⛔ You are not allowed to see all users'));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 'asc' : 'desc';

    const users = await prisma.user.findMany({
      skip: startIndex,
      take: limit,
      orderBy: { createdAt: sortDirection },
    });

    const usersWithoutPassword = users.map(({ password, ...rest }) => rest);

    const totalUsers = await prisma.user.count();

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const lastMonthUsers = await prisma.user.count({
      where: { createdAt: { gte: oneMonthAgo } },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------- Get Single User ----------------
export const getUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.userId) },
    });
    if (!user) {
      return next(errorHandler(404, '❌ User not found'));
    }
    const { password, ...rest } = user;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
