import { Tcliente, Tproduto, Tcompra } from "./types"

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

export const products: Tproduto[] = [
    {
        id:"p001",
        nome:"Memoria RAM",
        preco: 25.00,
        categoria: "Hardware"
    },

    {
        id:"p002",
        nome:"Monitor",
        preco: 95.80,
        categoria:"Perifericos"
    }
];

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