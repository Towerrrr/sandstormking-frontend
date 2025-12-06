import { WSMessageTypeEnum, ChallengerMessageTypeEnum } from './MessageTypeEnums'
import type { WSMessage, GameMessage, BuildDeckRequest, InitGameRequest } from './types'

export function wsInfoMessage(description?: string): WSMessage {
  return {
    type: WSMessageTypeEnum.INFO,
    description,
  }
}

export function wsErrorMessage(description?: string): WSMessage {
  return {
    type: WSMessageTypeEnum.ERROR,
    description,
  }
}

export function wsRoomStateChanged(description?: string): WSMessage {
  return {
    type: WSMessageTypeEnum.ROOM_STATE_CHANGED,
    description,
  }
}

export function wsStartGame(roomId: number): WSMessage {
  return {
    type: WSMessageTypeEnum.START_GAME,
    gameMessage: {
      type: ChallengerMessageTypeEnum.INIT_GAME,
      body: {
        // TODO 先固定
        roomId,
        playerCount: 2,
        version: 'version-1',
        userIds: ['1981742831273775106', '1989230020169609218'],
      } as InitGameRequest,
    },
  }
}

// region Challenger

const CHALLENGER = 'CHALLENGER'

export function wsChallengerEndGame(): WSMessage {
  return {
    type: WSMessageTypeEnum.CHALLENGER,
    gameMessage: {
      type: ChallengerMessageTypeEnum.END_GAME,
    },
  }
}

export function wsChallengerRefresh(): WSMessage {
  return {
    type: WSMessageTypeEnum.CHALLENGER,
    gameMessage: {
      type: ChallengerMessageTypeEnum.REFRESH,
    },
  }
}

export function wsChallengerBuildDeck(body: BuildDeckRequest): WSMessage {
  return {
    type: WSMessageTypeEnum.CHALLENGER,
    gameMessage: {
      type: ChallengerMessageTypeEnum.BUILD_DECK,
      body,
    },
  }
}

export function wsChallengerReadyBattle(): WSMessage {
  return {
    type: WSMessageTypeEnum.CHALLENGER,
    gameMessage: {
      type: ChallengerMessageTypeEnum.READY_BATTLE,
    },
  }
}

export function wsChallengerDiscardCard(body: number[]): WSMessage {
  return {
    type: CHALLENGER,
    gameMessage: {
      type: ChallengerMessageTypeEnum.DISCARD_CARD,
      body,
    },
  }
}

// endregion

// 用法：
// import { sendMessage } from 'useWebSocket.ts'
// sendMessage(wsChallengerDrawCard())
