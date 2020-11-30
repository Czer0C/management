import { Injectable } from '@nestjs/common';
import { timeStamp } from 'console';

@Injectable()
export class TasksService {
  private tasks = ['Drill', 'TSF Training', 'Team Building', 'Suffering'];

  getAllTasks() {
    return this.tasks.find(i => i.includes("S"));
  }
}
