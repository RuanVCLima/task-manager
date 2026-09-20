import { Router } from 'express';
import { TeamMembersController } from '../controller/team-members-controller';
import { verifyUserAuthorization } from '../middleware/verify-user-authorization';

const teamMembersRoutes = Router();
const teamMembersController = new TeamMembersController();

teamMembersRoutes.post(
  '/',
  verifyUserAuthorization(['admin']),
  teamMembersController.create,
);

teamMembersRoutes.get('/', teamMembersController.index);

export { teamMembersRoutes };
