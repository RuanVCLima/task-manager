import { Router } from 'express';
import { TeamsController } from '../controller/teams-controller';
import { verifyUserAuthorization } from '../middleware/verify-user-authorization';

const teamsRoutes = Router();
const teamsController = new TeamsController();

teamsRoutes.post(
  '/',
  verifyUserAuthorization(['admin']),
  teamsController.create,
);

teamsRoutes.get('/', verifyUserAuthorization(['admin']), teamsController.index);

teamsRoutes.put(
  '/',
  verifyUserAuthorization(['admin']),
  teamsController.update,
);

export { teamsRoutes };
