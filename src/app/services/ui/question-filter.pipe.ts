import { Pipe, PipeTransform } from '@angular/core';
import { Message } from '../common/models/seller-question';

@Pipe({
  name: 'questionFilter',
  standalone: true,
  pure: false,
})
export class QuestionFilterPipe implements PipeTransform {
  transform(messages: Message[], filter: Object[]): Message[] {
    if (!messages || !filter) {
      return messages;
    }
    return messages.filter((m) => m.owner == false);
  }
}
