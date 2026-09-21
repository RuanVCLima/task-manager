import { Router } from 'express';

import { userRoutes } from './users-routes';
import { sessionsRoutes } from './sessions-routes';
import { ensureAthenticated } from '../middleware/ensure-authenticated';
import { teamsRoutes } from './teams-routes';
import { teamMembersRoutes } from './team-members-routes';
import { taskRoutes } from './task-routes';

const routes = Router();

//public routes
routes.use('/users', userRoutes);
routes.use('/sessions', sessionsRoutes);

//private routes
routes.use(ensureAthenticated);
routes.use('/teams', teamsRoutes);
routes.use('/team-members', teamMembersRoutes);
routes.use('/tasks', taskRoutes);

export { routes };
