/**
 * 시간 단위에 따른 타이머 함수.
 * @param duration 문자열 형식의 지연 시간 (예: 1s, 1m, 1h, 1d, 1w).
 * @param callback 지연 시간 후 실행할 콜백 함수.
 * 
 * setTimer('1s', () => console.log('1 second passed'));
 */
export function setTimer(duration: string, callback: () => void): void {
  const timeUnit = duration.slice(-1); // 마지막 문자(시간 단위) 추출
  const timeValue = parseInt(duration.slice(0, -1)); // 시간 값 추출

  let timeInMs = 0; // 밀리초로 변환된 시간

  switch(timeUnit) {
    case 's': // 초
      timeInMs = timeValue * 1000;
      break;
    case 'm': // 분
      timeInMs = timeValue * 1000 * 60;
      break;
    case 'h': // 시간
      timeInMs = timeValue * 1000 * 60 * 60;
      break;
    case 'd': // 일
      timeInMs = timeValue * 1000 * 60 * 60 * 24;
      break;
    case 'w': // 주
      timeInMs = timeValue * 1000 * 60 * 60 * 24 * 7;
      break;
    default:
      console.error('Invalid duration unit');
      return;
  }

  setTimeout(callback, timeInMs);
}

/**
 * 시간 단위에 따른 타이머 함수를 비동기로 실행.
 * @param duration 문자열 형식의 지연 시간 (예: 1s, 1m, 1h, 1d, 1w).
 * @param callback 지연 시간 후 실행할 콜백 함수.
 * @returns Promise를 반환하여 비동기 처리를 가능하게 함.
 * 
 * await setTimerAsync('1s', () => console.log('1초가 지났습니다.'));
 */
export function setTimerAsync(duration: string, callback: () => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeUnit = duration.slice(-1); // 마지막 문자(시간 단위) 추출
    const timeValue = parseInt(duration.slice(0, -1)); // 시간 값 추출

    let timeInMs = 0; // 밀리초로 변환된 시간

    switch(timeUnit) {
      case 's': // 초
        timeInMs = timeValue * 1000;
        break;
      case 'm': // 분
        timeInMs = timeValue * 1000 * 60;
        break;
      case 'h': // 시간
        timeInMs = timeValue * 1000 * 60 * 60;
        break;
      case 'd': // 일
        timeInMs = timeValue * 1000 * 60 * 60 * 24;
        break;
      case 'w': // 주
        timeInMs = timeValue * 1000 * 60 * 60 * 24 * 7;
        break;
      default:
        reject(new Error('Invalid duration unit'));
        return;
    }

    setTimeout(() => {
      callback();
      resolve(); // Promise가 성공적으로 완료됨을 알림
    }, timeInMs);
  });
}
