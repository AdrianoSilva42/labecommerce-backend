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

//getProductsById - Procurar um produto expecifico do Array de produtos pelo id
app.get('/products/:id', (req:Request, res:Response) => {
    const id = req.params.id
    
    const resultado: Tproduto | undefined = products.find(product => product.id === id)

    res.status(200).send(resultado)
});

//getUserPurchasesByUserId - Procurar compras feita do usuario pelo id do proprio
app.get('/users/:id/purchases', (req:Request, res:Response) => {
    const id = req.params.id

    const resultado: Tcompra | undefined = purchase.find(compra => compra.userId === id)

    res.status(200).send(resultado)
});

//deleteUserById - Deletar um usuario utilizando o seu id
app.delete('/user/:id', (req:Request, res:Response) => {
    const id = req.params.id

    const index = user.findIndex(usuario => usuario.id === id)

    if(index >= 0){
        user.splice(index, 1)
    };

    res.status(200).send("Usuario apagado com sucesso")
});

//deleteProductById - Deletar um produto utilizando o seu id
app.delete('/products/:id', (req:Request, res:Response) => {
    const id = req.params.id

    const index = products.findIndex(produto => produto.id === id)

    if(index >= 0){
        products.splice(index, 1)
    };

    res.status(200).send("Produto apagado com sucesso")
});

//editUserById - Editar um usuario expecifico. Encontrando ele por seu id
app.put('/user/:id', (req:Request, res:Response) => {
    const id = req.params.id

    const newId = req.body.id as string | undefined
    const newEmail = req.body.email as string | undefined
    const newSenha = req.body.senha as string | undefined

    const result: Tcliente | undefined = user.find(usuario => usuario.id === id)

    if(result){
        result.id = newId || result.id
        result.email = newEmail || result.email
        result.senha = newSenha || result.senha
    };

    res.status(200).send("Cadastro atualizado com sucesso")
});

//editProductById - Editar um produto expecifico. Encontrando ele por seu id
app.put('/products/:id', (req:Request, res:Response) => {
    const id = req.params.id

    const newId = req.body.id as string | undefined
    const newNome = req.body.nome as string | undefined
    const newPreco = req.body.preco as number 
    const newCategoria = req.body.categoria as Category | undefined

    const result: Tproduto | undefined = products.find(produto => produto.id === id)

    if(result){
        result.id = newId || result.id
        result.nome = newNome || result.nome
        result.preco = isNaN(newPreco) ? result.preco : newPreco
        result.categoria  = newCategoria || result.categoria
    };

    res.status(200).send("Produto atualizado com sucesso")
});