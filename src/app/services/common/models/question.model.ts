export class Questions {
  questions: Question[];
  latest: boolean;
}
export interface Question {
  id: string;
  text: string;
  answer: string;
  userId: string;
  showUserName: boolean;
  firstName: string;
  lastName: string;
  fullName: string;
  name: string;
  createdDate: Date;
  productId: string;
  updatedDate: Date;
  seen: boolean;
  isAnswered: boolean;
}
