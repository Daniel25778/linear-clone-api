import { errorLogger, messageErrorResponse, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

interface Body {
  name: string;
  identifier: string;
}

export const insertTeamController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { workspaceId } = request.params;
      const { name, identifier } = request.body as Body;

      const payload = await prisma.team.create({
        data: { identifier, name, workspaceId }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
