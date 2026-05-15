import { Role } from '@prisma/client';
import { Router } from 'express';
import {
  deleteUserController,
  findOneUserController,
  findUserController,
  updateUserController
} from '@application/controller/user';
import { requireRole } from '@main/middleware/role';

export default (inputRouter: Router): void => {
  const router = Router();

  router.get('', findUserController());
  router.get('/:id', findOneUserController());
  router.put('/:id', updateUserController());
  router.delete('/:workspaceId/:id', requireRole([Role.ADMIN, Role.OWNER]), deleteUserController());

  inputRouter.use('/user', router);
};
