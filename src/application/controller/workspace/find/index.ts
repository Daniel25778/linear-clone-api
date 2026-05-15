import { errorLogger, messageErrorResponse, ok } from '@main/utils';
import { getAuth } from '@clerk/express';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

export const findWorkspaceController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { userId: clerkId } = getAuth(request);

      const user = await prisma.user.findUnique({
        select: { id: true },
        where: { clerkId: clerkId ?? '' }
      });

      if (user === null)
        return messageErrorResponse({ error: new Error('User not found'), response });

      const payload = await prisma.workspace.findMany({
        include: {
          members: {
            select: {
              role: true,
              user: {
                select: { avatar: true, id: true, name: true }
              }
            }
          }
        },
        where: {
          members: {
            some: { userId: user.id }
          }
        }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
