"use strict";

let topics = [
  "functionTypes",
  "functionConversion",
  "objectManipulation",
  "arrayManipulation",
  "inventoryAnalyticsEngine",
];

// Dummy Inventory Database
const inventory = {
  p101: {
    name: "Wireless Ergonomic Mouse",
    price: 45.0,
    stock: 18,
    category: "Electronics",
  },
  p102: {
    name: "Mechanical Gaming Keyboard",
    price: 110.0,
    stock: 3,
    category: "Electronics",
  },
  p103: {
    name: 'UltraWide Monitor 34"',
    price: 450.0,
    stock: 2,
    category: "Electronics",
  },
  p104: {
    name: "USB-C Multi-Port Hub",
    price: 25.5,
    stock: 35,
    category: "Accessories",
  },
  p105: {
    name: "Ergonomic Memory Foam Desk Pad",
    price: 19.99,
    stock: 4,
    category: "Accessories",
  },
  p106: {
    name: "Noise-Canceling Headphones",
    price: 199.99,
    stock: 8,
    category: "Electronics",
  },
  p107: {
    name: "Adjustable Laptop Stand",
    price: 34.0,
    stock: 0,
    category: "Accessories",
  },
};

// Dummy Order History Database
const orders = [
  {
    orderId: "ORD-2026-001",
    customer: "Subodh Shah",
    items: [
      { productId: "p101", quantity: 1, unitPrice: 45.0 },
      { productId: "p104", quantity: 2, unitPrice: 25.5 },
    ],
    status: "completed",
    timestamp: "2026-09-01T10:15:00Z",
  },
  {
    orderId: "ORD-2026-002",
    customer: "Aarav Sharma",
    items: [
      { productId: "p102", quantity: 1, unitPrice: 110.0 },
      { productId: "p105", quantity: 1, unitPrice: 19.99 },
    ],
    status: "completed",
    timestamp: "2026-09-02T14:30:00Z",
  },
  {
    orderId: "ORD-2026-003",
    customer: "Neha Joshy",
    items: [{ productId: "p103", quantity: 1, unitPrice: 450.0 }],
    status: "pending",
    timestamp: "2026-09-03T09:00:00Z",
  },
  {
    orderId: "ORD-2026-004",
    customer: "Kiran Bhatta",
    items: [
      { productId: "p106", quantity: 1, unitPrice: 199.99 },
      { productId: "p104", quantity: 1, unitPrice: 25.5 },
    ],
    status: "cancelled",
    timestamp: "2026-09-03T11:45:00Z",
  },
];

// == Function Types ==

// 1. Function Expression - Not Hoisted unlike normal Function Declaration
const functionExpression = function () {
  console.log("1. Function Expression -- Not Hoisted");
};
functionExpression();

/* 
2. Arrow Functions 
- Set this to surrounding scope when called 
- Implicit single line return
- Optional Parantheses for single parameter
*/
const arrowfunction = () => {
  console.log("2. Arrow Function");
};
arrowfunction();

/*
3. Anonymous Function
- Function without name
- Used commonly for callbacks or inline handlers
*/
setTimeout(function () {
  console.log("3. Anonymous Function");
}, 0);

/*
4. Immedialely Invoked Function Expression(IIFE)
- It runs as soon as it is defined
- Creates private scope to stop polluting global namespace
*/
(() => {
  console.log("4. Immediatly invoked function expression (IIFE)");
})();

(function () {
  console.log("4. Immediatly invoked function expression (IIFE)");
});

// Function conversion

//Regular Function Declaration
function calculateSum(num1, num2) {
  return num1 + num2;
}

//Conversion to Arrow Function
const sum = (num1, num2) => {
  return num1 + num2;
};

//Conversion to IIFE
(function (num1, num2) {
  return num1 + num2;
})(10, 40);

/*
Objects Methods and Properties
- keys(obj): return array
- values(obj): return array
- entries(obj): return array of arrays
- assign({}, target, source): copys properties from source to target
- freeze(obj): Prevents modification or additionof properties to obj   
*/

