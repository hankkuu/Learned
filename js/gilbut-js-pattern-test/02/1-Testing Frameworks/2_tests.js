// 02-1-1 잘못된 코드 발견하기 - 초기 createReservation 단위 테스트

describe('createReservation(passenger, flight)', function() {
  it('주어진 passenger를 passengerInfo 프로퍼티에 할당한다', function() {
    var testPassenger = {
      firstName: '윤지',
      lastName: '김'
    };

    var testFlight = {
      number: '3443',
      carrier: '대한항공',
      destination: '울산'
    };

    var reservation = createReservation(testPassenger, testFlight);
    expect(reservation.passengerInfomation).toBe(testPassenger);
  });
});
