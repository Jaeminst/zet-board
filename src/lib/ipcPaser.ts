import { toast } from 'sonner'

export function ipcParser(response: string) {
  const parsedResponse = JSON.parse(response);
  if (parsedResponse.success) {
    return parsedResponse.data
  }
  if (!parsedResponse.success) {
    toast(`Error`, {
      description: `${parsedResponse.data}`,
      duration: 5000
    });
    return {}
  }
  throw new Error('data is Null');
}