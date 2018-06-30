// 05-1-1 콜백 함수를 사용한 코드의 작성과 테스트 - attendeeCollection.iterate 함수의 단위 테스트

describe('Conference.attendeeCollection', function() {
  describe('contains(attendee)', function() {
    // contains 테스트
  });

  describe('add(attendee)', function() {
    // add 테스트
  });

  describe('remove(attendee)', function() {
    // remove 테스트
  });

  describe('iterate(callback)', function() {
    var collection, callbackSpy;

    // 도우미 함수
    function addAttendeesToCollection(attendeeArray) {
      attendeeArray.forEach(function(attendee) {
        collection.add(attendee);
      });
    }

    function verifyCallbackWasExecutedforEachAttendee(attendeeArray) {
      // 각 원소마다 한 번씩 스파이가 호출되었는지 확인한다.

      expect(callbackSpy.calls.count()).toBe(attendeeArray.length);

      // 각 호출마다 spy에 전달한 첫 번째 인자가 해당 attendee인지 확인한다.
      var allCalls = callbackSpy.calls.all();
      for (var i = 0; i < allCalls.length; i++) {
        expect(allCalls[i].args[0]).toBe(attendeeArray[i]);
      }
    }

    beforeEach(function() {
      collection = Conference.attendeeCollection();
      callbackSpy = jasmine.createSpy();
    });

    it('빈 컬렉션에서는 콜백을 실행하지 않는다', function() {
      collection.iterate(callbackSpy);
      expect(callbackSpy).not.toHaveBeenCalled();
    });

    it('원소가 하나뿐인 컬렉션은 콜백을 한 번만 실행한다', function() {
      var attendees = [
        Conference.attendee('윤지', '김')
      ];
      addAttendeesToCollection(attendees);

      collection.iterate(callbackSpy);

      verifyCallbackWasExecutedforEachAttendee(attendees);
    });

    it('컬렉션 원소마다 한 번씩 콜백을 실행한다', function() {
      var attendees = [
        Conference.attendee('Tom', 'Kazansky'),
        Conference.attendee('Charlotte', 'Blackwood'),
        Conference.attendee('태영', '김')
      ];

      addAttendeesToCollection(attendees);

      collection.iterate(callbackSpy);

      verifyCallbackWasExecutedforEachAttendee(attendees);
    });
  });
});
