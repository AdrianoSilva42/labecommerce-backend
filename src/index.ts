import {user, products, purchase} from "./database"
import { Category, Tcliente, Tproduto, Tcompra } from "./types"

import express, {Request, Response} from 'express'
import cors from 'cors'
import { db } from "./database/knex"

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
    
});

//getAllUsers - Devolve todo o Array de usuarios
app.get('/users', async (req:Request, res:Response) => {
    try{
        const results = await db.raw(`
            SELECT * FROM users;
        `) 
        res.status(200).send(results)
    } catch(e) {
        console.log(e)
    }
    
});

//getAllProduct - Devolve todo o Array de produtos
app.get('/products', async (req:Request, res:Response) => {
    try{
        const results = await db.raw(`
            SELECT * FROM product;
        `)
        res.status(200).send(results)
    } catch(e){
        console.log(e)
    }
});

//getProductByName - Devolve um produto expecifico do Array de produtos pelo seu nome
app.get('/products/search', async (req:Request, res:Response) => {
    try{
        const q = req.query.q as string

        if(q.length < 1){
            res.status(404)
            throw new Error("O termo de busca deve conter pelo menos 1 caractere.")
        };

        // const result = products.filter(product => product.nome.toLowerCase().includes(q.toLowerCase()))

        const result = await db.raw(`
            SELECT * FROM products
            
            WHERE name = "${q}"; 
        `) //Perguntar onde aplicar o metodo .toLowerCase() !!!!
    
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
app.post('/users', async (req:Request, res:Response) => {
    try{
        
        const {id, name, email, password, created_at} = req.body

        if(!id && !name && !email && !password && !created_at){
            res.status(400)
            throw new Error("É necessario preencher todos os 5 campos do body.")
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

        if(password !== undefined){
            if(password.length < 6){
                res.status(400)
                throw new Error("A senha deve conter 6 digitos ou mais.")
            }
        };

        // const newUser = {id, email, password}
    
        // user.push(newUser)

        await db.raw(`
        INSERT INTO users(id, name, email, password, created_at)
        VALUES ("${id}", "${name}", "${email}", "${password}", "${created_at}");
        `)
    
        res.status(201).send('Novo usuario cadastrado com sucesso!!')
    } catch(e: any){
        if(res.statusCode === 200){
            res.status(500)
        };
        res.send(e.message)
    }

});

//postCreatedProduct - Cria um novo produto no Array de produtos
app.post('/products', async (req:Request, res:Response) => {
    try{
        const {id, name, price, description, image_url} = req.body

        //const ids = products.map(produto => {return produto.id})
        if(id !== undefined){
            if(id.length < 4 || id[0] !== 'p'){
                res.status(400)
                throw new Error("O 'id' do produto deve conter 4 caracteres(uma letra p e tres numeros).") 
            }

            // if(ids.includes(id)){
            //     res.status(400)
            //     throw new Error("O 'id' não pode ser igual a um já existente")
            // }

            if(id[0] !== 'p'){
                res.status(400)
                throw new Error("O 'id' deve iniciar com a letra 'p'.")
            }
        };

        if(!name){
            res.status(400)
            throw new Error("É necessario informar o nome do produto.")
        };

        if(!price || typeof price !== 'number'){
            res.status(400)
            throw new Error("É necessario informar um valor e que ele seja um 'number'.")
        };

        // if(!categoria){
        //     res.status(400)
        //     throw new Error("É necessario informar uma das categorias entre: Acessorios, Roupas e calçados, Eletronicos")
        // };

        // if(categoria !== undefined){
        //     if(categoria !== Category.ACCESSORIES && categoria !== Category.CLOTHES_AND_SHOES && categoria !== Category.ELETRONICS){
        //         res.status(400)
        //         throw new Error("A categoria deve ser um tipo valida: Acessorios, Roupas e calçados, Eletronicos")
        //     }
        // };

        // const newProduct = {id, nome, preco, categoria}
    
        // products.push(newProduct)

        await db.raw(`
            INSERT INTO product(id, name, price, description, image_url)
            VALUES("${id}", "${name}", "${price}", "${description}", "${image_url}")
        `)
    
        res.status(201).send("Novo produto cadastrado com sucesso!!")
    } catch(e: any){
        if(res.statusCode === 200){
            res.status(500)
        };
        res.send(e.message)
    } 

});

//postCreatedPurchase - Cria uma nova compra no Array de compras
app.post('/purchases', async (req:Request, res:Response) => {
    try{
        const {id, buyer, total_price, created_at, paid} = req.body

        if(id !== undefined){
            if(id.length < 4){
                res.status(404)
                throw new Error("O id deve conter 4 caracteres. Iniciando pela letra 'c', seguido por 3 números.")
            }

            const result = await db.raw(`
                SELECT * FROM purchases
                WHERE id = "${id}";
            `)

            if(result.includes(id)){
                res.status(404)
                throw new Error("Id deve ser diferente de um já existente")
            }
        };

        if(buyer !== undefined){
            const result = await db.raw(`
                SELECT * FROM purchases
                WHERE buyer = "${buyer}"
            `)

            if(result.includes(buyer)){
                res.status(404)
                throw new Error("Comprador deve ser um usuario existente.")
            }
        };

        if(total_price !== undefined){
            if(typeof total_price !== "number"){
                res.status(400)
                throw new Error("Por favor, digitar o preço com números")
            }
        };

        if(paid < 0 || paid > 1){
            res.status(400)
            throw new Error("Digite '0' para false ou '1' para true.")
        };

        await db.raw(`
            INSERT INTO purchases(id, buyer, total_price,  paid)
            VALUES("${id}", "${buyer}", ${total_price},  ${paid})
        `)
        
        res.status(201).send("Nova compra realizada com sucesso!!")
    } catch(e: any){
        if(res.statusCode === 200){
            res.status(500)
        };
        res.send(e.message)
    }
});

//getProductsById - Procurar um produto expecifico do Array de produtos pelo id
app.get('/products/:id', async (req:Request, res:Response) => {
    try{
        const id = req.params.id 
    
        //const resultado: Tproduto | undefined = products.find(product => product.id === id)
        const resultado = await db.raw(`
            SELECT * FROM product
            WHERE id = "${id}";
        `)

         if(resultado[0].id !== id){
                console.log(resultado)
                console.log(id)
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
app.get('/users/:id/purchases', async (req:Request, res:Response) => {
    try{
        const id = req.params.id

        //const resultado: Tcompra | undefined = purchase.find(compra => compra.userId === id)
        const resultado = await db.raw(`
            SELECT * FROM purchases
            WHERE buyer = "${id}";
        `)

        if(resultado[0].buyer !== id){
            res.status(400)
            console.log(resultado)
            console.log(id)
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