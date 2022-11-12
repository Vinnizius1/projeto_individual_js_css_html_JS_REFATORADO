/* inputs de interação do usuário */
let buyOrSell = document.getElementById("tipo-select");
let nameOfTheProduct = document.getElementById("tipo_mercadoria");
let valueOfTheProduct = document.getElementById("tipo_valor");

/* Estas duas servirão para receber o valor do input e depois convertê-lo pro tipo number e depois irem pro método reduce para mostrar o valor final */
let valorComReplace;
let valorTotalFinal = [];

/* "account" é a div PAI de "frame"  */
const account = document.querySelector(".account");
const accountFilho = account.lastElementChild; // receberá "frame" como "filho" para então excluí-lo da DOM por meio da função limpaLocalStorage()

/* Mensagem exibida quando não houver mercadoria no "localStorage" */
let textoSemMercadoriaCadastrada = document.createElement("p");
textoSemMercadoriaCadastrada.textContent = "Nehuma mercadoria cadastrada";
textoSemMercadoriaCadastrada.className = "novoTexto";
if (localStorage.length == 0) {
  account.appendChild(textoSemMercadoriaCadastrada);
}

/* Métodos localStorage criados como função */
const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("db_merchandise")) || [];
const setLocalStorage = (dbMerchandise) =>
  localStorage.setItem("db_merchandise", JSON.stringify(dbMerchandise));

/* Função que "lê" os dados salvos no localStorage */
const readMerchandise = () => getLocalStorage();

/* 2.1: Limpa os campos após cadastro da mercadoria */
const clearFields = () => {
  buyOrSell.focus();
  nameOfTheProduct.value = "";
  valueOfTheProduct.value = "";
};

/* 2: Função que criará cada mercadoria */
const createMerchandise = (merchandise) => {
  const dbMerchandise = getLocalStorage();
  dbMerchandise.push(merchandise);
  setLocalStorage(dbMerchandise);
};

/* 1.1: Função apenas de validação que retornará TRUE ou FALSE de acordo com a resposta booleana do atributo REQUIRED em cada input */
const isValidFields = () => {
  // The HTMLFormElement.reportValidity() method returns true if the element's child controls satisfy their validation constraints.
  // When false is returned, cancelable invalid events are fired for each invalid child and validation problems are reported to the user.
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reportValidity
  return document.getElementById("form").reportValidity();
};

/* 1: Interação com o layout */
const saveForm = () => {
  // Esta função é acionada pelo comando "onsubmit", padrão de formulários
  if (isValidFields()) {
    const merchandise = {
      opcao: buyOrSell.value,
      nome: nameOfTheProduct.value,
      valor: valueOfTheProduct.value,
    };

    createMerchandise(merchandise); // Envia para o localStorage
    clearFields(); // Limpa os campos dos inputs
  }
};

/* 4: Criará linha a linha com os dados cadastrados, dados que estarão dentro de "merchandise" */
const createRow = (merchandise, index) => {
  // O forEach mandará a mercadoria
  // Esta "newDiv" será criada para receber a mercadoria e em seguida será inserida dentro da div "extratos"
  let newDiv = document.createElement("div");
  newDiv.className = "apagaInicio"; // REVER O NOME DESSA CLASSE!

  // Esta variável retornará "-" ou "+" para ser inserida junto com o valor. Setando-o como valor negativo (compra) ou positivo(venda)
  let sinalMaisOuMenos = merchandise.opcao;
  sinalMaisOuMenos == 0 ? (sinalMaisOuMenos = "-") : (sinalMaisOuMenos = "+");

  // A div "frame", filha da div "account", terá seu display mudado de "none" para "block", e então mostrará a mercadoria cadastrada pelos inputs
  let frame = document.querySelector(".frame");
  frame.style.display = "block";

  // valorComReplace é uma string q depois será tipo número
  // valorTotalFinal é um array vazio que receberá os valores já no tipo número para possibilitar a soma no método reduce
  valorComReplace = sinalMaisOuMenos + merchandise.valor;
  valorComReplace = Number(valorComReplace
    .replaceAll(".", "")
    .replaceAll(",", "."));
  valorTotalFinal.push(valorComReplace);
  let reducedValue = valorTotalFinal.reduce((total, atual) => total + atual);

  // Transforma o valor de "reducedValue" em moeda brasileira
  let valorToLocaleString;
  valorToLocaleString = reducedValue.toFixed(2);
  Math.sign(reducedValue) == -1
    ? (valorToLocaleString = -valorToLocaleString) // Fiz isso pro 1º valor não mostrar o sinal "negativo" na tela num caso de "compra"
    : valorToLocaleString;
  valorToLocaleString = parseFloat(valorToLocaleString).toLocaleString(
    "pt-BR",
    { minimumFractionDigits: 2, style: "currency", currency: "BRL" }
  );

  let a = merchandise.valor
  // console.log(typeof merchandise.valor);
  // console.log(a.length)
  a = a.length == 3 ? "0" + a : a

  // newDiv recebendo os dados dos 3 inputs que serão injetados na tela!
  newDiv.innerHTML += `
  <hr class="hr-main4" />
  <div class="primeiro" style="position: relative;">
    <p class="primeiro-sinal">${sinalMaisOuMenos}</p>
    <div class="oi">
      <p class="primeiro-lorem">${merchandise.nome}</p>      
      <button id="deletar ${index}" style="font-size: 10px; cursor: pointer;line-height: 11px; letter-spacing: 0.5px; margin-left: 10px;">Deletar</button>   
    </div>   
    <p class="primeiro-valor">R$ ${a}</p>
  </div> 
  `;

  // Agora vamos injetá-la após o término da div "extratos"
  let extratos = document.querySelector(".extratos");
  extratos.insertAdjacentElement("afterend", newDiv);

  // O conteúdo em total será mostrado já convertido na moeda brasileira
  let total = document.querySelector(".total-valor");
  total.textContent = `${valorToLocaleString}`;

  // Pequeno texto que será exibido logo após o valor final calculado como lucro ou despesa
  let linhaLucroOuDespesa = document.querySelector(".lucro");
  linhaLucroOuDespesa.textContent = `${
    Math.sign(reducedValue) == -1 ? "[Despesa]" : "[Lucro]"
  }`;

  /* Evento para o botão "deletar" */
  const deleteClient = (index) => {
    const dbMerchandise = readMerchandise();
    console.log(dbMerchandise)

    dbMerchandise.splice(index, 1)
    setLocalStorage(dbMerchandise);
    updateScreen();
  }

  const deletarLinha = (event) => {
    // console.log(event.target.id)

    const [indexParaDeletar] = event.target.id.split(" ")[1]
    // console.log(indexParaDeletar)

    deleteClient(indexParaDeletar)
  }

  document.querySelector(".oi > button").addEventListener("click", deletarLinha)
};

