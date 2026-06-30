// Guardo o estado do jogo aqui em um objeto para evitar variáveis globais soltas
const estado = {
  pontuacao: 0,
  rodada: 0,
  tempoRestante: 30,
  intervaloTempo: null,
  nomeJogador: "",
  respondeu: false
};

// Cada rodada tem um par: emoji normal e emoji diferente
const pares = [
  { normal: "🍎", diferente: "🍊" },
  { normal: "⭐", diferente: "🌙" },
  { normal: "🐶", diferente: "🐱" },
  { normal: "🏀", diferente: "⚽" },
  { normal: "🎵", diferente: "🎸" },
  { normal: "🌊", diferente: "🔥" },
  { normal: "🍕", diferente: "🍔" },
  { normal: "🚗", diferente: "✈️" }
];

// Pego os elementos do HTML uma vez aqui para não repetir querySelector toda hora
const elGrid = document.getElementById("grid");
const elPontuacao = document.getElementById("pontuacao");
const elRodada = document.getElementById("rodada");
const elTempo = document.getElementById("tempo");
const elNomeJogador = document.getElementById("nomeJogador");
const elTelaInicial = document.getElementById("tela-inicial");
const elTelaFim = document.getElementById("tela-fim");
const elMensagemFim = document.getElementById("mensagemFim");
const elInputNome = document.getElementById("inputNome");

document.getElementById("btnJogar").addEventListener("click", iniciarJogo);
document.getElementById("btnReiniciar").addEventListener("click", reiniciarJogo);

function iniciarJogo() {
  // Pego o nome digitado, com fallback para "Jogador"
  const nome = elInputNome.value.trim();
  estado.nomeJogador = nome !== "" ? nome : "Jogador";
  elNomeJogador.textContent = estado.nomeJogador;

  // Escondo a tela inicial e mostro o jogo
  elTelaInicial.classList.add("escondido");
  elTelaFim.classList.add("escondido");

  // Reseto os valores
  estado.pontuacao = 0;
  estado.rodada = 0;
  estado.tempoRestante = 30;

  atualizarPlacar();
  iniciarTemporizador();
  gerarRodada();
}

function iniciarTemporizador() {
  // Uso setInterval para contar o tempo — escolhi 30s por ser ideal para festa
  clearInterval(estado.intervaloTempo);
  estado.intervaloTempo = setInterval(function() {
    estado.tempoRestante--;
    elTempo.textContent = estado.tempoRestante;

    if (estado.tempoRestante <= 0) {
      clearInterval(estado.intervaloTempo);
      encerrarJogo();
    }
  }, 1000);
}

function gerarRodada() {
  estado.rodada++;
  estado.respondeu = false;
  atualizarPlacar();
  limparGrid();

  // Escolho um par aleatório de emojis para essa rodada
  const par = pares[Math.floor(Math.random() * pares.length)];

  // Crio 16 células (grade 4x4) e escolho posição aleatória para o diferente
  const totalCelulas = 16;
  const posicaoDiferente = Math.floor(Math.random() * totalCelulas);

  for (let i = 0; i < totalCelulas; i++) {
    const celula = criarCelula(i, posicaoDiferente, par);
    elGrid.appendChild(celula);
  }
}

function criarCelula(indice, posicaoDiferente, par) {
  // Uso createElement porque o professor proíbe innerHTML para criar elementos
  const celula = document.createElement("div");
  celula.classList.add("quadrado");

  const ehDiferente = indice === posicaoDiferente;

  if (ehDiferente) {
    celula.classList.add("diferente");
    celula.textContent = par.diferente;
    // Uso dataset para guardar se essa célula é o diferente — fácil de checar no clique
    celula.dataset.tipo = "diferente";
  } else {
    celula.classList.add("normal");
    celula.textContent = par.normal;
    celula.dataset.tipo = "normal";
  }

  celula.addEventListener("click", function() {
    verificarClique(celula);
  });

  return celula;
}

function verificarClique(celula) {
  // Ignoro cliques duplos na mesma rodada
  if (estado.respondeu) return;
  estado.respondeu = true;

  if (celula.dataset.tipo === "diferente") {
    // Acertou! Bônus de tempo para manter o ritmo de festa
    estado.pontuacao += 10;
    estado.tempoRestante += 3;
    mostrarFeedback(celula, true);
  } else {
    // Errou — penalidade de pontos e tempo
    estado.pontuacao = Math.max(0, estado.pontuacao - 5);
    estado.tempoRestante = Math.max(1, estado.tempoRestante - 3);
    mostrarFeedback(celula, false);
  }

  atualizarPlacar();

  // Aguardo 600ms para o jogador ver o feedback antes de gerar nova rodada
  setTimeout(gerarRodada, 600);
}

function mostrarFeedback(celula, acertou) {
  // Destaco visualmente o resultado do clique
  celula.style.outline = acertou ? "4px solid #00ff88" : "4px solid #ff4444";
}

function atualizarPlacar() {
  elPontuacao.textContent = estado.pontuacao;
  elRodada.textContent = estado.rodada;
  elTempo.textContent = estado.tempoRestante;
}

function limparGrid() {
  // Removo cada filho do grid individualmente — sem innerHTML
  while (elGrid.firstChild) {
    elGrid.removeChild(elGrid.firstChild);
  }
}

function encerrarJogo() {
  limparGrid();
  elTelaFim.classList.remove("escondido");
  elMensagemFim.textContent =
    estado.nomeJogador + " fez " + estado.pontuacao +
    " pontos em " + (estado.rodada - 1) + " rodadas!";
}

function reiniciarJogo() {
  elTelaFim.classList.add("escondido");
  elTelaInicial.classList.remove("escondido");
  elInputNome.value = "";
}
