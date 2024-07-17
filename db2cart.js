var mysql = require('mysql'); 

var con = mysql.createConnection({host: "localhost",
 user: "root",
 password: "Alwaysdata2",
 database: "shirtshop"
});

 
con.connect(function(err) {if (err) throw err;
console.log("Connected!");

con.query("CREATE DATABASE shirtshop", function (err, result) {


      var sql1 = "CREATE TABLE client (ssn INT AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(255), age VARCHAR(255), balance DECIMAL)";
      con.query(sql1, function (err, result) {
        if (err) throw err;
        console.log("Table client created");
      });

      var sql2 = "CREATE TABLE product (product_id INT AUTO_INCREMENT PRIMARY KEY, product_name VARCHAR(255), price DECIMAL, quantity INT)";
      con.query(sql2, function (err, result) {
        if (err) throw err;
        console.log("Table product created");
      });




var sql4 = "INSERT INTO client (ssn, first_name, age, balance) VALUES ?"
var values1 = [
[2003125, 'Yomna','21',2000.0],
[2003126, 'Jess','22',2000.0],
[2003127, 'Oliver','25',2000.0],
[2003128, 'Dean','30',2000.0]
]
      con.query(sql4, [values1], function (err, result) {
        if (err) throw err;
        console.log("Number of  client records inserted: " + result.affectedRows);
  });

var sql5 = "INSERT INTO product (product_id, product_name,price,quantity) VALUES ?";
var values2= [
[123, 'Corn Candy Shirt', 20.0, 300 ],
[124, 'lilo Shirt',  40.0, 200],
[125, 'Gumball Shirt', 50.0, 400 ],
[126, 'Green Basic t-Shirt', 30.0, 100 ]
]
  con.query(sql5,[values2], function (err, result) {
    if (err) throw err;
    console.log("Number of  product records inserted: " + result.affectedRows);
  });


;})});

