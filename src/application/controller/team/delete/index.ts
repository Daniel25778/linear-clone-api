import { errorLogger, messageErrorResponse, notFound, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

export const deleteTeamController: Controller =
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

      await prisma.team.delete({
        where: { id: request.params.id }
      });

      return ok({ payload: { deleted: true }, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
