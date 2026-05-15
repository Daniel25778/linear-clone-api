import { errorLogger, messageErrorResponse, notFound, ok } from '@main/utils';
import { getAuth } from '@clerk/express';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

export const deleteCommentController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { userId: clerkId } = getAuth(request);

      const user = await prisma.user.findUnique({
        select: { id: true },
        where: { clerkId: clerkId ?? '' }
      });

      if (user === null)
        return messageErrorResponse({ error: new Error('User not found'), response });

      const comment = await prisma.comment.findUnique({
        select: { authorId: true, id: true },
        where: { id: request.params.id }
      });

      if (comment === null)
        return notFound({
          entity: { english: 'Comment', portuguese: 'Comentário' },
          response
        });

      if (comment.authorId !== user.id)
        return messageErrorResponse({ error: new Error('Forbidden'), response });

      await prisma.comment.delete({
        where: { id: request.params.id }
      });

      return ok({ payload: { deleted: true }, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
