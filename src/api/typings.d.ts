declare namespace API {
  type BaseResponseBoolean_ = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseListRoom_ = {
    code?: number
    data?: Room[]
    message?: string
  }

  type BaseResponseLoginUserVO_ = {
    code?: number
    data?: LoginUserVO
    message?: string
  }

  type BaseResponseLong_ = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponseRoom_ = {
    code?: number
    data?: Room
    message?: string
  }

  type BaseResponseString_ = {
    code?: number
    data?: string
    message?: string
  }

  type joinRoomUsingGETParams = {
    /** roomId */
    roomId: number
  }

  type listRoomsUsingGETParams = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
  }

  type LoginUserVO = {
    createTime?: string
    id?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type Room = {
    createdTime?: number
    id?: number
    maxPlayers?: number
    name?: string
    ownerId?: number
    playerIds?: number[]
  }

  type RoomAddRequest = {
    maxPlayers?: number
    name?: string
  }

  type UserLoginRequest = {
    userAccount?: string
    userPassword?: string
  }

  type UserRegisterRequest = {
    checkPassword?: string
    userAccount?: string
    userPassword?: string
  }
}
