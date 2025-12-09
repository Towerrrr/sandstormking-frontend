/**
 * 格式化时间戳为本地时间字符串
 * @param timestamp 时间戳（毫秒）
 * @returns 格式化后的时间字符串
 */
export function formatTime(timestamp: number | string | undefined): string {
  if (!timestamp) return '-'
  const date = new Date(Number(timestamp))
  return date.toLocaleString('zh-CN')
}

/**
 * 格式化日期为 YYYY-MM-DD
 * @param timestamp 时间戳（毫秒）
 * @returns 格式化后的日期字符串
 */
export function formatDate(timestamp: number | string | undefined): string {
  if (!timestamp) return '-'
  const date = new Date(Number(timestamp))
  return date.toLocaleDateString('zh-CN')
}

/**
 * 格式化时间为相对时间（如：5分钟前）
 * @param timestamp 时间戳（毫秒）
 * @returns 相对时间字符串
 */
export function formatRelativeTime(timestamp: number | string | undefined): string {
  if (!timestamp) return '-'
  const now = Date.now()
  const time = Number(timestamp)
  const diff = now - time

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < 7 * day) {
    return `${Math.floor(diff / day)}天前`
  } else {
    return formatDate(timestamp)
  }
}
