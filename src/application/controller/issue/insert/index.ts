import { errorLogger, messageErrorResponse, ok } from '@main/utils';
import { getAuth } from '@clerk/express';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { IssuePriority, IssueStatus } from '@prisma/client';
import type { Request, Response } from 'express';

interface Body {
  title: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  assigneeId?: string;
  cycleId?: string;
}

export const insertIssueController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { userId: clerkId } = getAuth(request);
      const { teamId } = request.params;
      const { title, description, status, priority, assigneeId, cycleId } = request.body as Body;

      const user = await prisma.user.findUnique({
        select: { id: true },
        where: { clerkId: clerkId ?? '' }
      });

      if (user === null)
        return messageErrorResponse({ error: new Error('User not found'), response });

      const lastIssue = await prisma.issue.findFirst({
        orderBy: { position: 'desc' },
        select: { position: true },
        where: { teamId }
      });

      const position = (lastIssue?.position ?? 0) + 1;

      const payload = await prisma.issue.create({
        data: {
          assigneeId,
          creatorId: user.id,
          cycleId,
          description,
          position,
          priority,
          status,
          teamId,
          title
        }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
