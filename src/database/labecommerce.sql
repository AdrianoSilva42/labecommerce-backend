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