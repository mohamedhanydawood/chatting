export interface Message {
  from: string;
  text: string;
  ts: number;
  roomId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
