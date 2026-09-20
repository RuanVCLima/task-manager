import { Router } from 'express';

import { userRoutes } from './users-routes';
import { sessionsRoutes } from './sessions-routes';
import { ensureAthenticated } from '../middleware/ensure-authenticated';
import { teamsRoutes } from './teams-routes';

const routes = Router();

//public routes
routes.use('/users', userRoutes);
routes.use('/sessions', sessionsRoutes);

//private routes
routes.use(ensureAthenticated);
routes.use('/teams', teamsRoutes);

export { routes };
