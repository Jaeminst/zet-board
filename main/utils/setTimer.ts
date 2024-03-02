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
 * 시간 단위에 따른 타이머 함수를 비동기로 실행.
 * @param duration 문자열 형식의 지연 시간 (예: 1s, 1m, 1h, 1d, 1w).
 * @param callback 지연 시간 후 실행할 콜백 함수.
 * @returns Promise를 반환하여 비동기 처리를 가능하게 함.
 * 
 * await setTimerAsync('1h10m30s', () => console.log('4230초가 지났습니다.'));
 */
export function setTimerAsync(duration: string, callback: () => void): Promise<void> {
  return new Promise((resolve, reject) => {
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
        default:
          reject(new Error('Invalid duration format'));
          return;
      }
    }

    if (timeInMs > 0) {
      setTimeout(() => {
        callback();
        resolve();
      }, timeInMs);
    } else {
      reject(new Error('Invalid duration format'));
    }
  });
}
