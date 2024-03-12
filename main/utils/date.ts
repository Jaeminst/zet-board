export function getDate() {
  const koreaTime = new Date(new Date().getTime() + (9 * 60 * 60 * 1000));
  const date = `${koreaTime.toISOString().replace(/Z$/, '')}+09:00`
  return date
}