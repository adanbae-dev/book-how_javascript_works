# 1장 [이름]

- 변수 이름 길이에 제한 없음

- 이름만 보고도 무엇을 하는 것인지 짐작할 수 있게 만들기

- 수수께끼 같은 이름 피하기

- 수학자들은 알아보기 힘든 간결한 표기 방식을 좋아함

- 개발자들은 코드를 읽기만 해도 프로그램을 설명할 수 있어야 한다는 사실을 수없이 많은 시행착오 끝에 깨달음

- 모든 이름은 문자로 시작해 문자로 끝내기

- 서수형 변수 : thing_nr

```
    첫번째 사람 : person_one
```

- 기수형 변수 : nr_things

```
    두번째 사람 : two_persons
```

- 모든 생성자 함수의 이름은 대문자로 시작, 그렇지 않은 경우 소문자로 시작

# 2장 [숫자]

- 진짜 실수(real number) 아님

### 영(0)

```
    (1 / 0) === (1 / -0)        // false
    (Object.is(0, -0))          // false
```
