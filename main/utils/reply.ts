export function successMessage(data: unknown): string {
  return JSON.stringify({ success: true, data });
}

export function errorMessage(error: unknown): string {
  let errorMessage = 'Unknown error';
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  return JSON.stringify({ success: false, error: errorMessage });
}
