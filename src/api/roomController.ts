// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addRoom POST /api/room/add */
export async function addRoomUsingPost(body: API.RoomAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseRoom_>('/api/room/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getRoom GET /api/room/get */
export async function getRoomUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRoomUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseRoom_>('/api/room/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** joinRoom GET /api/room/join */
export async function joinRoomUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.joinRoomUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseRoom_>('/api/room/join', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** listRooms GET /api/room/list */
export async function listRoomsUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listRoomsUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListRoom_>('/api/room/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** quitRoom GET /api/room/quit */
export async function quitRoomUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.quitRoomUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/room/quit', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}
