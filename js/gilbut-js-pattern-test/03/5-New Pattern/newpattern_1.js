// 03-5-1 new 객체 생성 패턴 - Marsupial 함수와 생성자 함수 사용법

function Marsupial(name, nocturnal) {
  this.name = name;
  this.isNocturnal = nocturnal;
}

var maverick = new Marsupial('매버릭', true);
var slider = new Marsupial('슬라이더', false);

console.log(maverick.isNocturnal); // true
console.log(maverick.name); // 매버릭
console.log(slider.isNocturnal); // false
console.log(slider.name); // 슬라이더
