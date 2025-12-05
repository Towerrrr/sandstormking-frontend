export interface WSMessage {
  type: string
  description?: string
  gameMessage?: GameMessage
}

export interface GameMessage {
  type: string;
  description?: string;
  userIds?: Set<number>;
  body?: string;
}