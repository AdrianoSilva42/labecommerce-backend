export enum Category {
    ACCESSORIES = 'Acessórios',
    CLOTHES_AND_SHOES = 'Roupas e calçados',
    ELETRONICS = 'Eletrônicos'
};


export type Tcliente = {
    id: string,
    email: string,
    senha: string
};

export type Tproduto = {
    id: string,
    nome: string,
    preco: number,
    categoria: Category
};

export type Tcompra = {
    userId: string,
    produtoId: string,
    qtd: number,
    precoTotal: number
};