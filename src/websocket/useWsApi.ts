import { WSMessageTypeEnum, ChallengerMessageTypeEnum } from './MessageTypeEnums'
import type { WSMessage, BuildDeckRequest, InitGameRequest } from './types'

let sendMessageFn: ((message: any) => void) | null = null

export function initWsApi(sendMessage: (message: any) => void) {
  sendMessageFn = sendMessage
}

function send(message: WSMessage) {
  if (sendMessageFn) {
    sendMessageFn(message)
  } else {
    console.error('wsApi 未初始化，请先调用 initWsApi')
  }
}

export function useWsMessages() {
  const wsInfoMessage = (description?: string) => {
    send({
      type: WSMessageTypeEnum.INFO,
      description,
    })
  }

  const wsErrorMessage = (description?: string) => {
    send({
      type: WSMessageTypeEnum.ERROR,
      description,
    })
  }

  const wsRoomStateChanged = (description?: string) => {
    send({
      type: WSMessageTypeEnum.ROOM_STATE_CHANGED,
      description,
    })
  }

  const wsStartGame = (body: InitGameRequest) => {
    send({
      type: WSMessageTypeEnum.START_GAME,
      gameMessage: {
        type: ChallengerMessageTypeEnum.INIT_GAME,
        body,
      },
    })
  }

  return {
    wsInfoMessage,
    wsErrorMessage,
    wsRoomStateChanged,
    wsStartGame,
  }
}

export function useChallenger() {
  const wsChallengerEndGame = () => {
    send({
      type: WSMessageTypeEnum.CHALLENGER,
      gameMessage: {
        type: ChallengerMessageTypeEnum.END_GAME,
      },
    })
  }

  const wsChallengerGetPlayer = () => {
    send({
      type: WSMessageTypeEnum.CHALLENGER,
      gameMessage: {
        type: ChallengerMessageTypeEnum.GET_PLAYER,
      },
    })
  }

  const wsChallengerGetBattlefield = (body: string) => {
    send({
      type: WSMessageTypeEnum.CHALLENGER,
      gameMessage: {
        type: ChallengerMessageTypeEnum.GET_BATTLEFIELD,
        body,
      },
    })
  }

  const wsChallengerGetRoomState = () => {
    send({
      type: WSMessageTypeEnum.CHALLENGER,
      gameMessage: {
        type: ChallengerMessageTypeEnum.GET_ROOM_STATE,
      },
    })
  }

  const wsChallengerBuildDeck = (body: BuildDeckRequest) => {
    send({
      type: WSMessageTypeEnum.CHALLENGER,
      gameMessage: {
        type: ChallengerMessageTypeEnum.BUILD_DECK,
        body,
      },
    })
  }

  const wsChallengerReadyBattle = (body: string) => {
    send({
      type: WSMessageTypeEnum.CHALLENGER,
      gameMessage: {
        type: ChallengerMessageTypeEnum.READY_BATTLE,
        body,
      },
    })
  }

  const wsChallengerDiscardCard = (body: number[]) => {
    send({
      type: 'CHALLENGER',
      gameMessage: {
        type: ChallengerMessageTypeEnum.DISCARD_CARD,
        body,
      },
    })
  }

  return {
    wsChallengerEndGame,
    wsChallengerGetPlayer,
    wsChallengerGetBattlefield,
    wsChallengerGetRoomState,
    wsChallengerBuildDeck,
    wsChallengerReadyBattle,
    wsChallengerDiscardCard,
  }
}