// 02-3 사례연구: Aop.js 모듈 개발 - 애스팩트가 타깃을 호출

Aop = {
  around: function(fnName, advice, fnObj) {
    var originalFn = fnObj[fnName];
    fnObj[fnName] = function() {
      var targetContext = {}; // 잘못된 코드라는 건 알고 있다. 나중에 다시 설명한다.
      advice.call(targetContext, { fn: originalFn });
    };
  }
};