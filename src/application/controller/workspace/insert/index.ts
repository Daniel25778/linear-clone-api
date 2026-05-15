import { errorLogger, messageErrorResponse, ok } from '@main/utils';
import { getAuth } from '@clerk/express';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

interface Body {
  name: string;
  slug: string;
}

export const insertWorkspaceController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { userId: clerkId } = getAuth(request);

      const user = await prisma.user.findUnique({
        select: { id: true },
        where: { clerkId: clerkId ?? '' }
      });

      if (user === null)
        return messageErrorResponse({ error: new Error('User not found'), response });

      const { name, slug } = request.body as Body;

      const payload = await prisma.workspace.create({
        data: {
          members: {
            create: {
              role: 'OWNER',
              userId: user.id
            }
          },
          name,
          ownerId: user.id,
          slug
        }
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
