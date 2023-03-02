
const player = process.argv[2]

function gerarNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

const result = gerarNum(0, 2)
//console.log(result)
const option = ["pedra", "papel", "tesoura"]

const maquina = option[result]
//console.log(maquina)

if(maquina === "pedra" && player === "pedra"){
    console.log("Houve um empate")
} else if(maquina === "pedra" && player === "papel"){
    console.log("O player venceu !!")
} else if(maquina === "pedra" && player === "tesoura"){
    console.log("A maquina venceu !!")
} else if(maquina === "papel" && player === "pedra"){
    console.log("A maquina venceu !!")
}  else if(maquina === "papel" && player === "papel"){
    console.log("Houve um empate")
} else if(maquina === "papel" && player === "tesoura"){
    console.log("O player venceu !!")
} else if(maquina === "tesoura" && player === "pedra"){
    console.log("O player venceu !!")
} else if(maquina === "tesoura" && player === "papel"){
    console.log("A maquina venceu !!")
} else if(maquina === "tesoura" && player === "tesoura"){
    console.log("Houve um empate")
}