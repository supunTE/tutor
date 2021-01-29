import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linebr'
})
export class LinebrPipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/\\n/g, '\n');
  }

}
