// 02-3 사례연구: Aop.js 모듈 개발 - Aop.around가 advice를 실행

Aop = {
  around: function(fnName, advice, fnObj) {
    fnObj[fnName] = advice;
  }
};
