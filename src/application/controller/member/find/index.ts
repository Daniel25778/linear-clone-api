import { errorLogger, messageErrorResponse, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

export const findMemberController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { workspaceId } = request.params;

      const payload = await prisma.member.findMany({
        include: {
          user: { select: { avatar: true, email: true, id: true, name: true } }
        },
        where: { workspaceId }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
