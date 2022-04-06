import { Component, EventEmitter, Output } from '@angular/core';
import { Task } from '../task';
import { Priority } from '../priority';

@Component({
  selector: 'app-task-creator',
  templateUrl: './task-creator.component.html'
})
export class TaskCreatorComponent {
  newTask!: Task;
  priorities = [Priority.Low, Priority.Normal, Priority.High];

  @Output() onCreated = new EventEmitter<Task>();


  constructor() {
    this.resetTask();
  }

  addTask(task: Task, event: Event): void {
    this.onCreated.emit(task);
    this.resetTask();

    event.preventDefault();
  }

  private resetTask() {
    this.newTask = new Task();
  }

  getNameForPriority(priority: Priority): string {
    return Priority[priority];
  }

}
