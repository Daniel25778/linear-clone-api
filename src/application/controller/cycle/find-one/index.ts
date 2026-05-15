import { errorLogger, messageErrorResponse, notFound, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

export const findOneCycleController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const payload = await prisma.cycle.findUnique({
        include: {
          issues: {
            include: {
              assignee: { select: { avatar: true, id: true, name: true } },
              labels: { include: { label: true } }
            },
            orderBy: { position: 'asc' }
          }
        },
        where: { id: request.params.id }
      });

      if (payload === null)
        return notFound({
          entity: { english: 'Cycle', portuguese: 'Ciclo' },
          response
        });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
