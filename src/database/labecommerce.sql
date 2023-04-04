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
