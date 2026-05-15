import { errorLogger, messageErrorResponse, notFound, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

interface Body {
  position: number;
}

export const updateIssuePositionController: Controller =
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

      const { position } = request.body as Body;

      const payload = await prisma.issue.update({
        data: { position },
        where: { id: request.params.id }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
