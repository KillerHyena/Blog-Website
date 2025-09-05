import { PrismaClient } from '@prisma/client';
import { errorHandler } from '../utils/error.js';

const prisma = new PrismaClient();

// ---------------- Create Post ----------------
export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, '⛔ You are not allowed to create a post'));
  }

  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, '⚠️ Please provide all required fields'));
  }

  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');

  try {
    const newPost = await prisma.post.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category || 'general',
        image: req.body.image || null,
        slug,
        authorId: req.user.id, // matches prisma model relation
      },
    });
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

// ---------------- Get Posts ----------------
export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 'asc' : 'desc';

    const filters = {};
    if (req.query.userId) filters.authorId = parseInt(req.query.userId);
    if (req.query.category) filters.category = req.query.category;
    if (req.query.slug) filters.slug = req.query.slug;
    if (req.query.postId) filters.id = parseInt(req.query.postId);
    if (req.query.searchTerm) {
      filters.OR = [
        { title: { contains: req.query.searchTerm, mode: 'insensitive' } },
        { content: { contains: req.query.searchTerm, mode: 'insensitive' } },
      ];
    }

    const posts = await prisma.post.findMany({
      where: filters,
      orderBy: { updatedAt: sortDirection },
      skip: startIndex,
      take: limit,
    });

    const totalPosts = await prisma.post.count();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const lastMonthPosts = await prisma.post.count({
      where: { createdAt: { gte: oneMonthAgo } },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------- Delete Post ----------------
export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== parseInt(req.params.userId)) {
    return next(errorHandler(403, '⛔ You are not allowed to delete this post'));
  }

  try {
    await prisma.post.delete({
      where: { id: parseInt(req.params.postId) },
    });
    res.status(200).json('🗑️ The post has been deleted');
  } catch (error) {
    next(error);
  }
};

// ---------------- Update Post ----------------
export const updatepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== parseInt(req.params.userId)) {
    return next(errorHandler(403, '⛔ You are not allowed to update this post'));
  }

  try {
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(req.params.postId) },
      data: {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        image: req.body.image,
      },
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
