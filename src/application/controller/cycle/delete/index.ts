import { errorLogger, messageErrorResponse, notFound, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

export const deleteCycleController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const cycle = await prisma.cycle.findUnique({
        select: { id: true },
        where: { id: request.params.id }
      });

      if (cycle === null)
        return notFound({
          entity: { english: 'Cycle', portuguese: 'Ciclo' },
          response
        });

      await prisma.cycle.delete({
        where: { id: request.params.id }
      });

      return ok({ payload: { deleted: true }, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
