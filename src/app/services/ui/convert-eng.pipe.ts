import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertEng',
  standalone: true,
})
export class ConvertEngPipe implements PipeTransform {
  transform(input: string): string {
    const trChars = {
      çÇ: 'c',
      ğĞ: 'g',
      şŞ: 's',
      üÜ: 'u',
      ıİ: 'i',
      öÖ: 'o',
    };
    for (const key of Object.keys(trChars)) {
      input = input.replace(new RegExp('[' + key + ']', 'g'), trChars[key]);
    }
    return input
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }
}
