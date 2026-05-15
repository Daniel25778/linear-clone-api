import type { Prisma } from '@prisma/client';

export const userFindParams: Prisma.UserSelect = {
  avatar: true,
  clerkId: true,
  createdAt: true,
  email: true,
  id: true,
  name: true,
  updatedAt: true
};
