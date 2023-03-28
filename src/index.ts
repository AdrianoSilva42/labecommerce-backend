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
    try{
        res.status(200).send(user)
    } catch(e) {
        console.log(e)
    }
    
});

//getAllProduct - Devolve todo o Array de produtos
app.get('/products', (req:Request, res:Response) => {
    try{
        res.status(200).send(products)
    } catch(e){
        console.log(e)
    }
});

//getProductByName - Devolve um produto expecifico do Array de produtos pelo seu nome
app.get('/products/search', (req:Request, res:Response) => {
    try{
        const q = req.query.q as string

        if(q.length < 1){
            res.status(404)

            throw new Error("O termo de busca deve conter pelo menos 1 caractere.")
        };

        const result = products.filter(product => product.nome.toLowerCase().includes(q.toLowerCase()))
    
        res.status(200).send(result)
    } catch(e: any){
        console.log(e)
        if(res.statusCode === 200){
            res.status(500)
        };
        res.send(e.message)
    };
});

//postCreateUser - Criar um novo usuario no Array de usuarios
app.post('/users', (req:Request, res:Response) => {
    try{
        
        const {id, email, senha}: Tcliente = req.body

        if(!id && !email && !senha){
            res.status(400)
            throw new Error("É necessario preencher todos os 3 campos do body.")
        }

        if(id !== undefined){
            const ids = user.map(id => {return id.id})
            if(id.length < 3){
                res.status(400)
                throw new Error("O 'id' do novo usuario deve conter 3 digitos e ser diferente do que já existe.")
            };

            if(ids.includes(id)){
                res.status(400)
                throw new Error("Já existe uma conta com esse 'id'. Tente novamente com outro.")
            };
        };

        if(email !== undefined){
            const emails = user.map(email => {return email.email})
            if(!email.includes('@email.com') ){
                res.status(400)
                throw new Error("O email deve conter o trecho '@email.com'.")
            };

            if(emails.includes(email)){
                res.status(400)
                throw new Error("Esse email já existe. Tente outro.")
            }
        };

        if(senha !== undefined){
            if(senha.length < 6){
                res.status(400)
                throw new Error("A senha deve conter 6 digitos ou mais.")
            }
        };

        const newUser = {id, email, senha}
    
        user.push(newUser)
    
        res.status(201).send('Novo usuario cadastrado com sucesso!!')
    } catch(e: any){
        if(res.statusCode === 200){
            res.status(500)
        };
        res.send(e.message)
    }

});

//postCreatedProduct - Cria um novo produto no Array de produtos
app.post('/products', (req:Request, res:Response) => {
    try{
        const {id, nome, preco, categoria}: Tproduto = req.body

        const ids = products.map(produto => {return produto.id})
        if(id !== undefined){
            if(id.length < 4 || id[0] !== 'p'){
                res.status(400)
                throw new Error("O 'id' do produto deve conter 4 caracteres(uma letra p e tres numeros).") 
            }

            if(ids.includes(id)){
                res.status(400)
                throw new Error("O 'id' não pode ser igual a um já existente")
            }

            if(id[0] !== 'p'){
                res.status(400)
                throw new Error("O 'id' deve iniciar com a letra 'p'.")
            }
        };

        if(!nome){
            res.status(400)
            throw new Error("É necessario informar o nome do produto.")
        };

        if(!preco || typeof preco !== 'number'){
            res.status(400)
            throw new Error("É necessario informar um valor e que ele seja um 'number'.")
        };

        if(!categoria){
            res.status(400)
            throw new Error("É necessario informar uma das categorias entre: Acessorios, Roupas e calçados, Eletronicos")
        };

        if(categoria !== undefined){
            if(categoria !== Category.ACCESSORIES && categoria !== Category.CLOTHES_AND_SHOES && categoria !== Category.ELETRONICS){
                res.status(400)
                throw new Error("A categoria deve ser um tipo valida: Acessorios, Roupas e calçados, Eletronicos")
            }
        };

        const newProduct = {id, nome, preco, categoria}
    
        products.push(newProduct)
    
        res.status(201).send("Novo produto cadastrado com sucesso!!")
    } catch(e: any){
        if(res.statusCode === 200){
            res.status(500)
        };
        res.send(e.message)
    } 

});

