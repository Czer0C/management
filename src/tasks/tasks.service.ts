import { Injectable, NotFoundException } from '@nestjs/common';
import { timeStamp } from 'console';
import { CreateTaskDTO } from './DTO/create-task.dto';
import { UpdateTaskDTO } from './DTO/update-task.dto';
import { GetTasksFilterDTO } from './DTO/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor (
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ){} 
  // private tasks: Task[] = [];

  // getAllTasks(): Task[] {
  //   return this.tasks; 
  // }

  // getTasksWithFilters(filterDTO: GetTasksFilterDTO): Task[] {
  //   const { status, search } = filterDTO;

  //   let tasks = this.getAllTasks();

  //   if (status) {
  //     tasks = tasks.filter(task => task.status === status);
  //   }

  //   if (search) {
  //     tasks = tasks.filter(task => 
  //       task.title.includes(search) || 
  //       task.description.includes(search),
  //     );
  //   }

  //   return tasks;
  // }


  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne(id);

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }

  async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.taskRepository.createTask(createTaskDTO);
  }

  // createTask(createTaskDTO: CreateTaskDTO): Task {
  //   const { title, description } = createTaskDTO;

  //   const task: Task = {
  //     id: uuidv4(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };

  //   this.tasks.push(task);

  //   return task;
  // }

  // updateTask(id: string, status: TaskStatus): Task {
  //   let task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }    
  }
}