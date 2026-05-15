import { errorLogger, messageErrorResponse, notFound, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

interface Body {
  name?: string;
  startDate?: string;
  endDate?: string;
}

export const updateCycleController: Controller =
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

      const { name, startDate, endDate } = request.body as Body;

      const payload = await prisma.cycle.update({
        data: {
          endDate: endDate !== undefined ? new Date(endDate) : undefined,
          name,
          startDate: startDate !== undefined ? new Date(startDate) : undefined
        },
        where: { id: request.params.id }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
