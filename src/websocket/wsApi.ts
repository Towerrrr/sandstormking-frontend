import { WSMessageTypeEnum, ChallengerMessageTypeEnum } from './MessageTypeEnums'
import type { WSMessage, GameMessage, BuildDeckRequest, InitGameRequest } from './types'

// WebSocket 发送函数的引用，需要从外部设置
let sendMessageFn: ((message: any) => void) | null = null

// 初始化函数，用于设置 sendMessage 函数
export function initWsApi(sendMessage: (message: any) => void) {
  sendMessageFn = sendMessage
}

// 内部发送消息的辅助函数
function send(message: WSMessage) {
  if (sendMessageFn) {
    sendMessageFn(message)
  } else {
    console.error('wsApi 未初始化，请先调用 initWsApi')
  }
}

export function wsInfoMessage(description?: string) {
  send({
    type: WSMessageTypeEnum.INFO,
    description,
  })
}

export function wsErrorMessage(description?: string) {
  send({
    type: WSMessageTypeEnum.ERROR,
    description,
  })
}

export function wsRoomStateChanged(description?: string) {
  send({
    type: WSMessageTypeEnum.ROOM_STATE_CHANGED,
    description,
  })
}

export function wsStartGame(roomId: number) {
  send({
    type: WSMessageTypeEnum.START_GAME,
    gameMessage: {
      type: ChallengerMessageTypeEnum.INIT_GAME,
      body: {
        roomId,
        playerCount: 2,
        version: 'version-1',
        userIds: ['1981742831273775106', '1989230020169609218'],
      } as InitGameRequest,
    },
  })
}

// region Challenger

const CHALLENGER = 'CHALLENGER'

export function wsChallengerEndGame() {
  send({
    type: WSMessageTypeEnum.CHALLENGER,
    gameMessage: {
      type: ChallengerMessageTypeEnum.END_GAME,
    },
  })
}

export function wsChallengerGetPlayer() {
  send({
    type: WSMessageTypeEnum.CHALLENGER,
    gameMessage: {
      type: ChallengerMessageTypeEnum.GET_PLAYER,
    },
  })
}

export function wsChallengerGetBattlefield(body: string) {
  send({
    type: WSMessageTypeEnum.CHALLENGER,
    gameMessage: {
      type: ChallengerMessageTypeEnum.GET_BATTLEFIELD,
      body,
    },
  })
}

export function wsChallengerGetRoomState() {
  send({
    type: WSMessageTypeEnum.CHALLENGER,
    gameMessage: {
      type: ChallengerMessageTypeEnum.GET_ROOM_STATE,
    },
  })
}

export function wsChallengerBuildDeck(body: BuildDeckRequest) {
  send({
    type: WSMessageTypeEnum.CHALLENGER,
    gameMessage: {
      type: ChallengerMessageTypeEnum.BUILD_DECK,
      body,
    },
  })
}

export function wsChallengerReadyBattle(body: string) {
  send({
    type: WSMessageTypeEnum.CHALLENGER,
    gameMessage: {
      type: ChallengerMessageTypeEnum.READY_BATTLE,
      body,
    },
  })
}

export function wsChallengerDiscardCard(body: number[]) {
  send({
    type: CHALLENGER,
    gameMessage: {
      type: ChallengerMessageTypeEnum.DISCARD_CARD,
      body,
    },
  })
}

// endregion
