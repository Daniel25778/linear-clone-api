import { errorLogger, messageErrorResponse, notFound, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

export const deleteIssueController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const issue = await prisma.issue.findUnique({
        select: { id: true },
        where: { id: request.params.id }
      });

      if (issue === null)
        return notFound({
          entity: { english: 'Issue', portuguese: 'Issue' },
          response
        });

      await prisma.issue.delete({
        where: { id: request.params.id }
      });

      return ok({ payload: { deleted: true }, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