//postCreatedPurchase - Cria uma nova compra no Array de compras
app.post('/purchases', (req:Request, res:Response) => {
    try{
        const {userId, produtoId, qtd, precoTotal}: Tcompra  = req.body

        const idUser = user.map(user => {return user.id})
        const idProduto = products.map(produto => {return produto.id})

        if(userId !== undefined){
            if(!idUser.includes(userId)){
               res.status(400)
               throw new Error("O 'id' do usuario deve ser o mesmo já cadastrado")
            };
        };

        if(produtoId !== undefined){
            if(!idProduto.includes(produtoId)){
                res.status(400)
                throw new Error("O 'id' do produto deve ser igual do produto cadastrado")
            }
        };

        if(qtd !== undefined){
            if(typeof qtd !== 'number'){
                res.status(400)
                throw new Error("O valor digitado em qtd dve ser um 'number'.")
            }
        };

        
        if(precoTotal !== undefined){
            if(typeof precoTotal !== 'number'){
                res.status(400)
                throw new Error("O valor do Preço Total deve ser um 'number'.")
            }
        };

        const idDoProduto = products.find(idProduct => idProduct.id === produtoId )
        if(idDoProduto !== undefined){
            const total = idDoProduto.preco * qtd 
            if(precoTotal !== total){
                res.status(400)
                throw new Error("O preço total do produto foi digitado errado.")
            }
        }

       
        

        const newCompra = {userId, produtoId, qtd, precoTotal}
    
        purchase.push(newCompra)
    
        res.status(201).send("Nova compra realizada com sucesso!!")
    } catch(e: any){
        if(res.statusCode === 200){
            res.status(500)
        };
        res.send(e.message)
    }
});

//getProductsById - Procurar um produto expecifico do Array de produtos pelo id
app.get('/products/:id', (req:Request, res:Response) => {
    try{
        const id = req.params.id
    
        const resultado: Tproduto | undefined = products.find(product => product.id === id)

         if(resultado?.id !== id){
                console.log(resultado)
                res.status(400)
                throw new Error("Esse produto não existe. Tente novamente com um 'id' valido")
            }

            //Essa segunda forma também funciona 
        // if(id !== undefined){
        //     if(resultado === undefined){
        //         console.log(resultado)
        //         res.status(400)
        //         throw new Error("Esse produto não existe. Tente novamente com um 'id' valido")
        //     }
        // }
    
        res.status(200).send(resultado)
    } catch(e: any){
        if(res.statusCode === 200){
            res.status(500)
        };
        res.send(e.message)
    }
});

//getUserPurchasesByUserId - Procurar compras feita do usuario pelo id do usuario
app.get('/users/:id/purchases', (req:Request, res:Response) => {
    try{
        const id = req.params.id

        const resultado: Tcompra | undefined = purchase.find(compra => compra.userId === id)

        if(resultado?.userId !== id){
            res.status(400)
            throw new Error("Esse usuario não existe, logo não existem compras feitas no mesmo. Digite um usuario valido.")
        };
    
        res.status(200).send(resultado)
    }catch(e: any){
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(e.message)
    }
});

//deleteUserById - Deletar um usuario utilizando o seu id
app.delete('/user/:id', (req:Request, res:Response) => {
    try{
        const id = req.params.id

        const index = user.findIndex(usuario => usuario.id === id)

        const usuarios = user.map(users => {return users.id})
        if(!usuarios.includes(id)){
            res.status(400)
            throw new Error("Digite o 'id' de um usuario existente.")
        }
    
        if(index >= 0){
            user.splice(index, 1)
        };
    
        res.status(200).send("Usuario apagado com sucesso")
    }catch(e: any){
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(e.message)
    }
});

