/* eslint-disable no-undefined */
import { Router } from 'express';
import { api } from '@domain/helpers';
import { clerkMiddleware, getAuth } from '@clerk/express';
import { join } from 'path';
import { readdirSync } from 'fs';
import type { Express, NextFunction, Request, Response } from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const { userId } = getAuth(req);

  if (userId === null || userId === undefined || userId === '') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
};

export const setupRoutes = (app: Express): void => {
  const publicRouter = Router();
  const privateRouter = Router();

  app.use(clerkMiddleware());

  readdirSync(join(__dirname, '..', '..', 'routes', 'public')).map(async (file) =>
    (await import(`../../routes/public/${file}`)).default(publicRouter)
  );

  readdirSync(join(__dirname, '..', '..', 'routes', 'private')).map(async (file) =>
    (await import(`../../routes/private/${file}`)).default(privateRouter)
  );

  app.use(api.baseUrl, publicRouter);
  app.use(api.baseUrl, authMiddleware, privateRouter);

  app.get('*', (req, res) => {
    res.json({
      message: 'Api running successfully (◡‿◡)'
    });
  });
};
