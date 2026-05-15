import { errorLogger, messageErrorResponse, notFound, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

interface Body {
  name?: string;
  slug?: string;
}

export const updateWorkspaceController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { name, slug } = request.body as Body;

      const workspace = await prisma.workspace.findUnique({
        select: { id: true },
        where: { id: request.params.id }
      });

      if (workspace === null)
        return notFound({
          entity: { english: 'Workspace', portuguese: 'Workspace' },
          response
        });

      const payload = await prisma.workspace.update({
        data: { name, slug },
        where: { id: request.params.id }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
