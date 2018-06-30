// 05-1-1 콜백 함수를 사용한 코드의 작성과 테스트 - attendeeCollection 모듈의 전체 구현부

var Conference = Conference || {};

Conference.attendeeCollection = function() {
  var attendees = [];

  return {
    contains: function(attendee) {
      return attendees.indexOf(attendee) > -1;
    },
    add: function(attendee) {
      if (!this.contains(attendee)) {
        attendees.push(attendee);
      }
    },
    remove: function(attendee) {
      var index = attendees.indexOf(attendee);
      if (index > -1) {
        attendees.splice(index, 1);
      }
    },
    getCount: function() {
      return attendees.length;
    },
    iterate: function(callback) {
      attendees.forEach(callback);
    }
  };
};
