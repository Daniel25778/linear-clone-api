import { badRequest, errorLogger, messageErrorResponse, notFound, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

export const deleteMemberController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { workspaceId, userId } = request.params;

      const member = await prisma.member.findUnique({
        select: { id: true, role: true },
        where: { userId_workspaceId: { userId, workspaceId } }
      });

      if (member === null)
        return notFound({
          entity: { english: 'Member', portuguese: 'Membro' },
          response
        });

      if (member.role === 'OWNER')
        return badRequest({
          message: {
            english: 'Cannot remove workspace owner',
            portuguese: 'Não é possível remover o proprietário do workspace'
          },
          response
        });

      await prisma.member.delete({
        where: { userId_workspaceId: { userId, workspaceId } }
      });

      return ok({ payload: { deleted: true }, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
