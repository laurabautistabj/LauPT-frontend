import {Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {QuestionInterface} from '../../../../interfaces/question.interface';
import {FormControl, Validators} from "@angular/forms";
import {MatSelectionListChange} from "@angular/material/list";

@Component({
  selector: 'app-questionnaire-question',
  templateUrl: './questionnaire-question.component.html',
  styleUrls: ['./questionnaire-question.component.sass']
})
export class QuestionnaireQuestionComponent implements OnInit, OnChanges {
  @Input() question: QuestionInterface;
  @Output() answer = new EventEmitter();
  @Output() cancel = new EventEmitter();
  answerControl = new FormControl('', Validators.required);

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.answerControl.reset();
  }

  async onSubmitAnswer(): Promise<void> {
    this.answer.emit(this.answerControl.value);
  }

  async onSubmitVoidAnswer(): Promise<void> {
    this.answer.emit('');
  }

  async onCancel(): Promise<void> {
    this.cancel.emit(true);
  }

  async onMultipleSelectionChange(event: MatSelectionListChange): Promise<void> {
    this.answerControl.setValue(event.source.selectedOptions.selected.map(u => u.value).join(','));
  }

}
