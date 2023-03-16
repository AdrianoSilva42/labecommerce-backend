import {user, products, purchase} from "./database"
import { Category, Tcliente, Tproduto, Tcompra } from "./types"

import express, {Request, Response} from 'express'
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
    
});

//getAllUsers - Devolve todo o Array de usuarios
app.get('/users', (req:Request, res:Response) => {
    res.status(200).send(user)
});

//getAllProduct - Devolve todo o Array de produtos
app.get('/products', (req:Request, res:Response) => {
    res.status(200).send(products)
});

//getProductByName - Devolve um produto expecifico do Array de produtos pelo seu nome
app.get('/products/search', (req:Request, res:Response) => {
    const q = req.query.q as string

    const result = products.filter(product => product.nome.toLowerCase().includes(q.toLowerCase()))

    res.status(200).send(result)
});

//postCreateUser - Criar um novo usuario no Array de usuarios
app.post('/users', (req:Request, res:Response) => {

    const {id, email, senha}: Tcliente = req.body

    const newUser = {id, email, senha}

    user.push(newUser)

    res.status(201).send('Novo usuario cadastrado com sucesso!!')
});

//postCreatedProduct - Cria um novo produto no Array de produtos
app.post('/products', (req:Request, res:Response) => {
    
    const {id, nome, preco, categoria}: Tproduto = req.body

    const newProduct = {id, nome, preco, categoria}

    products.push(newProduct)

    res.status(201).send("Novo produto cadastrado com sucesso!!")
});

//postCreatedPurchase - Cria uma nova compra no Array de compras
app.post('/purchases', (req:Request, res:Response) => {
    const {userId, produtoId, qtd, precoTotal}: Tcompra = req.body

    const newCompra = {userId, produtoId, qtd, precoTotal}

    purchase.push(newCompra)

    res.status(201).send("Nova compra realizada com sucesso!!")
});
