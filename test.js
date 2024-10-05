const num = '12000원'

console.log(+num.replace('원', ''))


const order = [{ name: "A", price: "12000원" }, { name: "B", price: "10000원" }, { name: "C", price: "2500원" }];


const orderPrices = order.map((a) => a.price);
const numPrices = orderPrices.map((a) => +a.replace('원', ''));

const total = numPrices.reduce((p, c) => p + c);

console.log(total)