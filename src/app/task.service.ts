import { Task } from './task';
import { Priority } from './priority';
import { Injectable } from '@angular/core';

@Injectable()
export abstract class TaskService {
  abstract getAllTasks(): Task[];
  abstract addTask(task: Task): Task[];
  abstract removeTask(task: Task): Task[];
  abstract updateTask(task: Task): Task[];
}
