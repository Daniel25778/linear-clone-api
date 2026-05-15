import { errorLogger, messageErrorResponse, ok } from '@main/utils';
import { getAuth } from '@clerk/express';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

interface Body {
  body: string;
}

export const insertCommentController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { userId: clerkId } = getAuth(request);
      const { issueId } = request.params;
      const { body } = request.body as Body;

      const user = await prisma.user.findUnique({
        select: { id: true },
        where: { clerkId: clerkId ?? '' }
      });

      if (user === null)
        return messageErrorResponse({ error: new Error('User not found'), response });

      const payload = await prisma.comment.create({
        data: { authorId: user.id, body, issueId },
        include: {
          author: { select: { avatar: true, id: true, name: true } }
        }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
