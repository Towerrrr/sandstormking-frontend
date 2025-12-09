/**
 * 房间成员信息
 */
export interface RoomMember {
  userVo?: API.UserVO
  ready?: boolean
}

/**
 * 房间表单
 */
export interface RoomFormData {
  name: string
  maxPlayers: number
}

/**
 * WebSocket 消息
 */
export interface WSMessage {
  type: string
  data?: any
  message?: string
}

/**
 * 分页参数
 */
export interface PaginationParams {
  current: number
  pageSize: number
}

/**
 * 房间查询参数
 */
export interface RoomQueryParams extends PaginationParams {
  // 可以扩展其他查询参数
}

/**
 * 房间操作回调
 */
export interface RoomOperationCallbacks {
  onSuccess?: () => void | Promise<void>
  onError?: (error: Error) => void
}