/* 5: Limpará a tela antes de adicionar nova mercadoria */
const clearScreen = () => {
  const rows = document.querySelectorAll(".apagaInicio");
  rows.forEach((row) => row.remove());
};

/* 3: TODA VEZ que a TELA LIGAR/CARREGAR os dados deverão aparecer lá */
function updateScreen() {
  const dbMerchandise = readMerchandise(); // PRIMEIRO lê os dados salvos no localStorage e os salva na variável "dbMerchandise"
  // Antes de preencher a DOM, limpa a tela
  clearScreen();
  // Volta o focus para o primeiro campo/input
  buyOrSell.value = "";
  // Depois cada elemento (que é um JSON) do array em "dbMerchandise" sofrerá a interação do método forEach()
  dbMerchandise.forEach(createRow); // O "forEach()" recebe uma função callback pra "criar" uma linha para CADA mercadoria, por isso for/para each/cada
}

// Função invocada quando a tela é carregada
updateScreen();

/* Demais funções acessórias ao funcionamento do nosso APP! :D */
function limpaLocalStorage() {
  // Mensagem de confirmação antes da exclusão:
  let alertaSobreExclusao = confirm(
    "Deseja prosseguir em excluir todos os dados?"
  );

  // Limpa o localStorage e a DOM:
  if (alertaSobreExclusao) {
    localStorage.clear();
    accountFilho.remove();
    location.reload();
  } else {
    return false;
  }
  // Zera o campo e volta o focus:
  buyOrSell.value = "";
}

// Abre menu quando se clica no ícone "x":
function abrirMenu() {
  let botaoMenuX = document.querySelector(".menu");
  const mediaTablet = window.matchMedia("(min-width: 768px)");

  // Função para modificar o tamanho do menu em tela Tablet ou tela Celular
  mediaTablet.matches
    ? botaoMenuX.classList.add("menu-tablet")
    : botaoMenuX.classList.add("menu-celular");
}

// Fecha o menu quando se clica no ícone "x":
function fecharMenu() {
  let botaoMenuX = document.querySelector(".menu");

  // Remove qualquer uma das classes adicionadas pela função abrirMenu()
  botaoMenuX.classList.remove("menu-celular");
  botaoMenuX.classList.remove("menu-tablet");
}

// Código do blog "https://www.blogson.com.br/formatar-moeda-dinheiro-com-javascript-do-jeito-facil/":
function testaCampoValor() {
  let elemento = document.getElementById("tipo_valor");
  let valor = elemento.value;
  // valor = parseInt(valor.replace(/[\D]+/g, ""));
  // valor = valor + "";
  // valor = valor.replace(/([0-9]{2})$/g, ",$1");
  // elemento.value = valor;
  // if (valor == "NaN") elemento.value = "";

  // Nova máscara!
  valor = valor.toString();
  valor = valor.replace(/[\D]+/g, "");
  valor = valor.replace(/([0-9]{2})$/g, ",$1");

  if (valor.length >= 6) {
    // while (/([0-9]{4})[,|\.]/g.test(valor)) {    -> REMOÇÃO DO '\'
    while (/([0-9]{4})[,|.]/g.test(valor)) {
      valor = valor.replace(/([0-9]{2})$/g, ",$1");
    // valor = valor.replace(/([0-9]{3})[,|\.]/g, ".$1");   -> REMOÇÃO DO '\'
      valor = valor.replace(/([0-9]{3})[,|.]/g, ".$1");
    }
  }
  elemento.value = valor;
  // e.target.value = valor;
}
