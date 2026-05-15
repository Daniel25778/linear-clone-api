import { errorLogger, messageErrorResponse, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

interface Body {
  name: string;
  startDate: string;
  endDate: string;
}

export const insertCycleController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { teamId } = request.params;
      const { name, startDate, endDate } = request.body as Body;

      const payload = await prisma.cycle.create({
        data: {
          endDate: new Date(endDate),
          name,
          startDate: new Date(startDate),
          teamId
        }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
