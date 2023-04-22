# Labecommerce-backend

O Labecommerce é uma API que consiste em adastrar usuarios e produtos. E fazer compras dos produtos cadastrados com os usuarios.
## Entidades (TypeScript)

#### User (usuário)

Representa os usuarios da aplicação. Todo usuário é composto pelas seguintes caracteristicas:
- id (string) unico e usuario define
- name (string)
- email (string) unico por usuario
- password (string)
- creted_at (string) gerado pela propria aplicação

#### Product (Produtos)

Representa os produtos da aplicação. Todo produto é composto pelas seguintes caracteristicas:

- id (string) unico e usuario define
- name (string)
- price (number)
- description (string)
- image_url (strinkg)

### Purchases (Compras)

- id (string) unico e usuario define
- total_price (number)
- created_at (string) gerado pela propria aplicação
- paid (number) 0(false) para não pago e 1(true) para pago
- buyer (string) id do usuario comprador

## Tabelas (SQLite)
### users



| id(TEXT)   | name(TEXT) |     email(TEXT)    | password(TEXT) |        createt_at(TEXTS)        |
| :----------| :--------- | :------------------| :--------------|:--------------------------------|
|    `u001`  |  `fulano`  | `fulano@email.com` |    `123456`    |**a propria aplicação vai gerar**|

&nbsp;
### product

|id(TEXT)|name(TEXT)|price(REAL)|   description(TEXT)    |      image_url(TEXT)       |
|:-------|:---------|:------------|:-----------------------|:---------------------------|
| `p001` |`gabinete`|   `125.9`   |**descrição do produto**|**url da imagem do produto**|

&nbsp;
### purchases

|id(TEXT)| total_price(REAL)  |       created_at(TEXT)          | paid(REAL) |buyer(TEXT)|
|:-------|:-------------------|:--------------------------------|:-----------|:----------|
| `c001` |      `1254.5`      |**a propria aplicação vai gerar**|  `0 ou 1`  |  `u001`   |

&nbsp;
### purchases_products

| purchase_id(TEXT)|  product_id(TEXT)  | quantity(REAL) |
|:-----------------|:-------------------|:---------------|
|**id da compra**  |*** id do produto***|      `20`      |

&nbsp;
## Instruções

***Instalando as dependecias***
- `npm install`:
instala todas as dependecias listadas no `package.json`.

&nbsp;

***executar o projeto***
- `npm run dev`:
Estabelece a conexão com o banco de dados e reinicia automaticamente o servidor `localhost` toda a vez que o projeto for alterado e salvo.

#

### Documentação (links)
- [Postman](https://documenter.getpostman.com/view/24823240/2s93RNxa67#005691ce-b069-4830-bd3e-87fb236fd58c)


&nbsp;

### Tecnologias utilizadas
- NodeJS
- TypeScript
- SQLite
- sqlite3
- Knex
- Express
- Cors

&nbsp;

### Programas utilizados
- Git
- VSCode
- Extensão MySQL
- Extensão Thunder Client
- Postman API Platform

&nbsp;

### Autor
- [Adriano Silva](https://github.com/AdrianoSilva42) - desenvolvedor web Full-Stack em treinamento pela [Labenu](https://www.labenu.com.br)
- [![Linkedin](https://encurtador.com.br/MSY09)](https://www.linkedin.com/in/adriano-h-silva/)

&nbsp;
### Contibuições:

- #### Edson Aurelio
  - [GitHub](https://github.com/eaurelio)
  - [Linkedin](https://www.linkedin.com/in/edson-aurélio-de-oliveira-araújo-b78680106/)

- ### Mateus Santos
  - [GitHub](https://github.com/m-de-mateus)
