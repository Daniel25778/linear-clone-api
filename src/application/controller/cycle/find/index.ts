import { errorLogger, messageErrorResponse, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

export const findCycleController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { teamId } = request.params;

      const payload = await prisma.cycle.findMany({
        include: {
          _count: { select: { issues: true } }
        },
        orderBy: { startDate: 'desc' },
        where: { teamId }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
