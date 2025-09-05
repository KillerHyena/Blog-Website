import { PrismaClient } from '@prisma/client';
import { errorHandler } from '../utils/error.js';

const prisma = new PrismaClient();

// ---------------- Create Comment ----------------
export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (parseInt(userId) !== req.user.id) {
      return next(errorHandler(403, '⛔ You are not allowed to create this comment'));
    }

    const newComment = await prisma.comment.create({
      data: {
        text: content,
        postId: parseInt(postId),
        userId: parseInt(userId),
        likes: [], // default empty array
        numberOfLikes: 0,
      },
    });

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

// ---------------- Get Comments for a Post ----------------
export const getPostComments = async (req, res, next) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(req.params.postId) },
      orderBy: { createdAt: 'desc' },
      include: { user: true }, // optional: attach user info
    });

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

// ---------------- Like / Unlike Comment ----------------
export const likeComment = async (req, res, next) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(req.params.commentId) },
    });

    if (!comment) {
      return next(errorHandler(404, '❌ Comment not found'));
    }

    let likes = comment.likes || [];
    let numberOfLikes = comment.numberOfLikes || 0;

    if (!likes.includes(req.user.id)) {
      likes.push(req.user.id);
      numberOfLikes += 1;
    } else {
      likes = likes.filter((id) => id !== req.user.id);
      numberOfLikes -= 1;
    }

    const updatedComment = await prisma.comment.update({
      where: { id: comment.id },
      data: {
        likes,
        numberOfLikes,
      },
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

// ---------------- Edit Comment ----------------
export const editComment = async (req, res, next) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(req.params.commentId) },
    });

    if (!comment) {
      return next(errorHandler(404, '❌ Comment not found'));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, '⛔ You are not allowed to edit this comment'));
    }

    const editedComment = await prisma.comment.update({
      where: { id: parseInt(req.params.commentId) },
      data: { text: req.body.content },
    });

    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

// ---------------- Delete Comment ----------------
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(req.params.commentId) },
    });

    if (!comment) {
      return next(errorHandler(404, '❌ Comment not found'));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, '⛔ You are not allowed to delete this comment'));
    }

    await prisma.comment.delete({
      where: { id: comment.id },
    });

    res.status(200).json('🗑️ Comment has been deleted');
  } catch (error) {
    next(error);
  }
};

// ---------------- Admin: Get All Comments ----------------
export const getcomments = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, '⛔ You are not allowed to get all comments'));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'desc' ? 'desc' : 'asc';

    const comments = await prisma.comment.findMany({
      skip: startIndex,
      take: limit,
      orderBy: { createdAt: sortDirection },
    });

    const totalComments = await prisma.comment.count();

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const lastMonthComments = await prisma.comment.count({
      where: { createdAt: { gte: oneMonthAgo } },
    });

    res.status(200).json({
      comments,
      totalComments,
      lastMonthComments,
    });
  } catch (error) {
    next(error);
  }
};
