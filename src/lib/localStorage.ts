export function getLocalStorage(item: string, index?: string) {
  // localStorage에서 'item' 항목을 가져옵니다.
  const data = localStorage.getItem(item);
  // 가져온 데이터가 있다면 JSON으로 파싱합니다.
  if (data) {
    const parsedData: ProfileStorage = JSON.parse(data);
    // 'index'가 제공되었고, 해당 'index'가 parsedData 내에 존재하는 경우 해당 데이터를 반환합니다.
    // 'index'가 제공되지 않았거나 존재하지 않는 경우, parsedData 객체 자체를 반환합니다.
    return index && index in parsedData ? parsedData[index] : parsedData;
  }
  // 데이터가 없다면 null을 반환합니다.
  return null;
}

export function setLocalStorage(item: string, index: string, newData?: EditProfileData) {
  // localStorage에서 전체 item (예: 'profileList')을 가져옵니다.
  const data = localStorage.getItem(item);
  if (data) {
    // 데이터가 존재하면, JSON으로 파싱합니다.
    const parsedData: ProfileStorage = JSON.parse(data);

    if (!newData) {
      // newData가 null이면, 해당 인덱스의 데이터를 삭제합니다.
      delete parsedData[index];
    } else {
      // 그렇지 않으면, 특정 인덱스(예: 'dev')에 대한 데이터를 업데이트합니다.
      // 여기서는 기존 데이터를 유지하면서 새 데이터로 오버라이드합니다.
      parsedData[index] = { ...parsedData[index], ...newData };
    }

    // 업데이트된 전체 데이터를 JSON 문자열로 변환하여 다시 localStorage에 저장합니다.
    localStorage.setItem(item, JSON.stringify(parsedData));
  } else {
    // 데이터가 존재하지 않는 경우, 새로운 객체를 생성하여 저장합니다.
    const initialData = { [index]: newData };
    localStorage.setItem(item, JSON.stringify(initialData));
  }
}