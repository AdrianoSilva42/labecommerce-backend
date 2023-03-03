
export type Tcliente = {
    id: string,
    email: string,
    senha: string
};

export type Tproduto = {
    id: string,
    nome: string,
    preco: number,
    categoria: string
};

export type Tcompra = {
    userId: string,
    produtoId: string,
    qtd: number,
    precoTotal: number
};