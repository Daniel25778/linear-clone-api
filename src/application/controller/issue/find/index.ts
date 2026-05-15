import { errorLogger, messageErrorResponse, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

export const findIssueController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { teamId } = request.params;

      const payload = await prisma.issue.findMany({
        include: {
          _count: { select: { comments: true } },
          assignee: { select: { avatar: true, id: true, name: true } },
          creator: { select: { avatar: true, id: true, name: true } },
          labels: { include: { label: true } }
        },
        orderBy: { position: 'asc' },
        where: { teamId }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
