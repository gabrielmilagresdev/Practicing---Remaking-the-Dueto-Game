let palavraEsq = "PETSI";
const palavraEsqAjuda = palavraEsq.split("");
let palavraDir = "TERMO";
const palavraDirAjuda = palavraDir.split("");
let linhaAtual = 0;
let colunaAtual = 0;
let jogoAtivo = true;
let jogoAtivoEsq = true;
let jogoAtivoDir = true;
let contVitoria = 0;
let contDerrota = 0;
let contDerrotaDir = 1;
let contDerrotaEsq = 1;
let contAjuda = 5;
const linhasEsq = document.querySelectorAll("#tela-esq .linha");
const linhasDir = document.querySelectorAll("#tela-dir .linha");
const teclas = document.querySelectorAll(".teclado");
const botaoEnter = document.querySelector(".enter");
const botaoBack = document.querySelector(".backspace");
const botaoAjuda = document.querySelector("#ajuda");

function iniciarLinhas() {
  for (let i = 0; i < linhasEsq.length; i++) {
    const inputsE = linhasEsq[i].querySelectorAll(".letra");
    const inputsD = linhasDir[i].querySelectorAll(".letra");
    inputsE.forEach((inp) => (inp.disabled = i !== 0));
    inputsD.forEach((inp) => (inp.disabled = i !== 0));
    if (i !== 0) {
      inputsE.forEach((inp) => inp.classList.add("espera"));
      inputsD.forEach((inp) => inp.classList.add("espera"));
    } else {
      inputsE.forEach((inp) => inp.classList.remove("espera"));
      inputsD.forEach((inp) => inp.classList.remove("espera"));
    }
  }
  focarCelula();
}

function focarCelula() {
  const input =
    linhasEsq[linhaAtual].querySelectorAll(".letra")[colunaAtual] || null;
  if (input && !input.disabled) input.focus();
}
function eliminarLetra(letraEliminadaVetor, lado, estado) {
  let letraEliminada = document.getElementById(letraEliminadaVetor);
  if (lado == "dir") {
    if (estado == "correta") {
      letraEliminada.style.borderRightColor = "green";
      letraEliminada.style.borderRightWidth = "5px";
      return null;
    }
    if (estado == "presente") {
      letraEliminada.style.borderRightColor = "yellow";
      letraEliminada.style.borderRightWidth = "5px";
      return null;
    }
    if (estado == "ausente") {
      letraEliminada.style.borderRightColor = "red";
      letraEliminada.style.borderRightWidth = "5px";
      return null;
    }
  } else if (lado == "esq") {
    if (estado == "correta") {
      letraEliminada.style.borderLeftColor = "green";
      letraEliminada.style.borderLeftWidth = "5px";
      return null;
    }
    if (estado == "presente") {
      letraEliminada.style.borderLeftColor = "yellow";
      letraEliminada.style.borderLeftWidth = "5px";
      return null;
    }
    if (estado == "ausente") {
      letraEliminada.style.borderLeftColor = "red";
      letraEliminada.style.borderLeftWidth = "5px";
      return null;
    }
  }
}
function inserirLetra(letra) {
  if (!jogoAtivoEsq && !jogoAtivoDir) return; // trava só se os dois acabaram
  if (colunaAtual >= 5) return;

  letra = letra.toUpperCase();
  const inputsE = linhasEsq[linhaAtual].querySelectorAll(".letra");
  const inputsD = linhasDir[linhaAtual].querySelectorAll(".letra");

  if (jogoAtivoEsq && !inputsE[colunaAtual].disabled) {
    inputsE[colunaAtual].value = letra;
  }
  if (jogoAtivoDir && !inputsD[colunaAtual].disabled) {
    inputsD[colunaAtual].value = letra;
  }

  colunaAtual++;
  if (colunaAtual > 4) colunaAtual = 5;
  focarCelula();
}

function apagarLetra() {
  if (!jogoAtivoEsq && !jogoAtivoDir) return;
  if (colunaAtual === 0) return;

  colunaAtual--;
  const inputsE = linhasEsq[linhaAtual].querySelectorAll(".letra");
  const inputsD = linhasDir[linhaAtual].querySelectorAll(".letra");

  if (jogoAtivoEsq && !inputsE[colunaAtual].disabled) {
    inputsE[colunaAtual].value = "";
  }
  if (jogoAtivoDir && !inputsD[colunaAtual].disabled) {
    inputsD[colunaAtual].value = "";
  }

  focarCelula();
}

function contarLetras(palavra) {
  const cont = {};
  for (let i = 0; i < palavra.length; i++) {
    const l = palavra[i];
    cont[l] = (cont[l] || 0) + 1;
  }
  return cont;
}