let product = {
  name: "shoes",
  price: 2000,
  brand: "nike",
};

console.log(Object.keys(product));
console.log(Object.values(product));
console.log(Object.entries(product));

let productSale = {
  unitsSold: 10,
  totalPrice: 20000,
};

let updateProduct = Object.assign({}, product, productSale);
console.log(updateProduct);

const config = Object.freeze({ apiEndpoint: "https://store.example.com" });
//config.apiEndpoint = "https://product.example.com"; // Fails silently or throw error - Depends on wheather "use strict" or not

/*
Arrays Methods and Properties
- push(value)
- pop()
- map(callback)
- filter(callback)
- reduce (callback)
- length
- find(callback)
*/

let productArray = Object.keys(product);
console.log(productArray.map((item) => item.includes("n")));
console.log(productArray.filter((item) => item.includes("a")));
console.log(productArray.pop());
console.log(productArray.push("brand"));
console.log(productArray.length);
console.log(productArray.find((item) => item.length >= 5));

// Inventory Analytics Engine for Any E-Commerce Website

const inventoryAnalyticsEngine = function () {
  //Used filter, reduce
  const calculateGrossRevenue = (orders) => {
    let completedorders = orders.filter((order) => {
      return order.status === "completed";
    });
    let grossRevenue = completedorders.reduce((accumulator, current) => {
      current.items.forEach((item) => {
        accumulator += item.quantity * item.unitPrice;
      });
      return accumulator;
    }, 0);
    return grossRevenue;
  };

  //Used Object.values(), filter(), map()
  const lowStockAlert = (inventory) => {
    let lowStockItems;
    lowStockItems = Object.values(inventory)
      .filter((item) => item.stock < 5)
      .map((item) => {
        return { name: item.name, stock: item.stock };
      });
    return lowStockItems;
  };

  //Used Object.values(), reduce()
  const totalAssetValuation = (inventory) => {
    let totalValuation = Object.values(inventory).reduce(
      (accumulator, current) => {
        return (accumulator += current.price * current.stock);
      },
      0,
    );
    return totalValuation;
  };

  //Used Object.value(), reduce()
  const categorySummary = (inventory) => {
    let categoryStockSummary = Object.values(inventory).reduce(
      (acc, current) => {
        let category = current.category;
        acc[category] = (acc[category] || 0) + current.stock;
        return acc;
      },
      {},
    );
    return categoryStockSummary;
  };

  //Used Object.values(), Array.map(), Object.assign() (or spread { ...item })
  const promotionalCatalogGenerator = (inventory) => {
    let discount = 10;
    let discountedCatalog = Object.values(inventory).map((item) => {
      return { ...item, price: item.price - (discount / 100) * item.price };
    });
    return discountedCatalog;
  };

  //Used Objects.keys(). Objects.values(), Array.map(), Array.join()
  const csvFomatter = (inventory) => {
    let entries = Object.values(inventory);
    if (entries.length === 0) return "";
    let csvKeys = Object.keys(entries[0]).join(",");
    let csvValues = entries
      .map((item) => {
        return Object.values(item).join(",");
      })
      .join("\n");
    let csv = `${csvKeys}\n${csvValues}`;

    return csv;
  };

  return {
    calculateGrossRevenue,
    lowStockAlert,
    totalAssetValuation,
    categorySummary,
    promotionalCatalogGenerator,
    csvFomatter,
  };
};

let inventoryAnalysis = inventoryAnalyticsEngine();

console.log(inventoryAnalysis.calculateGrossRevenue(orders));
console.log(inventoryAnalysis.lowStockAlert(inventory));
console.log(inventoryAnalysis.totalAssetValuation(inventory));
console.log(inventoryAnalysis.categorySummary(inventory));
console.log(inventoryAnalysis.promotionalCatalogGenerator(inventory));
console.log(inventoryAnalysis.csvFomatter(inventory));
