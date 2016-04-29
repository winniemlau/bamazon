var mysql = require('mysql');
var prompt = require('prompt');

var connection = mysql.createConnection({
	host:'localhost',
	user: 'root',
	password: '1234',
	database: 'bamazon'
});

console.log('Here are the menu options: 1) View Products 2) View Low Inventory 3) Add to Inventory 4) Add New Product');

prompt.start()
var schema = {
      properties: {
        option: {description: 'Select one option from the menu'}
      },
    };

function menuOptions(){
    prompt.get(schema, function (err,res){
      switch (res.option) {
        case '1':
        showInventory();
        break;
        case '2':
        lowInventory();
        break;
        case '3':
        addToInventory();
        break;
        case '4':
        addNewItem()
        break;
        default:
        console.log("Invalid menu option");
        menuRequest();
      }
    });
}
menuOptions();


function showInventory() {
	connection.query('SELECT * FROM products', function(err, res) {
		if(err){
			throw err;
		}else{
		    console.log(res);
		}
	})
}

function lowInventory() {
  connection.query('SELECT * FROM products WHERE StockQuantity < 5', function(err, res) {
    if(err){
      throw err;
    }else{
        console.log(res);
    }
  })
}

function addToInventory(){
  var addMoreSchema = {
    properties: {
      ItemID: {description: 'Which item do you want to add more stock to?'},
      Qty: {description: 'How many do you want to add to the stock of this item?'}
    },
  };

  prompt.get(addMoreSchema, function (err,res){
        var modifyItem= {
          ItemId: res.ItemID,
          Qty: res.Qty
        };
      var addQuery = 'UPDATE products SET StockQuantity =' + modifyItem.Qty + 'WHERE ItemID ='+ modifyItem.ItemId; 
      connection.query(addQuery, function(err, res2) {
        if (err) throw err;
        console.log(res2);
        });
      });
    }


  function addNewItem(){
      var addItem = {
            properties: {
              ProductName: {description: 'Enter name of the item you wish to add'},
              DepartmentName: {description: 'Enter department name of this item'},
              Price: {description: 'Enter price of the item'},
              StockQuantity: {description: 'Enter amount of this item we will have in stock'}
              },
          };

          prompt.get(addItem, function (err,res){
            var UpdateItem = {
              ProductName: res.ProductName,
              DepartmentName: res.DepartmentName,
              Price: res.Price,
              StockQuantity: res.StockQuantity
            };

          connection.connect();
          connection.query('INSERT INTO products set ?', UpdateItem, function(err, result) {
            if (err) throw err;
            console.log("Product has been Added.");
            connection.end();
            });
          });
        }