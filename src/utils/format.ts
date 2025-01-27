export const formatPrice = (value: string | number): string => {
    if (!value) return "0";
  
    const numberValue = typeof value === "string" ? parseFloat(value) : value; // 문자열이면 숫자로 변환
    if (isNaN(numberValue)) return value.toString(); // 숫자로 변환 불가 시 문자열 그대로 반환
  
    return new Intl.NumberFormat("ko-KR").format(numberValue); // 숫자 형식에 따라 쉼표 추가
  };


  export const formatTotal = (value: string | number): string => {
    if (!value) return "0";
  
    const numberValue = typeof value === "string" ? parseFloat(value) : value; // 문자열이면 숫자로 변환
    if (isNaN(numberValue)) return value.toString(); // 숫자로 변환 불가 시 문자열 그대로 반환
  
    const integerValue = Math.floor(numberValue); // 소수점 이하 제거
    return new Intl.NumberFormat("ko-KR").format(integerValue); // 쉼표 추가된 형식 반환
  };