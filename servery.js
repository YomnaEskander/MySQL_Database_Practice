const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

var mysql = require('mysql'); 

var con = mysql.createConnection({host: "localhost",
 user: "root",
 password: "Alwaysdata2",
 database: "shirtshop"
});

 
con.connect(function(err) {if (err) throw err;
console.log("Connected!");})


app.get('/', async (req, res) => {
    const query = 'SELECT * FROM product';
  
    // Execute the SQL query
    con.query(query, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('An error occurred');
      } else {
        const products = result;
        //console.log(products);
        res.render('products.ejs', { products:result });
      }
    });
  });



app.get('/form.ejs', (req, res) => {
    res.render("form.ejs")
})


app.post('/search', (req, res) => {
    const ssn = req.body.ssn;
    const productId = req.body.product_id;
  
    // Query 1: Retrieve user's balance
    const getUserBalanceQuery = 'SELECT balance FROM client WHERE ssn = ?';
    con.query(getUserBalanceQuery, [ssn], (err, userResult) => {
      if (err) {
        console.error(err);
        res.status(500).send('An error occurred while retrieving user balance');
        return;
      }
  
      if (userResult.length === 0) {
        res.status(404).send('User not found');
        return;
      }
  
      const userBalance = userResult[0].balance;
  
      // Query 2: Retrieve product price and quantity
      const getProductQuery = 'SELECT price, quantity FROM product WHERE product_id = ?';
      con.query(getProductQuery, [productId], (err, productResult) => {
        if (err) {
          console.error(err);
          res.status(500).send('An error occurred while retrieving product details');
          return;
        }
  
        if (productResult.length === 0) {
          res.status(404).send('Product not found');
          return;
        }
  
        const productPrice = productResult[0].price;
        const productQuantity = productResult[0].quantity;
  
        if (userBalance >= productPrice && productQuantity > 0) {
          // Update user's balance
          const newBalance = userBalance - productPrice;
          const updateUserBalanceQuery = 'UPDATE client SET balance = ? WHERE ssn = ?';
          con.query(updateUserBalanceQuery, [newBalance, ssn], (err, updateUserResult) => {
            if (err) {
              console.error(err);
              res.status(500).send('An error occurred while updating user balance');
              return;
            }
  
            if (updateUserResult.affectedRows === 0) {
              res.status(500).send('Failed to update user balance');
              return;
            }
  
            // Update product quantity
            const newProductQuantity = productQuantity - 1;
            const updateProductQuantityQuery = 'UPDATE product SET quantity = ? WHERE product_id = ?';
            con.query(updateProductQuantityQuery, [newProductQuantity, productId], (err, updateProductResult) => {
              if (err) {
                console.error(err);
                res.status(500).send('An error occurred while updating product quantity');
                return;
              }
  
              if (updateProductResult.affectedRows === 0) {
                res.status(500).send('Failed to update product quantity');
                return;
              }
            //displaying new details of users
            const ssn = req.body.ssn;
            const query2='SELECT * FROM client WHERE ssn = ?'
            // Execute the SQL query
            con.query(query2, [ssn], (err, result2) => {
            if (err) {
              console.error(err);
              res.status(500).send('An error occurred');
            } else {
                if (result2.length === 0) {
                    res.status(404).send('No client found with the provided SSN');
            }else{
                const client = result2[0];
             res.render('client.ejs', { client, updateProductResult});
            }
          }});
              
            //res.send('Purchase successful');
            });
          });
        } else {
          res.send('Insufficient balance or product out of stock');
        }
      });
    });
    })







app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
  