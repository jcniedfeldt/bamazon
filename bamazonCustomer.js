// Require
var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Mach2018#",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // selectOperation();
  mainQuery();
  // run the start function after the connection is made to prompt the user
  // start();

});

function mainQuery() {
  var query = "SELECT product_name FROM products;";
  // Get product information, add to choices
  var productList = [];
  connection.query(query, function (err, res) {
    if (err) throw err;
    // console.log(res);
    for (var i = 0; i < res.length; i++) {
      productList.push(res[i]["product_name"])
    }
    // selectProduct(res);
    selectProduct(productList);
    // connection.end();
  });

}

function selectProduct(productNames) {
  var choices = [...productNames, new inquirer.Separator(), "exit"];
  // console.log(choices);
  inquirer
    .prompt({
      name: "product",
      type: "list",
      message: "What product would you like to order?",
      "choices": choices
    })
    .then(function (answer) {
      // console.log(`Selected choice: ${answer.product}`);
      if (answer.product === "exit") {
        connection.end();
      }
      else {
        //
        askQuantity(answer.product);
      }
    });
}

function askQuantity(product) {
  inquirer
    .prompt({
      name: "quantity",
      type: "input",
      message: `Quantity of ${product} desired: `,
    })
    .then(function (answer) {
      // console.log(answer.quantity);
      queryNumber(product, answer.quantity);

    });
}

function queryNumber(product, quantity) {
  var query = "SELECT stock_quantity FROM products WHERE ?;";
  connection.query(query, { product_name: product }, function (err, res) {
    if (err) throw err;
    // console.log(res);
    if (res.length > 1) {
      console.log("Duplicate items exist in table. Order Can't complete.");
      mainQuery();
    } else if (res.length < 1) {
      console.log("Item does not exist");
      mainQuery();
    } else {
      var stockAvail = res[0].stock_quantity;
      if (stockAvail < quantity) {
        console.log("Not enough stock available! Order not processed.");
        mainQuery();
      } else{
        // process normally
        console.log("Processing Order.");
        processOrder(product, quantity, stockAvail);
      }

    }
  });
}

function processOrder(product, quantityNeeded, quantityAvail) {
  var query = "UPDATE products SET ? WHERE ?;";
  connection.query(query, [{ "stock_quantity": quantityAvail - quantityNeeded }, { "product_name": product }], function (err, res) {
    if (err) throw err;
    console.log("Order Processed Successfully!");
    mainQuery();
  })
}