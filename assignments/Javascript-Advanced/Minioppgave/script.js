/*
Inventory, with product name, price, and category
*/

const products = [
	{ name: "Smartphone", 		price: 800, 	category: "electronics"     }, 
	{ name: "Headphones", 		price: 150, 	category: "electronics"     }, 
	{ name: "Coffee Maker",     price: 100, 	category: "home appliances"	}, 
	{ name: "Blender", 		    price: 250, 	category: "home appliances"	}, 
	{ name: "Laptop", 		    price: 1200, 	category: "electronics"     }, 
	{ name: "T-shirt", 		    price: 50, 	    category: "clothes"         }, 
	{ name: "Sneakers", 		price: 300, 	category: "clothes"         }
];


console.log("***************************************************");
console.log("Case 1");
console.log("***************************************************");

/*
1.
Find all products which cost less than 200
*/

console.log("1.");

let cheapest = products.filter(obj => obj.price < 200);
console.log("Less than 200");
console.log(cheapest.map(obj => obj.name))

console.log("");

/*
2.
Get a list of all product names using map()
*/

console.log("2.");

let productNames = products.map(obj => obj.name);
console.log("All products");
console.log(productNames);

console.log("");

/*
3.
Make a list which contains only the names of "electronics" products,
by first sorting out all "electronics" products with filter(), and then 
getting the name with map()
*/

console.log("3.");

console.log("Electronics");
let electronicsNames = products.filter(obj => obj.category === "electronics")
				               .map(obj => obj.name);
console.log(electronicsNames);

console.log("");

/*
4.
The inventory will be checked for products which cost more than 1000
*/

console.log("4.");

if (products.some(obj => obj.price > 1000))
	console.log("Yes, some products cost more than 1000");
else
	console.log("No, no products cost more than 1000");

console.log("");

/*
5.
The total value of the inventory will be calculated. ("Value" is assumed equal
to "price", and it is assumed that the inventory contains only one of each item.)
To do this, use reduce()
*/

console.log("5.")

console.log("Total price");
let totalValue = products.reduce((acc, cur) => acc + cur.price, 0);
console.log(totalValue);

console.log("");


console.log("***************************************************");
console.log("Case 2");
console.log("***************************************************");

/*
1.
Find all products which cost less than 200
*/
console.log("The items that cost less than 200 are:");
products.filter(obj => obj.price < 200)
	.forEach(obj => { console.log(`- ${obj.name}`); });
console.log("");

/*
2.
Get a list of all product names
*/

let allNames = products.map(obj => obj.name);
console.log("The inventory consists of the following items:");
products.forEach(obj => { console.log(`- ${obj.name}`) });
console.log("");

/*
3.
Find all products in the category "clothes"
*/

let allClothes = products.filter(obj => obj.category === "clothes");
console.log(`The items in the category "clothes" are:`);
allClothes.forEach(obj => { console.log(`- ${obj.name}`); });
console.log("");

/*
4.
Check if any products cost more than 1000
*/

let moreThan1000 = products.some(obj => obj.price > 1000);
if (moreThan1000)
	console.log("Yes, some products cost more than 1000");
else
	console.log("No, no products cost more than 1000");
console.log("");

/*
5.
Find the total price of the whole inventory
*/

let totalPrice = products.reduce((total, obj) => total + obj.price, 0);
console.log(`The total price of the items in the inventory is: ${totalPrice}`);