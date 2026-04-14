import express from 'express';
const router = express.Router();

import {getTasks, createTask, editTask, deleteTask, getTasksFilter, getTask} from '../controllers/task.controller.js';

router.get('/', getTasks);  // cambiar get por post
router.post('/createTask',createTask);
router.put('/editTask',editTask);
router.delete('/deleteTask',deleteTask);
router.get('/filterCategory',getTasksFilter);
router.get('/getTask',getTask);



export default router;