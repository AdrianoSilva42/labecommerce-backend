import {user, products, purchase, createUser, getAllUsers, createdProduct, getAllProduct, getProductById, queryProductsByName, createPurchase, getAllPurchasesFromUserId} from "./database"
import { Category } from "./types"

// console.table(user)
// console.table(products)
// console.table(purchase)

// createUser("003", "ciente03@email.com", "125478")

// console.table(getAllUsers())

// createdProduct('p003', 'Teclado sem fio', 210, Category.ELETRONICS)

// console.table(getAllProduct())

 getProductById("p002")

// queryProductsByName('MEMORIA RAM')

// createPurchase("003", "p002", 4, 500 )

// getAllPurchasesFromUserId("004")