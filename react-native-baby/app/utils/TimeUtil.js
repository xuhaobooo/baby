export function formatTimeFull(date:Date) {
  const result = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  return result
}

export function formatTimeShort(date:Date) {
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}