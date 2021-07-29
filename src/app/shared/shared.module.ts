import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoaderComponent} from './loader/loader.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../material/material.module';
import {FieldErrorComponent} from './field-error/field-error.component';
import {IMaskModule} from 'angular-imask';
import {DragScrollModule} from 'ngx-drag-scroll';
import {RecaptchaModule} from 'ng-recaptcha';
import {GravatarPipe} from './pipes/gravatar.pipe';
import {MessageDialogComponent} from './message-dialog/message-dialog.component';
import {ChatComponent} from './chat/chat.component';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {VerifyEmailComponent} from './verify-email/verify-email.component';
import {CountDownComponent} from './count-down/count-down.component';

const components = [
  LoaderComponent,
  FieldErrorComponent,
  MessageDialogComponent,
  ChatComponent,
  ConfirmDialogComponent,
  ResetPasswordComponent,
  VerifyEmailComponent,
  CountDownComponent
];

const modules = [
  ReactiveFormsModule,
  MaterialModule,
  IMaskModule,
  DragScrollModule,
  RecaptchaModule
];

const pipes = [
  GravatarPipe
];

@NgModule({
  declarations: [
    ...components,
    ...pipes
  ],
  imports: [
    CommonModule,
    ...modules
  ],
  exports: [
    ...modules,
    ...components,
    ...pipes
  ]
})
export class SharedModule {
}
