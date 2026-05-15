import { Router } from 'express';
import { deleteCycleController } from '@application/controller/cycle/delete';
import { findCycleController } from '@application/controller/cycle/find';
import { findOneCycleController } from '@application/controller/cycle';
import { updateCycleController } from '@application/controller/cycle/update';

export default (inputRouter: Router): void => {
  const router = Router();

  router.get('/', findCycleController());
  router.get('/:id', findOneCycleController());
  router.put('/:id', updateCycleController());
  router.delete('/:id', deleteCycleController());

  inputRouter.use('/cycle', router);
};
