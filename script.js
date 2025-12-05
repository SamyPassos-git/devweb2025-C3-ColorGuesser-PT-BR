// Mapa centralizado com nomes e seus hex — usado para exibir a lista e para o jogo
const MAPA_CORES = {
  vermelho: "#FF0000",
  azul: "#0000FF",
  verde: "#008000",
  amarelo: "#FFFF00",
  roxo: "#800080",
  laranja: "#FFA500",
  rosa: "#FFC0CB",
  ciano: "#00FFFF",
  lima: "#00FF00",
  magenta: "#FF00FF",
  turquesa: "#40E0D0",
  coral: "#FF7F50",
  ouro: "#FFD700",
  "azul marinho": "#000080",
  lavanda: "#E6E6FA",
}

// Lista de nomes utilizados pelo jogo (garante consistência com o mapa)
const CORES = Object.keys(MAPA_CORES)

// Estado do jogo
let corSecreta = ""
let tentativas = 3
let jogoTerminado = false
let venceu = false

// Elementos do DOM
const fundoJogo = document.getElementById("fundoJogo")
const entradaCor = document.getElementById("entradaCor")
const botaoAdivinhar = document.getElementById("botaoAdivinhar")
const botaoJogarNovamente = document.getElementById("botaoJogarNovamente")
const feedback = document.getElementById("feedback")
const feedbackDica = document.getElementById("feedbackDica")
const circulosTentativas = document.getElementById("circulosTentativas")
const painelCores = document.getElementById("painelCores")

// Iniciar jogo
document.addEventListener("DOMContentLoaded", () => {
  iniciarNovoJogo()
  if (entradaCor) {
    entradaCor.focus()
  }

  // Botões de eventos
  botaoAdivinhar.addEventListener("click", processarAdivinhar)
  entradaCor.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !jogoTerminado) {
      processarAdivinhar()
    }
  })
  botaoJogarNovamente.addEventListener("click", iniciarNovoJogo)

  // Renderizar painel lateral de cores
  renderPainelCores()
})

function iniciarNovoJogo() {
  corSecreta = CORES[Math.floor(Math.random() * CORES.length)]
  tentativas = 3
  jogoTerminado = false
  venceu = false

  entradaCor.value = ""
  entradaCor.disabled = false
  feedback.textContent = ""
  feedback.className = "mensagem-feedback"
  if (feedbackDica) {
    feedbackDica.textContent = ""
    feedbackDica.style.display = "";
  }
  botaoAdivinhar.disabled = false
  botaoAdivinhar.style.display = "block"
  botaoJogarNovamente.style.display = "none"

  // Resetar fundo
  fundoJogo.style.background = "linear-gradient(135deg, #6c3497 0%, #87ceeb 100%)"

  // Resetar círculos de tentativas
  atualizarExibiçaoTentativas()
}

function atualizarExibiçaoTentativas() {
  const circulos = circulosTentativas.querySelectorAll(".circulo")
  circulos.forEach((circulo, indice) => {
    if (indice < tentativas) {
      circulo.classList.add("ativo")
    } else {
      circulo.classList.remove("ativo")
    }
  })
}

function processarAdivinhar() {
  // Validar entrada
  if (entradaCor.value.trim() === "") {
    exibirFeedback("❌ Por favor, digite uma cor!", false)
    return
  }

  const tentativa = entradaCor.value.toLowerCase().trim()

  // Verificar se adivinhou corretamente
  if (tentativa === corSecreta) {
    venceu = true
    jogoTerminado = true
    exibirFeedback("🎉 Parabéns! Você adivinhou a cor!", true)

    // Converter nome da cor para hex para o fundo
    const corHex = obterCorHex(corSecreta)
    fundoJogo.style.background = corHex

    entradaCor.disabled = true
    botaoAdivinhar.disabled = true
    botaoJogarNovamente.style.display = "block"
    return
  }

  // Adivinhar incorreto
  tentativas--
  entradaCor.value = ""
  atualizarExibiçaoTentativas()

  if (tentativas <= 0) {
    jogoTerminado = true
    exibirFeedback(`💔 Fim de jogo! A cor era: ${corSecreta}`, false)
    // Não mostrar dica quando o jogo acabou (já mostramos a cor)
    if (feedbackDica) feedbackDica.textContent = ""
    entradaCor.disabled = true
    botaoAdivinhar.disabled = true
    botaoJogarNovamente.style.display = "block"
  } else {
    const restantes = tentativas
    const pluralTentativa = restantes === 1 ? "tentativa" : "tentativas"
    const pluralRestante = restantes === 1 ? "restante" : "restantes"
    exibirFeedback(`❌ Errado! Você tem ${restantes} ${pluralTentativa} ${pluralRestante}.`, false)
    // Mostrar dica com a primeira letra da cor secreta
    mostrarDicaPrimeiraLetra()
  }
}

function exibirFeedback(mensagem, éSucesso) {
  feedback.textContent = mensagem
  feedback.className = `mensagem-feedback ${éSucesso ? "sucesso" : "erro"}`
}

// Cores em formato hex — usa o mapa centralizado
function obterCorHex(nomeCor) {
  return MAPA_CORES[nomeCor] || "#6c3497"
}

// Mostra uma dica breve (apenas a primeira letra) sem revelar o nome completo
function mostrarDicaPrimeiraLetra() {
  if (!feedbackDica || !corSecreta) return
  const primeira = corSecreta.charAt(0).toUpperCase()
  feedbackDica.textContent = `Dica: começa com a letra '${primeira}'.`
  feedbackDica.style.display = "block"
}

// Renderiza a lista de cores no painel lateral
function renderPainelCores() {
  if (!painelCores) return

  // Cabeçalho
  painelCores.innerHTML = "<h2>Cores disponíveis</h2>"

  const lista = document.createElement("div")
  lista.className = "lista-cores"

  Object.keys(MAPA_CORES).forEach((nome) => {
    const item = document.createElement("div")
    item.className = "cor-item"

    const swatch = document.createElement("span")
    swatch.className = "cor-swatch"
    swatch.style.background = MAPA_CORES[nome]

    const label = document.createElement("span")
    label.className = "cor-nome"
    label.textContent = nome

    item.appendChild(swatch)
    item.appendChild(label)

    // Clique preenche o campo de entrada e foca
    item.addEventListener("click", () => {
      if (entradaCor) {
        entradaCor.value = nome
        entradaCor.focus()
      }
    })

    lista.appendChild(item)
  })

  painelCores.appendChild(lista)
}
