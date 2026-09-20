import { Router } from 'express';

import { userRoutes } from './users-routes';

const routes = Router();

//public routes
routes.use(userRoutes);

export { routes };
