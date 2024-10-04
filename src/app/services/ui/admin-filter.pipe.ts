import { Pipe, PipeTransform } from '@angular/core';
import { Message } from '../common/models/seller-question';

@Pipe({
  name: 'adminFilter',
  standalone: true,
  pure: false,
})
export class AdminFilterPipe implements PipeTransform {
  transform(messages: Message[], filter: Object[]): Message[] {
    if (!messages || !filter) {
      return messages;
    }
    return messages.filter((m) => m.owner == true);
  }
}
