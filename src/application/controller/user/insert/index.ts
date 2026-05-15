import { errorLogger, messageErrorResponse, ok } from '@main/utils';
import { prisma } from '@infra/database';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

interface ClerkWebhookBody {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
    first_name: string;
    last_name: string;
    image_url: string;
  };
}

export const insertUserController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { type, data } = request.body as ClerkWebhookBody;

      if (type === 'user.created') {
        const email = data.email_addresses[0]?.email_address ?? '';
        const name = `${data.first_name} ${data.last_name}`.trim();

        await prisma.user.create({
          data: {
            avatar: data.image_url,
            clerkId: data.id,
            email,
            name
          }
        });
      }

      return ok({ payload: { received: true }, response });
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response });
    }
  };
