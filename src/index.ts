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
     //query builder para retornar todos os usuarios da tabela 'users'  
        const user = await db.select("*").from("users")

        res.status(200).send(user)
    } catch(e: any){
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(e.message)
    }
    
});

//getAllProduct - Devolve todo o Array de produtos
app.get('/products', async (req:Request, res:Response) => {
    try{
    //query builder para retornar todos os produtos da tabela 'products' 
        const product = await db.select("*").from("product")

        res.status(200).send(product)
    } catch(e: any){
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(e.message)
    }
});

//getProductByName - Devolve um produto expecifico do Array de produtos pelo seu nome
app.get('/products/search', async (req:Request, res:Response) => {
    try{
    //armazenando o termo de busca na constante 'q'
        const q = req.query.q as string

    //deixando o termo de busca todo em letras minusculas
        const query = q.toLowerCase()
        
    //verificando se o termo de busca contem algo escrito, mesmo que seja 1 letra.
        if(query.length < 1){
            
            res.status(404)
            throw new Error("O termo de busca deve conter pelo menos 1 caractere.")
        };

    //query builder para buscar o produto pelo seu nome e armazenando na constante 'productByName'
        const productByName = await db.select("*").from("product").where("name", "=", query)

    //verificando se foi retornado algum produto, caso não tenha sido, avisar que houve algum erro no termo de busca
        if(productByName.length === 0 ){
            res.status(400)
            throw new Error("Não foram encontrados produtos com esse nome. Tente iniciar a busca com a primeira letra maiscula.")
        }
    
        res.status(200).send(productByName)
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

    //verificando se todos os campos foram preenchidos
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

    //modelando o objeto que sera inserido na tabela, ao invés de fazer isso no proprio insert. Isso é considerado uma boa pratica
        const newUser = {
            id: id,
            name: name,
            email: email,
            password: password
        }
        
        
    //query builder para inserir um novo usuario na tabela 'users' 
        await db("users").insert(newUser)
    
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
    
    //fazendo com que o nome do produto seja cadastrado em letras minusculas
        const nameLowerCase = name.toLowerCase()

        //const ids = products.map(produto => {return produto.id})
        if(id !== undefined){
            if(id.length < 4 || id[0] !== 'p'){
                res.status(400)
                throw new Error("O 'id' do produto deve conter 4 caracteres(uma letra p e tres números).") 
            }

            if(id[0] !== 'p'){
                res.status(400)
                throw new Error("O 'id' deve iniciar com a letra 'p' minusculo.")
            }
        };

        if(!nameLowerCase){
            res.status(400)
            throw new Error("É necessario informar o nome do produto.")
        };

        if(!price || typeof price !== 'number'){
            res.status(400)
            throw new Error("É necessario informar um valor e que ele seja um 'número'.")
        };


    //modelando o objeto que sera inserido na tabela, ao invés de fazer isso no proprio insert. Isso é considerado uma boa pratica
        const newProduct = {
            id: id,
            name: nameLowerCase,
            price: price,
            description: description,
            image_url: image_url
        };

    //query builder para inserir um novo produto na tabela 'peoduct'
        await db("product").insert(newProduct)
    
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
        const {id, buyer, total_price, paid, products} = req.body

        if(id !== undefined){
            if(id.length < 4){
                res.status(404)
                throw new Error("O id deve conter 4 caracteres. Iniciando pela letra 'c', seguido por 3 números.")
            }

            const result = await db.select("*").from("purchases").where("id", "=", id)

            if(result.includes(id)){
                res.status(404)
                throw new Error("Id deve ser diferente de um já existente")
            }
        };

        if(buyer !== undefined){
           
            const result = await db.select("*").from("purchases").where("buyer", "=", buyer)

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

        // if(products !== undefined){
        //     const ids = await db.select("id").from("product")
        //      products.map(async (product: any) =>{
        //         const [results] = await db.select("id").from("product").where("id", "=", product.id)
    
        //         if(!results.id.includes(ids)){
        //             res.status(404)
        //             throw new Error("Um produto não existente foi selecionado. Verique e tente novamente.")
        //         }
        //         console.log(results)
        //     })
        // };

    //modelando o objeto que sera inserido na tabela, ao invés de fazer isso no proprio insert. Isso é considerado uma boa pratica
        const newPurchase = {
            id: id,
            buyer: buyer,
            total_price: total_price,
            paid: paid
        }

    //query builder para inserir uma nova compra na tabela 'purchases'
        await db("purchases").insert(newPurchase)


    //aqui estou fazendo um map no 'products', que foi recebido pelo body do purchases. Crio uma const e atribuo o id do objeto acima newPurchase, o id do produto do 'products' recebido no body e a quantidade também recebido do 'products'.
        products.map(async (product: any) => {
            const newItem = {
                purchase_id: newPurchase.id,
                product_id: product.id,
                quantity: product.quantity
            }

        //insiro as infos do objeto newItem que foi feito no map acima na tabela 'purchases_products
            await db("purchases_products").insert(newItem)
        });
        
        
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
    //armazenando o query param em uma constante
        const id = req.params.id 
    
    //query builder que busca um determinado produto por seu id
        const [resultado] = await db.select("*").from("product").where("id", "=", id)
        
        
         if(!resultado){
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
    //armazenando o query param em uma constante
        const id = req.params.id

    //query param que busca compra de um determinado usuario pelo o id do mesmo
        const [resultado] = await db.select("*").from("purchases").where("buyer", "=", id)

        if(!resultado){
            res.status(404)
            throw new Error("Esse usuario não existe, logo não existem compras feitas no mesmo. Digite um usuario valido.")
        };
        console.log(resultado.lengt)
        res.status(200).send(resultado)
    }catch(e: any){
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(e.message)
    }
});

//deleteUserById - Deletar um usuario utilizando o seu id
app.delete('/user/:id', async (req:Request, res:Response) => {
    try{
        const id = req.params.id

        // const index = user.findIndex(usuario => usuario.id === id)

        // const usuarios = user.map(users => {return users.id})
        // if(!usuarios.includes(id)){
        //     res.status(400)
        //     throw new Error("Digite o 'id' de um usuario existente.")
        // }
    
        // if(index >= 0){
        //     user.splice(index, 1)
        // };

    //atribuindo o usuario a constante 'user', caso ele seja encontrado na tabela users pelo id informado
        const [user] = await db.select("*").from("users").where({id: id})

    //testando se a const 'user' possui alguma coisa
        if(!user){
            res.status(404)
            throw new Error("'id' não encontrado")
        }
        
    //query builder que deleta um usuario da tabela de 'users'
        await db.delete().from("users").where({id: id})
    
        res.status(200).send("Usuario apagado com sucesso")
    }catch(e: any){
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(e.message)
    }
});

//deleteProductById - Deletar um produto utilizando o seu id
app.delete('/products/:id', async (req:Request, res:Response) => {
    try{
        const id = req.params.id

        // const index = products.findIndex(produto => produto.id === id)

        // const produtos = products.map(product => {return product.id})
        // if(!produtos.includes(id)){
        //     res.status(400)
        //     throw new Error("Digite o 'id' de um produto existente.")
        // }
    
        // if(index >= 0){
        //     products.splice(index, 1)
        // };
    
    //atribuindo o produto a constante 'produto', caso ele seja encontrado na tabela product pelo id informado
        const [produto]  = await db.select("*").from("product").where({id: id})

        if(!produto){
            res.status(404)
            throw new Error("Digite o 'id' de um produto existente.")
        }

    //query builder para apagar um produto da tabela 'product' 
        await db.delete().from("product").where({id: id})

        res.status(200).send("Produto apagado com sucesso")
    }catch(e:any){
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(e.message)
    }
});

//editUserById - Editar um usuario expecifico. Encontrando ele por seu id
app.put('/user/:id', async (req:Request, res:Response) => {
    try{
        const id = req.params.id

        const newId = req.body.id as string | undefined
        const newName = req.body.name as string | undefined
        const newEmail = req.body.email as string | undefined
        const newPassword = req.body.password as string | undefined


        if(newId !== undefined){
            if(newId.length < 3){
                res.status(400)
                throw new Error("O 'id' do usuario deve conter 3 digitos iniciando com 0(Ex: '003', '008', '012').")
            }
        };

        if(newName !== undefined){
            if(newName.length === 0){
                res.status(400)
                throw new Error("O nome deve conter no minimo 1 caracter.")
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

        if(newPassword !== undefined){
            if(newPassword.length < 6){
                res.status(400)
                throw new Error("A senha deve conter no minimo 6 digitos.")
            }
        };

    //atribuindo todas as infos do usuario expecifo a constante 'usuario'
        const [usuario] = await db.select("*").from("users").where({"id": id}) 
    
    //aqui, se o id digitado do usuario existir, vamos entrar nesse bloco e, toda a informação do body sera atribuida a constante 'updateUser'. E em seguida sera upado pra tabela 'users' as modificações
        if(usuario){
           const updateUser = {
            id: newId || usuario.id,
            name: newName || usuario.name,
            email: newEmail || usuario.email,
            password: newPassword || usuario.password
           }

        //query builder que  atualiza as informações do usuario expecifico na tabela 'users'
           await db("users").update(updateUser).where({id: id})
        }else{
            res.status(404)
            throw new Error("Digite um 'id' valido para editar o usuario em questão.")
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
app.put('/products/:id', async (req:Request, res:Response) => {
    try{
        const id = req.params.id

        const newId = req.body.id as string | undefined
        const newName = req.body.name as string | undefined
        const newPrice = req.body.price as number 
        //const newCategoria = req.body.categoria as Category | undefined
        const newDescription = req.body.description as string | undefined

    //forçando com que o nome do produto seja em letras minusculos, caso ele seja alterado.
        const newNameLowerCase = newName?.toLowerCase()
    

        if(newId !== undefined){
            if(newId[0] !== 'p'){
                res.status(400)
                throw new Error("O 'id' do produto deve iniciar com a letra p, seguido de 3 numeros(Ex: 'p001', 'p009', 'p016', 'p0120')")
            }
        };

        // if(!newNome){
        //     res.status(400)
        //     throw new Error("O produto pecisa conter um nome.")
        // };

        if(newPrice === 0){
            res.status(400)
            throw new Error("O produto precisa de um preço.")
        }

        // if(newCategoria !== undefined){
        //     if(newCategoria !== Category.ACCESSORIES && newCategoria !== Category.CLOTHES_AND_SHOES && newCategoria !== Category.ELETRONICS ){
        //         res.status(400)
        //         throw new Error("A categoria deve ser um tipo valida: Acessorios, Roupas e calçados, Eletronicos")
        //     }
        // };

        if(newDescription !== undefined){
            if(newDescription.length === 0){
                res.status(400)
                throw new Error("O produto precisa de uma descrição")
            }
        }
    
      const [produto] = await db.select("*").from("product").where({id: id})
    
        if(produto){
            const updateProduct = {
                id: newId || produto.id,
                name: newNameLowerCase || produto.name,
                price: isNaN(newPrice) ? produto.price : newPrice,
                //categoria: newCategoria || produto.categoria
                description: newDescription || produto.description 
            }
           
            await db("product").update(updateProduct).where({id: id})
        }else{
            res.status(404)
            throw new Error("Digite um 'id' valido para editar o produto em questão.")
        };
    
        res.status(200).send("Produto atualizado com sucesso")
    }catch(e: any){
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(e.message)
    }
});


//getPurchaseById - Procurar uma compra expecifica do Array de 'purchases' pelo id
app.get('/purchases/:id', async (req:Request, res:Response) => {
    try{
        const idPurchase = req.params.id
        
    //query builder para selecionar todas as colunas da tabela 'purchases' que tenham o id parecido com o recebido por parametro.
        const compras = await db.select("*").from("purchases").where("id", "=", idPurchase)

        if(compras.length === 0){
            res.status(404)
            throw new Error("Compra não encontrada. Tente um outro 'id'.")
        }

        if(compras[0].id === idPurchase){
        
        //esse query builder vai fazer uma busca e selecionar as colunas expecificadas da tabela 'purchase' e fazer um join entra a tabela purchases e a tabela users. E guardo o resultado dessa busca na const compra.
            const [compra] = await db("purchases")
            .select(
                "purchases.id AS IdCompra",
                "purchases.total_price AS TotalCompra",
                "purchases.created_at AS DataCompra",
                "purchases.paid AS StatusPagamento",
                "purchases.buyer AS IdComprador",
                "users.email AS EmailComprador",
                "users.name AS NomeComprador", 
            ).innerJoin(
               "users","purchases.buyer","=","users.id" 
            ).where({"purchases.id": idPurchase}) 

         //esse query builder vai fazer uma busca e selecionar as colunas expecificadas da tabela 'product' e fazer um join entra a tabela 'product' e a tabela 'purchases_products'. E guardo o resultado dessa busca na const produto.
            const produto = await db("product")
            .select(
                "product.id AS id_produto",
                "product.name",
                "product.price",
                "product.description",
                "product.image_url",
                "purchases_products.quantity AS quantity")
                .innerJoin("purchases_products", "product.id", "=", "purchases_products.product_id")
                .where({"purchases_products.purchase_id": idPurchase})
        

        //aqui eu estou atribuindo o valor da busca guardada em 'produto', na propriedade 'product_list' do objeto que se encontra na const compra.
            compra.product_list = produto
            compra.StatusPagamento = 0 ? 'false': 'true'

            
            
            res.status(200).send(compra)
        }else{
            res.status(404)
            throw new Error("'id' de usuario inexistente")
        };
    }
    catch(e: any){
        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(e.message)
    }
});