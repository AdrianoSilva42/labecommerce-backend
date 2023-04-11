-- Active: 1680010538926@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

INSERT INTO users(id, email, password)
VALUES ("001", "usuario01@email.com", "123456"),
       ("002", "usuario02@email.com", "123789"),
       ("003", "usuario03@email.com", "456123");


CREATE TABLE products(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL
);

INSERT INTO products(id, name, price, category)
VALUES ("p001", "Monitor", 95.80, "Eletrônicos"),
       ("p002", "Memoria RAM", 25, "Eletrônicos"),
       ("p003", "Oculos escuro", 35.50, "Acessórios"),
       ("p004", "Camiseta preta simples", 15.80, "Roupas e calçados"),
       ("p005", "Tenis AllStar", 110.80, "Roupas e calçados");


-- implementação da branch relações-sql-l
CREATE TABLE purchases(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    total_price REAL NOT NULL,
    paid INTEGER NOT NULL,
    delivered_at TEXT,
    buyer_id TEXT NOT NULL, --FK
    FOREIGN KEY(buyer_id) REFERENCES userd(id)
--Essa é uma relação de 1:m
);

INSERT INTO purchases(id, total_price, paid, delivered_at, buyer_id) 
VALUES ("c001", 95.80, 1, "", "001"),
       ("c002", 25, 1, "", "001"),
       ("c003", 35.50, 1, "", "002"),
       ("c004", 15.80, 1, "", "002"),
       ("c005", 110.80, 1, "", "003"),
       ("c006", 15.80, 1, "", "003");

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
    FOREIGN KEY(product_id) REFERENCES products(id)
    );

INSERT INTO purchases_products VALUES
("c001", "p004", 2),
("c003", "p001", 2),
("c005", "p005", 1);

SELECT 
    purchases.buyer_id as usuarioId,
    purchases.id as compraId,
    products.id as produtoId,
    products.name as produdoNome,
    products.price as produtoPreco,
    purchases_products.quantity 
FROM purchases_products
INNER JOIN purchases
ON purchases_products.purchase_id = purchases.id
INNER JOIN products
ON purchases_products.product_id = products.id;


--Get All Users
SELECT * FROM users;

--Get All Products
SELECT * FROM products;

--Search Product by Name
SELECT * FROM products
WHERE name = 'Monitor';

--Created User
INSERT INTO users(id, email, password)
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
