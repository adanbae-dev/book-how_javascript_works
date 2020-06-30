/**
 * 큰 정수
 * 9E18 -> 9000000000000000000
 * 24bit 단위로 쪼개서 배열로 나타내기
 * 배열의 첫 요소는 부호
 * ["+", 8650752, 7098594, 31974]
 * = 8650752 * (2^24)^0 + 7098594 * (2^24)^1 + 31974 * (2^24)^2
 * = 8650752 + ((7098594 + (31974 * 16777216)) * 16777216)
 */
const big_number = () => {
  const radix = 16777216; // 2^24
  const radix_squared = radix * radix;
  const log2_radix = 24;
  const plus = "+";
  const minus = "-";
  const sign = 0;
  const least = 1;

  const zero = Object.freeze([plus]);
  const wun = Object.freeze([plus, 1]);
  const two = Object.freeze([plus, 2]);
  const ten = Object.freeze([plus, 10]);
  const negative_wun = Object.freeze([minus, 1]);

  // 배열의 마지막 원소 리턴
  function last(array) {
    return array[array.length - 1];
  }

  // 배열의 마지막 앞 원소 리턴
  function next_to_last(array) {
    return array[array.length - 2];
  }

  // predicate function : 반환값이 불(boolean)
  // 매개변수가 big integer 인지 체크 술어함수
  function is_big_integer(big) {
    return Array.isArray(big) && (big[sign] === plus || big[sign] === minus);
  }
  // 매개변수가 - 인지 체크 술어함수
  function is_negative(big) {
    return Array.isArray(big) && big[sign] === minus;
  }

  // 매개변수가 + 인지 체크 술어함수
  function is_positive(big) {
    return Array.isArray(big) && big[sign] === plus;
  }

  // 매개변수가 0 인지 체크 술어함수
  function is_zero(big) {
    return !Array.isArray(big) || big.length < 2;
  }

  /**
   * 배열의 마지막 요소가 0인 경우 제거
   * 상수가 있음 상수 값으로 대체
   * why? 배열의 뒤쪽에 있는 요소들은 실제로 높은 자릿수에 있음
   *
   * @param {} proto_big_integer
   */
  function mint(proto_big_integer) {
    while (last(proto_big_integer) === 0) {
      proto_big_integer.length -= 1;
    }

    if (proto_big_integer.length <= 1) {
      return zero;
    }

    if (proto_big_integer[sign] === plus) {
      if (proto_big_integer.length === 2) {
        if (proto_big_integer[least] === 1) {
          return one;
        }
        if (proto_big_integer[least] === 2) {
          return two;
        }
        if (proto_big_integer[least] === 10) {
          return ten;
        }
      }
    } else if (proto_big_integer.length === 2) {
      if (proto_big_integer[least] === 1) {
        return negative_wun;
      }
    }
    return Object.freeze(proto_big_integer);
  }

  /**
   * 부호 바꾸기
   * @param {*} big
   */
  function neg(big) {
    if (is_zero(big)) {
      return zero;
    }
    let negation = big.slice();
    negation[sign] = is_negative(big) ? plus : minus;
    return mint(negation);
  }

  /**
   * 절댓값
   * @param {*} big
   */
  function abs(big) {
    return is_zero(big) ? zero : is_negative(big) ? neg(big) : big;
  }

  /**
   * 부호 추출하기
   * @param {*} big
   */
  function signum(big) {
    return is_zero(big) ? zero : is_negative(big) ? negative_wun : wun;
  }

  /**
   * int 함수
   * 숫자와 큰 정수값 처리
   * @param {*} big
   */
  function int(big) {
    let result;
    if (typeof big === "number") {
      if (Number.isSafeInteger(big)) {
        return big;
      }
    } else if (is_big_integer(big)) {
      if (big.length < 2) {
        return 0;
      }
      if (big.length === 2) {
        return is_negative(big) ? -big[least] : big[least];
      }
      if (big.length === 3) {
        result = big[least + 1] + radix + big[least];
        return is_negative(big) ? -result : result;
      }
      if (big.lenght === 4) {
        result =
          big[least + 2] * radix_squared + big[least + 1] * radix + big[least];
        if (Number.isSafeInteger(result)) {
          return is_negative(big) ? -result : result;
        }
      }
    }
  }
  /**
   * 두 큰 정수가 동일한 값인지 체크
   * @param {*} comparahend
   * @param {*} comparator
   */
  function eq(comparahend, comparator) {
    return (
      comparahend === comparator ||
      (comparahend.length === comparator.length &&
        comparahend.every(function (element, element_nr) {
          return element === comparator[element_nr];
        }))
    );
  }

  /**
   * absolute less then
   * 큰 정수의 절댓값이 다른 큰 정수의 절댓값보다 작은지 판별
   * @param {*} comparahend
   * @param {*} comparator
   */
  function abs_lt(comparahend, comparator) {
    return comparahend.length === comparator.length
      ? comparahend.reduce(function (reduction, element, element_nr) {
          if (element_nr !== sign) {
            const other = comparator[element_nr];
            if (element !== other) {
              return element < other;
            }
          }
          return reduction;
        }, false)
      : comparahend.length < comparator.length;
  }

  /**
   * less then
   * @param {*} comparahend
   * @param {*} comparator
   */
  function lt(comparahend, comparator) {
    return comparahend[sign] !== comparator[sign]
      ? is_negative(comparahend) // 두 부호가 다를때, 앞 매개변수의 부호값에 따라 크기 비교 가능
      : is_negative(comparahend)
      ? abs_lt(comparator, comparahend) //부호가 음수면
      : abs_lt(comparahend, comparator); // 부호가 양수면
  }

  /**
   * greater or equal ( >= ) ==> 작은게 아니면 됨
   * @param {*} a
   * @param {*} b
   */
  function ge(a, b) {
    return !lt(a, b);
  }

  /**
   * greater ( > )
   * @param {*} a
   * @param {*} b
   */
  function gt(a, b) {
    return lt(b, a);
  }

  /**
   * less or equal ( <= )
   * @param {*} a
   * @param {*} b
   */
  function le(a, b) {
    return !lt(b, a);
  }

  /**
   * 비트 연산 함수
   * 가정 : 비트연산과 부호는 상관이 없음, 출력 "+"
   */

  /**
   * and 함수
   * 둘 중 짧은 배열로 처리, 남는 비튼 영(0)과 and 연산으로 사라짐
   * @param {*} a
   * @param {*} b
   */
  function and(a, b) {
    if (a.length > b.length) {
      // 둘 중 더 짧은 값을 a
      [a, b] = [b, a];
    }
    return mint(
      a.map(function (element, element_nr) {
        return element_nr === sign ? plus : element & b[element_nr];
      })
    );
  }

  /**
   * or 함수
   * @param {*} a
   * @param {*} b
   */
  function or(a, b) {
    if (a.length < b.length) {
      [a, b] = [b, a];
    }
    return mint(
      a.map(function (element, element_nr) {
        return element_nr === sign ? plus : element | (b[element_nr] || 0);
      })
    );
  }

  /**
   * xor 함수
   * @param {*} a
   * @param {*} b
   */
  function xor(a, b) {
    if (a.length < b.length) {
      [a, b] = [b, a];
    }
    return mint(
      a.map(function (element, element_nr) {
        return element_nr === sign ? plus : element ^ (b[element_nr] || 0);
      })
    );
  }
};
