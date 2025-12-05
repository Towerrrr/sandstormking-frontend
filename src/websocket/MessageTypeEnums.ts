export enum WSMessageTypeEnum {
  INFO = 'INFO',
  ERROR = 'ERROR',
  ROOM_STATE_CHANGED = 'ROOM_STATE_CHANGED',
  START_GAME = 'START_GAME',
  CHALLENGER = 'CHALLENGER',
}

export enum ChallengerMessageTypeEnum {
  INIT_GAME = 'init_game',
  END_GAME = 'end_game',
  REFRESH = 'refresh',
  DRAW_CARD = 'draw_card',
  DRAW_AGAIN = 'draw_again',
  CONFIRM_CHOICE = 'confirm_choice',
  READY_BATTLE = 'readyBattle',
}
