import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDTO } from './DTO/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import e from 'express';

const mockUser = {
  id: 1,
  username: 'Mana'
}

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

describe('TaskService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository, useFactory: mockTaskRepository 
        },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('Some Value');
      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const filters: GetTasksFilterDTO = {
        status: TaskStatus.IN_PROGRESS,
        search: "Query this bitch",
      };

      const result = await tasksService.getTasks(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('Some Value');
    })
  });

  describe('getTaskById', () => {
    it('calls taskRepository.findOne() and successfully retrieve and return the task', async () => {
      const mockTask = {
        title: "test", 
        description: "test2",
      }
      taskRepository.findOne.mockResolvedValue(mockTask);
      
      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id,
        }
      });
    });

    it('throws an error if a task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTask', () => {
    it('calls taskRepository.create() and returns the result', async () => {
      taskRepository.createTask.mockResolvedValue('Sometask');
      expect(taskRepository.createTask).not.toHaveBeenCalled();
      const createTaskDTO = {
        title: 'test task',
        description: 'sdsfsdfsdfds',
      };
      const result = await taskRepository.createTask(createTaskDTO, mockUser);
      expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDTO, mockUser);
      expect(result).toEqual('Sometask');
    });
  });

  describe('deleteTask', () => {
    it('calls taskRepository.deleteTask() to delete the task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      expect(taskRepository.delete).not.toHaveBeenCalled();
      await tasksService.deleteTask(1, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });

    it('throws an error as a task could not be found', () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTaskStatus', () => {
    it('updates a status of a task', async () => {
      const save = jest.fn().mockResolvedValue(true);
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save,
      });
      
      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();

      const result = await tasksService.updateTaskStatus(1, TaskStatus.DONE, mockUser);
      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
})