function avaliarLinhaEsq(inputs, segredo) {
  const tentativa = Array.from(inputs)
    .map((i) => i.value.toUpperCase())
    .join("");
  const cont = contarLetras(segredo);
  const status = new Array(5).fill("");
  for (let i = 0; i < 5; i++) {
    const letra = tentativa[i];
    if (letra === segredo[i]) {
      status[i] = "correta";
      eliminarLetra(letra, "esq", "correta");
      cont[letra]--;
    }
  }
  for (let i = 0; i < 5; i++) {
    if (status[i] === "") {
      const letra = tentativa[i];
      if (cont[letra] > 0) {
        status[i] = "presente";
        eliminarLetra(letra, "esq", "presente");
        cont[letra]--;
      } else {
        status[i] = "ausente";
        eliminarLetra(letra, "esq", "ausente");
      }
    }
  }
  for (let i = 0; i < 5; i++) {
    inputs[i].classList.add(status[i]);
    inputs[i].disabled = true;
  }
  return tentativa === segredo;
}
function avaliarLinhaDir(inputs, segredo) {
  const tentativa = Array.from(inputs)
    .map((i) => i.value.toUpperCase())
    .join("");
  const cont = contarLetras(segredo);
  const status = new Array(5).fill("");
  for (let i = 0; i < 5; i++) {
    const letra = tentativa[i];
    if (letra === segredo[i]) {
      status[i] = "correta";
      eliminarLetra(letra, "dir", "correta");
      cont[letra]--;
    }
  }
  for (let i = 0; i < 5; i++) {
    if (status[i] === "") {
      const letra = tentativa[i];
      if (cont[letra] > 0) {
        status[i] = "presente";
        eliminarLetra(letra, "dir", "presente");
        cont[letra]--;
      } else {
        status[i] = "ausente";
        eliminarLetra(letra, "dir", "ausente");
      }
    }
  }
  for (let i = 0; i < 5; i++) {
    inputs[i].classList.add(status[i]);
    inputs[i].disabled = true;
  }
  return tentativa === segredo;
}

function escurecerRestantes(telaLinhas, aPartir) {
  for (let i = aPartir; i < telaLinhas.length; i++) {
    const inputs = telaLinhas[i].querySelectorAll(".letra");
    inputs.forEach((inp) => {
      inp.disabled = true;
      inp.classList.add("escurecida");
    });
  }
}

function bloquearTela(telaLinhas) {
  for (let i = 0; i < telaLinhas.length; i++) {
    const inputs = telaLinhas[i].querySelectorAll(".letra");
    inputs.forEach((inp) => (inp.disabled = true));
  }
}

function enviar() {
  if (!jogoAtivoEsq && !jogoAtivoDir) return;
  if (colunaAtual !== 5) return;

  const inputsE = linhasEsq[linhaAtual].querySelectorAll(".letra");
  const inputsD = linhasDir[linhaAtual].querySelectorAll(".letra");

  const acertouEsq = jogoAtivoEsq
    ? avaliarLinhaEsq(inputsE, palavraEsq)
    : false;
  const acertouDir = jogoAtivoDir
    ? avaliarLinhaDir(inputsD, palavraDir)
    : false;

  if (acertouEsq) {
    jogoAtivoEsq = false;
    escurecerRestantes(linhasEsq, linhaAtual + 1);
    contVitoria++;
    contDerrotaEsq = 0;
  }
  if (acertouDir) {
    jogoAtivoDir = false;
    escurecerRestantes(linhasDir, linhaAtual + 1);
    contVitoria++;
    contDerrotaDir = 0;
  }

  if (contVitoria == 2) alert("VOCÊ VENCEU");

  linhaAtual++;
  colunaAtual = 0;

  if (linhaAtual < 7) {
    const proxE = linhasEsq[linhaAtual].querySelectorAll(".letra");
    const proxD = linhasDir[linhaAtual].querySelectorAll(".letra");

    proxE.forEach((inp) => {
      if (jogoAtivoEsq) {
        inp.disabled = false;
        inp.classList.remove("espera");
      }
    });
    proxD.forEach((inp) => {
      if (jogoAtivoDir) {
        inp.disabled = false;
        inp.classList.remove("espera");
      }
    });

    focarCelula();
  } else {
    jogoAtivoEsq = false;
    jogoAtivoDir = false;
  }

  contDerrota++;
  if (contDerrota == 7 && contVitoria != 2) {
    alert("VOCÊ PERDEU\n");
    if (contDerrotaDir == 1) {
      alert(`PALAVRA DA DIREITA: ${palavraDir}\n`);
    }
    if (contDerrotaEsq == 1) {
      alert(`PALAVRA DA ESQUERDA: ${palavraEsq}`);
    }
  }
}

function pedirAjuda() {
  contAjuda--;
  if (contAjuda == 2) {
    alert("APERTE MAIS UMA VEZ PARA DESISTIR");
    return null;
  }
  if (contAjuda <= 1) {
    jogoAtivoEsq = false;
    escurecerRestantes(linhasEsq, linhaAtual);
    jogoAtivoDir = false;
    escurecerRestantes(linhasDir, linhaAtual);
    alert(
      `A RESPOSTA É:\nPALAVRA DA ESQUERDA: ${palavraEsq}\nPALAVRA DA DIREITA: ${palavraDir}`
    );
    return null;
  }
  alert(
    `A ${contAjuda + 1}º LETRA DAS PALAVRAS É: \nESQUERDA: ${
      palavraEsqAjuda[contAjuda]
    }\nDIREITA: ${palavraDirAjuda[contAjuda]}`
  );
}

teclas.forEach((btn) => {
  btn.addEventListener("click", () => {
    const letra = btn.textContent.trim();
    if (/^[A-Z]$/.test(letra)) inserirLetra(letra);
  });
});
botaoBack.addEventListener("click", () => apagarLetra());
botaoEnter.addEventListener("click", () => enviar());
botaoAjuda.addEventListener("click", () => pedirAjuda());
document.addEventListener("keydown", (e) => {
  if (!jogoAtivoEsq && !jogoAtivoDir) return;
  const k = e.key;
  if (/^[a-zA-Z]$/.test(k)) {
    e.preventDefault();
    inserirLetra(k.toUpperCase());
  } else if (k === "Backspace") {
    e.preventDefault();
    apagarLetra();
  } else if (k === "Enter") {
    e.preventDefault();
    enviar();
  }
});

iniciarLinhas();
