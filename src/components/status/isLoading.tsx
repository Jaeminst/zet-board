'use client';
export function IsLoading() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen space-y-4 text-center">
      <div className="flex items-center justify-center space-x-3">
        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700 animate-ping-1" />
        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700 animate-ping-2" />
        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700 animate-ping-3" />
      </div>
    </div>
  )
}
