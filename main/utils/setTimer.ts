/**
 * 시간 단위에 따른 타이머 함수.
 * @param duration 문자열 형식의 지연 시간 (예: 1s, 1m, 1h, 1d, 1w).
 * @param callback 지연 시간 후 실행할 콜백 함수.
 * 
 * setTimer('1m30s', () => console.log('90 second passed'));
 */
export function setTimer(duration: string, callback: () => void): void {
  // 시간 단위와 값을 분리하는 정규 표현식
  const regex = /(\d+)(s|m|h|d|w)/g;
  let match;
  let timeInMs = 0;

  while ((match = regex.exec(duration)) !== null) {
    const value = parseInt(match[1]);
    const unit = match[2];

    switch(unit) {
      case 's': // 초
        timeInMs += value * 1000;
        break;
      case 'm': // 분
        timeInMs += value * 1000 * 60;
        break;
      case 'h': // 시간
        timeInMs += value * 1000 * 60 * 60;
        break;
      case 'd': // 일
        timeInMs += value * 1000 * 60 * 60 * 24;
        break;
      case 'w': // 주
        timeInMs += value * 1000 * 60 * 60 * 24 * 7;
        break;
    }
  }

  setTimeout(callback, timeInMs);
}

/**
 * 시간 단위에 따른 리피터 함수.
 * @param duration 문자열 형식의 지연 시간 (예: 1s, 1m, 1h, 1d, 1w).
 * @param callback 지연 시간 마다 실행할 콜백 함수.
 * 
 * const intervalId = setRepeater('1m30s', () => console.log('90 second passed'));
 * 
 * clearInterval(intervalId);
 */
export function setRepeater(duration: string, callback: () => Promise<boolean>): NodeJS.Timeout {
  const regex = /(\d+)(s|m|h|d|w)/g;
  let match;
  let timeInMs = 0;

  while ((match = regex.exec(duration)) !== null) {
    const value = parseInt(match[1]);
    const unit = match[2];

    switch(unit) {
      case 's':
        timeInMs += value * 1000;
        break;
      case 'm':
        timeInMs += value * 1000 * 60;
        break;
      case 'h':
        timeInMs += value * 1000 * 60 * 60;
        break;
      case 'd':
        timeInMs += value * 1000 * 60 * 60 * 24;
        break;
      case 'w':
        timeInMs += value * 1000 * 60 * 60 * 24 * 7;
        break;
    }
  }

  const intervalId = setInterval(async () => {
    const shouldContinue = await callback();
    if (!shouldContinue) {
      clearInterval(intervalId);
    }
  }, timeInMs);

  return intervalId;
}
