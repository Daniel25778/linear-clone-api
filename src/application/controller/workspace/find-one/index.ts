import { errorLogger, messageErrorResponse, notFound, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

export const findOneWorkspaceController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const payload = await prisma.workspace.findUnique({
        include: {
          members: {
            select: {
              role: true,
              user: {
                select: { avatar: true, id: true, name: true }
              }
            }
          },
          teams: {
            select: { id: true, identifier: true, name: true }
          }
        },
        where: { id: request.params.id }
      });

      if (payload === null)
        return notFound({
          entity: { english: 'Workspace', portuguese: 'Workspace' },
          response
        });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
