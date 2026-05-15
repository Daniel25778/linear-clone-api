import { errorLogger, messageErrorResponse, notFound, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

export const deleteLabelController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const label = await prisma.label.findUnique({
        select: { id: true },
        where: { id: request.params.id }
      });

      if (label === null)
        return notFound({
          entity: { english: 'Label', portuguese: 'Label' },
          response
        });

      await prisma.label.delete({
        where: { id: request.params.id }
      });

      return ok({ payload: { deleted: true }, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
