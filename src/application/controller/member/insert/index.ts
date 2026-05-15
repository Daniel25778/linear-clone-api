import { badRequest, errorLogger, messageErrorResponse, ok } from '@main/utils';
import { messages } from '@domain/helpers';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';
import type { Role } from '@prisma/client';

interface Body {
  userId: string;
  role?: Role;
}

export const insertMemberController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { workspaceId } = request.params;
      const { userId, role } = request.body as Body;

      const existing = await prisma.member.findUnique({
        select: { id: true },
        where: { userId_workspaceId: { userId, workspaceId } }
      });

      if (existing !== null)
        return badRequest({ message: messages.auth.userAlreadyExists, response });

      const payload = await prisma.member.create({
        data: { role, userId, workspaceId },
        include: {
          user: { select: { avatar: true, email: true, id: true, name: true } }
        }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
