import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder, AbstractControl} from '@angular/forms';

import { Priority, PRIORITIES } from '../priority';
import { Task } from '../task';
import { TaskService } from '../task.service';

import * as moment from 'moment';

@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrls: ['./task-editor.component.css']
})
export class TaskEditorComponent implements OnInit {

  @Input() task!: Task;
  @Output() onRequestClose = new EventEmitter();
  priorities = PRIORITIES;
  formGrp!: FormGroup;

  constructor(private _taskService: TaskService, private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formGrp = this._formBuilder.group({
      description: [ this.task.description, [
          Validators.required,
          Validators.maxLength(50)
        ]
      ],
      priority: [ this.task.priority ],
      startDate: [ moment(this.task.startDate).format('YYYY-MM-DD') ],
      endDate: [ moment(this.task.endDate).format('YYYY-MM-DD') ]
    }, {
      validators: [
          this.startDateBeforeEndDateValidator
      ]
    });

    const controls = this.formGrp.controls;

    controls['startDate'].valueChanges.subscribe(newValue => controls['endDate'].updateValueAndValidity())
  }

  private startDateBeforeEndDateValidator(ctrl: AbstractControl): { [s: string]: boolean } | null {
    if (moment(ctrl.value.startDate).isAfter(ctrl.value.endDate)) {
      return { startDateIsAfterEndDate: true };
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
    console.log(this.formGrp.value)
    if (this.formGrp.valid) {
      const formGrpValue = this.formGrp.value;
      this.task.description = formGrpValue.description;
      this.task.priority = formGrpValue.priority;
      this.task.startDate = moment(formGrpValue.startDate).toDate();
      this.task.endDate = moment(formGrpValue.endDate).toDate();

      this._taskService.updateTask(this.task);
      this.close();
    }
  }
}
