import { Router } from 'express';
import { deleteLabelController } from '@application/controller/label/delete';
import { findLabelController } from '@application/controller/label/find';
import { insertLabelController } from '@application/controller/label/insert';

export default (inputRouter: Router): void => {
  const router = Router();

  router.get('/', findLabelController());
  router.post('/', insertLabelController());
  router.delete('/:id', deleteLabelController());

  inputRouter.use('/label', router);
};
