/**
 * 숫자 분해하기
 * 자바스크립트 number
 * 64비트 2진 부동소수점 타입
 * 부호 * 유효숫자 *( 2 ** 지수)
 * @param {*} number
 */
function deconstruct(number) {
  // number = sign * significand * (2 ** exponent)
  // number = sign * coefficient * (2 ** exponent)

  let sign = 1; // 부호
  let coefficient = number; // 유효숫자 => 정수 계수
  let exponent = 0; // 지수

  // 계수 부호 제거
  if (coefficient < 0) {
    coefficient = -coefficient;
    sign = -1;
  }

  // 계수 줄이기
  if (Number.isFinite(number) && number !== 0) {
    // Number.MIN_VALUE 지수 값 - 유효숫자 비트개수 - 보너스 비트 개수
    exponent = -1128;
    let reduction = coefficient;

    while (reduction !== 0) {
      exponent += 1;
      reduction /= 2;
    }

    reduction = exponent;
    while (reduction > 0) {
      coefficient /= 2;
      reduction -= 1;
    }

    while (reduction < 0) {
      coefficient *= 2;
      reduction += 1;
    }
  }
  return {
    sign,
    coefficient,
    exponent,
    number,
  };
}
console.log(Number.MAX_SAFE_INTEGER);
// Number.MAX_SAFE_INTEGER => 부호가 잇는 54비트 정수
console.log(deconstruct(Number.MAX_SAFE_INTEGER));
console.log(deconstruct(1));
console.log(deconstruct(1 / 10));
