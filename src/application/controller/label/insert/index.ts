import { errorLogger, messageErrorResponse, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

interface Body {
  name: string;
  color: string;
}

export const insertLabelController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { name, color } = request.body as Body;

      const payload = await prisma.label.create({
        data: { color, name }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
