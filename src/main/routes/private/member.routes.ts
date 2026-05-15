import { Role } from '@prisma/client';
import { Router } from 'express';
import { deleteMemberController, insertMemberController } from '@application/controller/member';
import { findMemberController } from '@application/controller/member/find';
import { requireRole } from '@main/middleware/role';

export default (inputRouter: Router): void => {
  const router = Router();

  router.get('/', findMemberController());
  router.post('/', insertMemberController());
  router.delete(
    '/:workspaceId/:userId',
    requireRole([Role.ADMIN, Role.OWNER]),
    deleteMemberController()
  );

  inputRouter.use('/member', router);
};
