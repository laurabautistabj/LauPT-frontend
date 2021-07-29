import {Pipe, PipeTransform} from '@angular/core';
import {Md5} from 'ts-md5';

@Pipe({
  name: 'gravatar'
})
export class GravatarPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    value = value ? value.toString().trim().toLowerCase() : '';
    return `https://www.gravatar.com/avatar/${Md5.hashStr(value)}?d=identicon`;
  }
}
