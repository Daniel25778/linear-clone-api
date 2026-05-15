import { forbidden } from '@main/utils';
import { getAuth } from '@clerk/express';
import { prisma } from '@infra/database';
import type { NextFunction, Request, Response } from 'express';
import type { Role } from '@prisma/client';

export const requireRole =
  (roles: Role[]) =>
  (request: Request, response: Response, next: NextFunction): void => {
    void (async (): Promise<void> => {
      const { userId: clerkId } = getAuth(request);
      const workspaceId = request.params.workspaceId ?? request.params.id;

      if (clerkId === null || clerkId === undefined || clerkId === '') {
        forbidden({
          message: { english: 'access this resource', portuguese: 'acessar este recurso' },
          response
        });
        return;
      }

      const user = await prisma.user.findUnique({
        select: { id: true },
        where: { clerkId }
      });

      if (user === null) {
        forbidden({
          message: { english: 'access this resource', portuguese: 'acessar este recurso' },
          response
        });
        return;
      }

      const member = await prisma.member.findUnique({
        select: { role: true },
        where: { userId_workspaceId: { userId: user.id, workspaceId } }
      });

      if (member === null || !roles.includes(member.role)) {
        forbidden({
          message: { english: 'access this resource', portuguese: 'acessar este recurso' },
          response
        });
        return;
      }

      next();
    })();
  };
