// 05-2-1 콜백 화살 눌러 펴기 - 콜백 화살 눌러 펴기

CallbackArrow = CallbackArrow || {};

CallbackArrow.rootFunction = function() {
  CallbackArrow.firstFunction(CallbackArrow.firstCallback);
};

CallbackArrow.firstFunction(function(callback1) {
  callback1(arg);
});

CallbackArrow.secondFunction(function(callback2) {
  callback2(arg);
});

CallbackArrow.thirdFunction(function(callback3) {
  callback3(arg);
});

CallbackArrow.fourthFunction(function(callback4) {
  callback4(arg);
});

CallbackArrow.firstCallback = function() {
  // 첫 번째 콜백 로직
  CallbackArrow.secondFunction(CallbackArrow.secondCallback);
};

CallbackArrow.secondCallback = function() {
  // 두 번째 콜백 로직
  CallbackArrow.thirdFunction(CallbackArrow.thirdCallback);
};

CallbackArrow.thirdCallback = function() {
  // 첫 번째 콜백 로직
  CallbackArrow.fourthFunction(CallbackArrow.fourthCallback);
};

CallbackArrow.fourthCallback = function() {
  // 네 번째 콜빅 로직
};
