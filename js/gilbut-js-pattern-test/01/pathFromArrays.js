// 01-1-1 자바스크립트 특성을 완벽히 섭렵하라 - rj3.svg.line() 호출부 예시

(function() {
  var arrayData = [
        [10,130],
        [100,60],
        [190,160],
        [280,10]
      ],
      lineGenerator = rj3.svg.line(),
      path = lineGenerator(arrayData);

  document.getElementById('pathFromArrays').setAttribute('d',path);
}());  
