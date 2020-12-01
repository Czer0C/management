import { Injectable, NotFoundException } from '@nestjs/common';
import { timeStamp } from 'console';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDTO } from './DTO/create-task.dto';
import { UpdateTaskDTO } from './DTO/update-task.dto';
import { GetTasksFilterDTO } from './DTO/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks; 
  }

  getTasksWithFilters(filterDTO: GetTasksFilterDTO): Task[] {
    const { status, search } = filterDTO;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(task => 
        task.title.includes(search) || 
        task.description.includes(search),
      );
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const find = this.tasks.find(task => task.id === id);

    if (!find) {
      throw new NotFoundException(  );
    }

    return find;
  }

  createTask(createTaskDTO: CreateTaskDTO): Task {
    const { title, description } = createTaskDTO;

    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  updateTask(id: string, status: TaskStatus): Task {
    let task = this.getTaskById(id);
    task.status = status;
    return task;
  }

  deleteTask(id: string): Task {
    const find = this.getTaskById(id);
    this.tasks = this.tasks.filter(task => task.id !== find.id);
    return find;
  }
}