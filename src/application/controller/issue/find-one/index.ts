import { errorLogger, messageErrorResponse, notFound, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

export const findOneIssueController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const payload = await prisma.issue.findUnique({
        include: {
          assignee: { select: { avatar: true, id: true, name: true } },
          comments: {
            include: {
              author: { select: { avatar: true, id: true, name: true } }
            },
            orderBy: { createdAt: 'asc' }
          },
          creator: { select: { avatar: true, id: true, name: true } },
          labels: { include: { label: true } }
        },
        where: { id: request.params.id }
      });

      if (payload === null)
        return notFound({
          entity: { english: 'Issue', portuguese: 'Issue' },
          response
        });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
