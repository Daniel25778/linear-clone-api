import { errorLogger, messageErrorResponse, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

export const findCommentController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { issueId } = request.params;

      const payload = await prisma.comment.findMany({
        include: {
          author: { select: { avatar: true, id: true, name: true } }
        },
        orderBy: { createdAt: 'asc' },
        where: { issueId }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
