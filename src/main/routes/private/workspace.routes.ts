import { Role } from '@prisma/client';
import { Router } from 'express';
import { deleteUserController } from '@application/controller/user';
import {
  findOneWorkspaceController,
  findWorkspaceController,
  insertWorkspaceController,
  updateWorkspaceController
} from '@application/controller/workspace';
import { requireRole } from '@main/middleware/role';

export default (inputRouter: Router): void => {
  const router = Router();

  router.get('/', findWorkspaceController());
  router.post('/', insertWorkspaceController());
  router.get('/:id', findOneWorkspaceController());
  router.put('/:id', updateWorkspaceController());
  router.delete('/:id', requireRole([Role.OWNER]), deleteUserController());

  inputRouter.use('/workspace', router);
};
