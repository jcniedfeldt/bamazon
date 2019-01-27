DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(200) NOT NULL,
  department_name VARCHAR(45) NULL,
  price decimal(10,2) NOT NULL,
  stock_quantity int NOT NULL,
  PRIMARY KEY (item_id)
);


#INSERT INTO test_table (whatup)
#VALUES ("Not much. How bout you?");

