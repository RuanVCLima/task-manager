import { Router } from 'express';
import { TaskHistoryController } from '../controller/task-history-controller';

const taskHistoryRoutes = Router();
const taskHistoryController = new TaskHistoryController();

taskHistoryRoutes.get('/:id', taskHistoryController.index);

export { taskHistoryRoutes };
