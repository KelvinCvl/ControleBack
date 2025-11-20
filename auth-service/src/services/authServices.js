import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const registerUser = async (email, username, password) => {
  const exists = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] }
  });

  if (exists) throw new Error('Email ou username déjà utilisé');

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { email, username, password: passwordHash, reputation: 0 },
    select: { id: true, email: true, username: true, role: true, reputation: true, createdAt: true }
  });

  return { user, token: generateToken(user.id, user.role) };
};

export const loginUser = async (identifier, password) => {
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { username: identifier }] }
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Identifiants incorrects');
  }

  const { password: _, ...safeUser } = user;
  return { user: safeUser, token: generateToken(user.id, user.role) };
};

export const getUserById = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, username: true, role: true, reputation: true, createdAt: true }
  });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: { id: true, email: true, username: true, role: true, reputation: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  });
};

export const updateUserRole = async (userId, newRole) => {
  if (!['USER', 'EXPERT', 'ADMIN'].includes(newRole)) {
    throw new Error('Rôle invalide');
  }

  return await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: { id: true, email: true, username: true, role: true }
  });
};