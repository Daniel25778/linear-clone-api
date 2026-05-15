import { errorLogger, messageErrorResponse, notFound, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

export const deleteWorkspaceController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const workspace = await prisma.workspace.findUnique({
        select: { id: true },
        where: { id: request.params.id }
      });

      if (workspace === null)
        return notFound({
          entity: { english: 'Workspace', portuguese: 'Workspace' },
          response
        });

      await prisma.workspace.delete({
        where: { id: request.params.id }
      });

      return ok({ payload: { deleted: true }, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
