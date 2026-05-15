import { errorLogger, messageErrorResponse, notFound, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

export const deleteUserController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const user = await prisma.user.findUnique({
        select: { id: true },
        where: { id: request.params.id }
      });

      if (user === null)
        return notFound({
          entity: { english: 'User', portuguese: 'Usuário' },
          response
        });

      await prisma.user.delete({
        where: { id: request.params.id }
      });

      return ok({ payload: { deleted: true }, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
