import { Router } from 'express';
import { TaskController } from '../controller/task-controller';

const taskRoutes = Router();
const taskController = new TaskController();

taskRoutes.post('/', taskController.create);
taskRoutes.get('/:id', taskController.index);
taskRoutes.get('/', taskController.show);
taskRoutes.patch('/:id', taskController.update);

export { taskRoutes };
