// 05-2-2 this를 조심하라 - checkedInAttendeeCounter 모듈의 단위 테스트

describe('Conference.checkedInAttendeeCounter', function() {
  var counter;

  beforeEach(function() {
    counter = Conference.checkedInAttendeeCounter();
  });

  describe('increment()', function() {
    // increment 테스트
  });

  describe('getCount()', function() {
    // getCount 테스트
  });

  describe('countIfCheckedIn(attendee)', function() {
    var attendee;

    beforeEach(function() {
      attendee = Conference.attendee('태영', '김');
    });

    it('참가자가 체크인하지 않으면 인원수를 세지 않는다', function() {
      counter.countIfCheckedIn(attendee);
      expect(counter.getCount()).toBe(0);
    });

    it('참가자가 체크인하면 인원수를 센다', function() {
      attendee.checkIn();
      counter.countIfCheckedIn(attendee);
      expect(counter.getCount()).toBe(1);
    });
  });
});
