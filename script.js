let palavraEsq = "TERMO";
let palavraDir = "NILCE";
let linhaAtual = 0;
let colunaAtual = 0;
let jogoAtivo = true;
let jogoAtivoEsq = true;
let jogoAtivoDir = true;
const linhasEsq = document.querySelectorAll("#tela-esq .linha");
const linhasDir = document.querySelectorAll("#tela-dir .linha");
const teclas = document.querySelectorAll(".teclado");
const botaoEnter = document.querySelector(".enter");
const botaoBack = document.querySelector(".backspace");

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

function inserirLetra(letra) {
  if (!jogoAtivo) return;
  if (colunaAtual >= 5) return;
  letra = letra.toUpperCase();
  const inputsE = linhasEsq[linhaAtual].querySelectorAll(".letra");
  const inputsD = linhasDir[linhaAtual].querySelectorAll(".letra");
  if (!inputsE[colunaAtual].disabled) {
    inputsE[colunaAtual].value = letra;
  }
  if (!inputsD[colunaAtual].disabled) {
    inputsD[colunaAtual].value = letra;
  }
  colunaAtual++;
  if (colunaAtual > 4) colunaAtual = 5;
  focarCelula();
}

function apagarLetra() {
  if (!jogoAtivo) return;
  if (colunaAtual === 0) return;
  colunaAtual--;
  const inputsE = linhasEsq[linhaAtual].querySelectorAll(".letra");
  const inputsD = linhasDir[linhaAtual].querySelectorAll(".letra");
  if (!inputsE[colunaAtual].disabled) {
    inputsE[colunaAtual].value = "";
  }
  if (!inputsD[colunaAtual].disabled) {
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

function avaliarLinha(inputs, segredo) {
  const tentativa = Array.from(inputs)
    .map((i) => i.value.toUpperCase())
    .join("");
  const cont = contarLetras(segredo);
  const status = new Array(5).fill("");
  for (let i = 0; i < 5; i++) {
    const letra = tentativa[i];
    if (letra === segredo[i]) {
      status[i] = "correta";
      cont[letra]--;
    }
  }
  for (let i = 0; i < 5; i++) {
    if (status[i] === "") {
      const letra = tentativa[i];
      if (cont[letra] > 0) {
        status[i] = "presente";
        cont[letra]--;
      } else {
        status[i] = "ausente";
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
  if (!jogoAtivo) return;
  if (colunaAtual !== 5) return;
  const inputsE = linhasEsq[linhaAtual].querySelectorAll(".letra");
  const inputsD = linhasDir[linhaAtual].querySelectorAll(".letra");

  const acertouEsq = avaliarLinha(inputsE, palavraEsq);
  const acertouDir = avaliarLinha(inputsD, palavraDir);

  if (acertouEsq) {
    jogoAtivoEsq = false;
    escurecerRestantes(linhasEsq, linhaAtual + 1);
  }
  if (acertouDir) {
    jogoAtivoDir = false;
    escurecerRestantes(linhasDir, linhaAtual + 1);
  }

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
    jogoAtivo = false;
  }
}

teclas.forEach((btn) => {
  btn.addEventListener("click", () => {
    const letra = btn.textContent.trim();
    if (/^[A-Z]$/.test(letra)) inserirLetra(letra);
  });
});
botaoBack.addEventListener("click", () => apagarLetra());
botaoEnter.addEventListener("click", () => enviar());
document.addEventListener("keydown", (e) => {
  if (!jogoAtivo) return;
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
