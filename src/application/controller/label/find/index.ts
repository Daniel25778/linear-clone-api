import { errorLogger, messageErrorResponse, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

export const findLabelController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const payload = await prisma.label.findMany({
        orderBy: { name: 'asc' }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
