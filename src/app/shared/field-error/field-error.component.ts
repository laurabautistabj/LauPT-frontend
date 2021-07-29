import {Component, Input, ViewEncapsulation} from '@angular/core';
import {AbstractControl} from '@angular/forms';

@Component({
  selector: 'app-field-error',
  templateUrl: './field-error.component.html',
  encapsulation: ViewEncapsulation.None
})
export class FieldErrorComponent {
  @Input() fieldCtrl: AbstractControl;
}
