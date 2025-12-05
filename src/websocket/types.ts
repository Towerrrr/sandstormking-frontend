export interface WSMessage {
  type: string
  description?: string
  gameMessage?: GameMessage
}

export interface GameMessage {
  type: string
  description?: string
  userIds?: Set<number>
  body?: any
}

export interface RoomInitRequest {
  roomId: number
  playerCount: number
  version: string
  userIds: string[]
}

export interface ConfirmChoiceRequest {
  optionId: number
  selectedCardInstanceIds: number[]
}
