// 05-1-2 콜백 함수의 작성과 테스팅 - checkInService.checkIn(attendee) 구현부

var Conference = Conference || {};

Conference.checkInService = function(checkInRecorder) {
  // 주입한 checkInRecorder의 참조값을 보관한다.
  var recorder = checkInRecorder;

  return {
    checkIn: function(attendee) {
      attendee.checkIn();
      recorder.recordCheckIn(attendee);
    }
  }
}
