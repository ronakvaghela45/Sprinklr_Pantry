function sum(a,b){
	console.log(a+ " "+b);
	return a+b;
}
var memo=function(sum){
	let cache={};
	var key=Array.prototype.join.call(arguments,",");
	console.log(arguments);
	if(key in cache) return cache[key];
	else{
		return cache[key]=sum();
	}
	
}	

let memoizedSum = memo(sum);

memoizedSum(1,2);
memoizedSum(1,2);