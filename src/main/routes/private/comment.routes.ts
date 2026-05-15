import { Router } from 'express';
import { deleteCommentController } from '@application/controller/comment/delete';
import { findCommentController } from '@application/controller/comment/find';
import { insertCommentController } from '@application/controller/comment/insert';

export default (inputRouter: Router): void => {
  const router = Router();

  router.get('/', findCommentController());
  router.post('/', insertCommentController());
  router.delete('/:id', deleteCommentController());

  inputRouter.use('/comment', router);
};
