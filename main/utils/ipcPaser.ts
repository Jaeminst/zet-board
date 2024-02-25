export function ipcParser(request: string) {
  return JSON.parse(request);
}