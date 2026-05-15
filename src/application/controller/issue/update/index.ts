import { errorLogger, messageErrorResponse, notFound, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { IssuePriority, IssueStatus } from '@prisma/client';
import type { Request, Response } from 'express';

interface Body {
  title?: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  assigneeId?: string;
  cycleId?: string;
}

export const updateIssueController: Controller =
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

      const { title, description, status, priority, assigneeId, cycleId } = request.body as Body;

      const payload = await prisma.issue.update({
        data: { assigneeId, cycleId, description, priority, status, title },
        where: { id: request.params.id }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
