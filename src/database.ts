import { Tcliente, Tproduto, Tcompra, Category } from "./types"

//Array de usuarios
export const user: Tcliente[] = [
     {
        id:"001",
        email:"cliente01@email.com",
        senha:"123456"  
    },

    {
        id:"002",
        email:"cliente02@email.com",
        senha:"456789"
    }
];

//Array de produtos
export const products: Tproduto[] = [
    {
        id:"p001",
        nome:"Memoria RAM",
        preco: 25.00,
        categoria: Category.ELETRONICS
    },

    {
        id:"p002",
        nome:"Monitor",
        preco: 95.80,
        categoria: Category.ELETRONICS
    }
];

//Array de compras
export const purchase: Tcompra[] = [
    {
        userId: "001",
        produtoId: "p001",
        qtd: 2,
        precoTotal: 50
    },

    {
        userId: "002",
        produtoId: "p002",
        qtd: 1,
        precoTotal: 95.80
    }
];

//Função para adicionar um novo usuario ao Array de usuario
 export  function createUser(id: string, email: string, senha:string): void {
    const newUser = {id:id, email:email, senha:senha}
    user.push(newUser)
    return console.log("Cadastro realizado com sucesso")
};

//Função para resgatar todos os usuarios do Array de usuarios
export function getAllUsers(): {} {
    return user
};

//Função para adicionar um novo produto ao Array de produtos
export function createdProduct(id:string, nome: string, preco:number, categoria: Category): void {
    const newProduct = {id:id, nome:nome, preco:preco, categoria:categoria}
    products.push(newProduct)
    return console.log("Produto criado com sucesso");
};

//Função para buscar resgatar todos os produtos do Array de produtos
export function getAllProduct(): {} {
    return products
};

//Função para buscar um produto por seu id
export function getProductById(idProduct:string): void {
    const produto = products.filter((productId) => productId.id === idProduct )
    if(produto.length === 0){
        return console.log('Produto não encontrado')
    } else {
        return console.table(produto)
    }
};

//Função para buscar um produto por seu nome
export function queryProductsByName(q:string): void {
    const produto = products.filter((productName) => productName.nome.toLowerCase() === q.toLowerCase())
        return console.table(produto)  
};

//Função para criar uma nova compra no Array de compras
export function createPurchase(userId: string, produtoId: string, qtd: number, precoTotal: number): void {
    const newItem = {userId:userId, produtoId:produtoId, qtd:qtd, precoTotal:precoTotal} 
    purchase.push(newItem)
    return console.log("Compra realizada com sucesso");
};

//Função para buscar compras feitas no id do usuario
export function getAllPurchasesFromUserId(idUsuario: string): void {
    const listPurchaseUser = purchase.filter((userId) => userId.userId === idUsuario )
    return console.table(listPurchaseUser)
};