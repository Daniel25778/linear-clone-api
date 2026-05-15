import { Router } from 'express';
import {
  deleteIssueController,
  findIssueController,
  findOneIssueController,
  insertIssueController,
  updateIssueController,
  updateIssuePositionController,
  updateIssueStatusController
} from '@application/controller/issue';

export default (inputRouter: Router): void => {
  const router = Router();

  router.get('/', findIssueController());
  router.post('/', insertIssueController());
  router.get('/:id', findOneIssueController());
  router.delete('/:id', deleteIssueController());
  router.put('/:id', updateIssueController());
  router.patch('/:id/position', updateIssuePositionController());
  router.patch('/:id/status', updateIssueStatusController());

  inputRouter.use('/issue', router);
};
