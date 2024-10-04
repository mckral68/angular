export interface SellerQuestion {
  messages: Message[];
  subjectId: string;
  userId: string;
  isAnswered: boolean;
  fullName: string;
  orderId: string;
  id: string;
  name: string;
  orderNumber: string;
  createdDate: Date;
  seen: boolean;
  status: number;
  updatedDate: Date;
  ticketNumber: string;
}
export interface AnswerMessage {
  id: string;
  message: Message;
}
export interface Message {
  text: string;
  owner: boolean;
  createdDate: Date;
}
