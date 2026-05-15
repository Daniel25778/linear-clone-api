import { errorLogger, messageErrorResponse, notFound, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

interface Body {
  name?: string;
  identifier?: string;
}

export const updateTeamController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const team = await prisma.team.findUnique({
        select: { id: true },
        where: { id: request.params.id }
      });

      if (team === null)
        return notFound({
          entity: { english: 'Team', portuguese: 'Time' },
          response
        });

      const { name, identifier } = request.body as Body;

      const payload = await prisma.team.update({
        data: { identifier, name },
        where: { id: request.params.id }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
