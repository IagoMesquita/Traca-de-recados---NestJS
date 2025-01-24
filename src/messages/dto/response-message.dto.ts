class ResponseMessageDTO {
  id: number;

  text: string;

  isRead: boolean;

  createDate?: Date;

  updadeDare?: Date;

  from: { id: number };

  to: { id: number };
}
