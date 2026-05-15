import { ValidationError } from 'yup';
import { errorLogger, messageErrorResponse, ok, validationErrorResponse } from '@main/utils';
import { prisma } from '@infra/database';
import { updateUserSchema } from '@data/validation';
import { userFindParams } from '@data/search';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

interface Body {
  name?: string;
  avatar?: string;
}

export const updateUserController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      await updateUserSchema.validate(request, { abortEarly: false });

      const { name, avatar } = request.body as Body;

      const payload = await prisma.user.update({
        data: { avatar, name },
        select: userFindParams,
        where: { id: request.params.id }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return messageErrorResponse({ error, response });
    }
  };
