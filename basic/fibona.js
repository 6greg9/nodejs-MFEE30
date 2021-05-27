// 負責計數執行次數
let counter = 0;

let fibonacciRecu = function (n) {
  counter++;
  return n < 2 ? n : fibonacciRecu(n - 1) + fibonacciRecu(n - 2);
};
console.time("Recu");
console.log("fib(10) = " + fibonacciRecu(10)); // 55
console.log("counter: " + counter); // 177
console.timeEnd("Recu");


counter = 0;
let fibonacciArray = function(n){
    let array=[0,1];
    if(n==0){
        return 0;
    }
    if(n==1){
        return 1;
    }
    
    for(let i =2 ; i<=n ; i++){
        counter++;
        array.push( array[i-1] + array[i-2]);
    }
    return array.pop();
}
console.time("Array");
console.log("fib(10) = " + fibonacciArray(10)); // 55
console.log("counter: " + counter); // 9
console.timeEnd("Array");

