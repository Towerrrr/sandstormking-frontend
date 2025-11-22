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

  type BaseResponseListUserVO_ = {
    code?: number
    data?: UserVO[]
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

  type BaseResponseUser_ = {
    code?: number
    data?: User
    message?: string
  }

  type BaseResponseUserVO_ = {
    code?: number
    data?: UserVO
    message?: string
  }

  type getRoomUsingGETParams = {
    /** roomId */
    roomId: number
  }

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number
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

  type quitRoomUsingGETParams = {
    /** roomId */
    roomId: number
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

  type User = {
    createTime?: string
    editTime?: string
    id?: number
    isDelete?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userPassword?: string
    userProfile?: string
    userRole?: string
  }

  type UserBatchGetRequest = {
    userIdList?: number[]
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

  type UserVO = {
    createTime?: string
    id?: number
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }
}
