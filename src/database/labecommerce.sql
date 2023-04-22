-- Active: 1680010538926@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT(DATETIME('now', 'localtime'))
);

INSERT INTO users(id, email, password)
VALUES ("001", "usuario01@email.com", "123456"),
       ("002", "usuario02@email.com", "123789"),
       ("003", "usuario03@email.com", "456123");


CREATE TABLE product(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL
);

INSERT INTO products(id, name, price, category)
VALUES ("p001", "Monitor", 95.80, "Eletrônicos"),
       ("p002", "Memoria RAM", 25, "Eletrônicos"),
       ("p003", "Oculos escuro", 35.50, "Acessórios"),
       ("p004", "Camiseta preta simples", 15.80, "Roupas e calçados"),
       ("p005", "Tenis AllStar", 110.80, "Roupas e calçados");


-- implementação da branch relações-sql-l
CREATE TABLE purchases(
    id TEXT PRIMARY KEY NOT NULL,
    total_price REAL NOT NULL,
    created_at TEXT NOT NULL DEFAULT(DATETIME('now', 'localtime')),
    paid INTEGER NOT NULL,
    buyer TEXT NOT NULL, --FK
    --product_list TEXT, --FK
    FOREIGN KEY(buyer) REFERENCES users(id) --Essa é uma relação de 1:m
    --FOREIGN KEY(product_list) REFERENCES product(id) --Essa é uma relação de 1:m
);

SELECT SUM(("price" * "quantity")) FROM 

INSERT INTO purchases(id, total_price, paid, buyer, product_list) 
VALUES ("c001", 125.5, 1,  "u001", "p001"),
       ("c002", 20, 1,  "u001", "p005"),
       ("c003", 75.9, 1,  "u002", "p004"),
       ("c004", 184.90, 1,  "u002", "p003"),
       ("c005", 998.9, 1,  "u003", "p002"),
       ("c006", 20, 1,  "u003", "p005");

       

SELECT * FROM purchases;

UPDATE purchases 
SET delivered_at = DATETIME('now', 'localtime')
WHERE id = "c005";

SELECT * FROM purchases
INNER JOIN users
ON purchases.buyer_id = users.id
WHERE users.id = "003";


-- implementação da branch relações-sql-ll
CREATE TABLE purchases_products(
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,

    FOREIGN KEY(purchase_id) REFERENCES purchases(id),
    FOREIGN KEY(product_id) REFERENCES product(id)
    );

INSERT INTO purchases_products VALUES
("c001", "p004", 2),
("c003", "p001", 2),
("c005", "p005", 1);

SELECT 
    purchases.buyer_id as usuarioId,
    purchases.id as compraId,
    product.id as produtoId,
    product.name as produdoNome,
    product.price as produtoPreco,
    purchases_products.quantity 
FROM purchases_products
INNER JOIN purchases
ON purchases_products.purchase_id = purchases.id
INNER JOIN products
ON purchases_products.product_id = product.id;


--Get All Users
SELECT * FROM users;

--Get All Products
SELECT * FROM products;

--Search Product by Name
SELECT * FROM products
WHERE name = 'Monitor';

--Created User
INSERT INTO users(id, name, email, password, created_at)
VALUES('004', 'usuario04@email.com', '28456');

--Created Product
INSERT INTO products(id, name, price, category)
VALUES('p006','Processador i7', 350.90, 'Eletrônicos');

--Get Products by id
SELECT * FROM products
WHERE id = 'p002';

--Delete User by id
DELETE FROM users
WHERE id = '004';

--Delete Product by id
DELETE FROM products
where id = 'p006';

--Edit Users by id
UPDATE users
SET password = '14789632', email = 'rickzinho42@email.com'
WHERE id = '002';

--Edit Product by id
UPDATE products
SET price = 65.50
WHERE id = 'p002';

--Get All Users (refatorado)
SELECT * FROM users
ORDER BY email ASC;

--Get All Products(refatorado versão 1)
SELECT * FROM products
ORDER BY price ASC
LIMIT 20
OFFSET 0; --Poderia também não por o OFFSET, ja que pde pra iniciar pelo primeito item

--Get All Products(refatorado versão 2)
SELECT * FROM products
WHERE price > 10 AND price < 80
ORDER BY price ASC;


SELECT 
    purchases.id AS IdCompra,
    purchases.total_price AS TotalCompra,
    purchases.created_at AS DataCompra,
    purchases.paid AS EstatusPagamento,
    purchases.buyer AS Comprador,
    users.id AS IdComprador,
    users.email AS EmailComprador,
    users.name AS NomeComprador
FROM purchases
INNER JOIN users
ON purchases.buyer = users.id
INNER JOIN product
ON purchases.product_list = product.id
-- WHERE purchases.id = 'c001';