//deleteProductById - Deletar um produto utilizando o seu id
app.delete('/products/:id', (req:Request, res:Response) => {
    try{
        const id = req.params.id

        const index = products.findIndex(produto => produto.id === id)

        const produtos = products.map(product => {return product.id})
        if(!produtos.includes(id)){
            res.status(400)
            throw new Error("Digite o 'id' de um produto existente.")
        }
    
        if(index >= 0){
            products.splice(index, 1)
        };
    
        res.status(200).send("Produto apagado com sucesso")
    }catch(e:any){
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(e.message)
    }
});

//editUserById - Editar um usuario expecifico. Encontrando ele por seu id
app.put('/user/:id', (req:Request, res:Response) => {
    try{
        const id = req.params.id

        const newId = req.body.id as string | undefined
        const newEmail = req.body.email as string | undefined
        const newSenha = req.body.senha as string | undefined

        const usuarios = user.map(usuario => {return usuario.id})
        if(!usuarios.includes(id)){
            
            res.status(400)
            throw new Error("Digite um 'id' valido para editar o usuario em questão.")
        };

        if(newId !== undefined){
            if(newId.length < 3){
                res.status(400)
                throw new Error("O 'id' do usuario deve conter 3 digitos iniciando com 0(Ex: '003', '008', '012').")
            }
        };

        if(newEmail !== undefined){
            if(!newEmail.includes('@email.com')){
                res.status(400)
                throw new Error("O email deve conter o trecho '@email.com'.")
            }

            const email = user.map(path => {return path.email })
            if(email.includes(newEmail)){
                res.status(400)
                throw new Error("Esse email já está cadastrado. Tente outro.")
            }
        };

        if(newSenha !== undefined){
            if(newSenha.length < 6){
                res.status(400)
                throw new Error("A senha deve conter no minimo 6 digitos.")
            }
        };

        const result: Tcliente | undefined = user.find(usuario => usuario.id === id)
    
        if(result){
            result.id = newId || result.id
            result.email = newEmail || result.email
            result.senha = newSenha || result.senha
        };
    
        res.status(200).send("Cadastro atualizado com sucesso")
    }catch(e:any){
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(e.message)
    }
});

//editProductById - Editar um produto expecifico. Encontrando ele por seu id
app.put('/products/:id', (req:Request, res:Response) => {
    try{
        const id = req.params.id

        const newId = req.body.id as string | undefined
        const newNome = req.body.nome as string | undefined
        const newPreco = req.body.preco as number 
        const newCategoria = req.body.categoria as Category | undefined
    
        const idProduto = products.map(path => {return path.id})
        if(!idProduto.includes(id)){
            res.status(400)
            throw new Error("Digite um 'id' valido para editar o produto em questão.")
        };

        if(newId !== undefined){
            if(newId[0] !== 'p'){
                res.status(400)
                throw new Error("O 'id' do produto deve iniciar com a letra p, seguido de 3 numeros(Ex: 'p001', 'p009', 'p016', 'p0120')")
            }
        };

        if(!newNome){
            res.status(400)
            throw new Error("O produto pecisa conter um nome.")
        };

        if(newPreco === undefined){
            res.status(400)
            throw new Error("O produto precisa de um preço.")
        }

        if(newCategoria !== undefined){
            if(newCategoria !== Category.ACCESSORIES && newCategoria !== Category.CLOTHES_AND_SHOES && newCategoria !== Category.ELETRONICS ){
                res.status(400)
                throw new Error("A categoria deve ser um tipo valida: Acessorios, Roupas e calçados, Eletronicos")
            }
        };
    
        const result: Tproduto | undefined = products.find(produto => produto.id === id)
    
        if(result){
            result.id = newId || result.id
            result.nome = newNome || result.nome
            result.preco = isNaN(newPreco) ? result.preco : Number(newPreco)
            result.categoria  = newCategoria || result.categoria
        };
    
        res.status(200).send("Produto atualizado com sucesso")
    }catch(e: any){
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(e.message)
    }
});