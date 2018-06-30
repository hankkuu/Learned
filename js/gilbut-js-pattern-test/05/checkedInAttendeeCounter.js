// 05-2-2 this를 조심하라 - checkedInAttendeeCounter 모듈의 구현부

var Conference = Conference || {};

Conference.checkedInAttendeeCounter = function() {
  var checkedInAttendees = 0;

  return {
    increment: function() {
      checkedInAttendees++;
    },
    getCount: function() {
      return checkedInAttendees;
    },
    countIfCheckedIn: function(attendee) {
      if (attendee.isCheckedIn()) {
        this.increment();
      }
    }
  };
};
