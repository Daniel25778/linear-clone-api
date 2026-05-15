import { Role } from '@prisma/client';
import { Router } from 'express';
import {
  deleteTeamController,
  findOneTeamController,
  findTeamController,
  insertTeamController,
  updateTeamController
} from '@application/controller/team';
import { requireRole } from '@main/middleware/role';

export default (inputRouter: Router): void => {
  const router = Router();

  router.get('/', findTeamController());
  router.post('/', insertTeamController());
  router.get('/:id', findOneTeamController());
  router.put('/:id', updateTeamController());
  router.delete('/:workspaceId/:id', requireRole([Role.ADMIN, Role.OWNER]), deleteTeamController());

  inputRouter.use('/team', router);
};
