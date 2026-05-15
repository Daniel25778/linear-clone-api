import { errorLogger, messageErrorResponse, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

export const findTeamController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { workspaceId } = request.params;

      const payload = await prisma.team.findMany({
        include: {
          _count: { select: { issues: true } }
        },
        where: { workspaceId }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
