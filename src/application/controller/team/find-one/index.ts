import { errorLogger, messageErrorResponse, notFound, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

export const findOneTeamController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const payload = await prisma.team.findUnique({
        include: {
          _count: { select: { issues: true } },
          cycles: { select: { endDate: true, id: true, name: true, startDate: true } }
        },
        where: { id: request.params.id }
      });

      if (payload === null)
        return notFound({
          entity: { english: 'Team', portuguese: 'Time' },
          response
        });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
