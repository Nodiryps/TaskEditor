import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder, AbstractControl} from '@angular/forms';

import { Priority, PRIORITIES } from '../priority';
import { Task } from '../task';
import { TaskService } from '../task.service';

import * as moment from 'moment';

@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styles: [`
.w3-modal { display: block; }
`]
})
export class TaskEditorComponent implements OnInit {

  @Input() task!: Task;
  @Output() onRequestClose = new EventEmitter();
  priorities = PRIORITIES;
  formGrp!: FormGroup;

  constructor(private _taskService: TaskService, private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formGrp = this._formBuilder.group({
      'description': [this.task.description, Validators.required, Validators.max(50)],
      'priority': [this.task.priority],
      'startDate': [moment(this.task.startDate).format('YYYY-MM-DD')],
      'endDate': [moment(this.task.endDate).format('YYYY-MM-DD')]
    });
  }

  private startDateBeforeEndDateCrossValidation(ctrl: AbstractControl): { [s: string]: boolean } | null {
    const formGrpValue = this.formGrp.value;
    if (moment(formGrpValue.startDate).isBefore(formGrpValue.endDate)) {
      return {startDateIsAfterEndDate: true};
    }
    return null;
  }

  close(): void {
    this.onRequestClose.emit();
  }

  getNameForPriority(priority: Priority): string {
    return Priority[priority];
  }

  onSubmit(): void {
    const formGrpValue = this.formGrp.value;
    this.task.description = formGrpValue.description;
    this.task.priority = formGrpValue.priority;
    this.task.startDate = moment(formGrpValue.startDate).toDate();
    this.task.endDate = moment(formGrpValue.endDate).toDate();

    this._taskService.updateTask(this.task);
    this.close();
  }
}
