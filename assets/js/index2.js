const compraVenda = document.getElementById("tipo-select");
const nomeDaMercadoria = document.querySelector(".input-mercadoria input");
const valor = document.querySelector(".input-valor input");

// "account" é a div PAI de "frame":
const account = document.querySelector(".account");
// Receberá "frame" para então excluí-la da DOM por meio da função limpaLocalStorage()
const accountUltimoFilhoFrame = account.lastElementChild;

// "frame" é a div no index.html que recebe a string dos dados cadastrados
let frame = document.querySelector(".frame");

// Recebe o valor dinamicamente e depois diz se teve lucro ou despesa
let lucroOuPrejuizo = document.querySelector(".lucro");

/* 
Variáveis GLOBAIS 
*/
// Receberá a seleção de compra ou venda, o nome da mercadoria e o valor que serão passados pro DOM
let mercadoria;
let mercadorias;

// Receberá os valores finais que serão passados pro DOM
let ultimasLinhas;
let mercadoriaFinal;

// Somará cada valor passado no input "Valor" pelo usuário
let valorFinal;
let valorToLocaleString;

// Arrays criados para armazenarem cada "valor.value" inserido e depois usados numa função que os somará
// let valoresAdicionados = [];
let valoresAdicionados2 = [];

// Receberá os arrays e depois utilizará o método Reduce() pra somar valores
let spread;

// Variáveis pro cálculo aceitando vírgula para separar casas decimais
let valorParseado; // Será pro 2º valor adicionado
let valorParseado1; // Este refere-se ao 1º valor inserido na aplicação

// Mensagem quando não houver mercadoria cadastrada
let textoSemMercadoriaCadastrada = document.createElement("p");
textoSemMercadoriaCadastrada.textContent = "Nehuma mercadoria cadastrada";
textoSemMercadoriaCadastrada.className = "novoTexto";

if (localStorage.length == 0) {
  account.appendChild(textoSemMercadoriaCadastrada);
} 

/*  */
mercadorias = JSON.parse(localStorage.getItem("lista")) || [];          
mercadoriaFinal = JSON.parse(localStorage.getItem("listaFinal")) || [];     
// Método forEach() e o insertAdjacentHTML para persistir na tela os dados cadastrados
frame.insertAdjacentHTML("afterend", mercadoriaFinal);
mercadorias.forEach((mercadoria) => {
  frame.insertAdjacentHTML("afterend", mercadoria);
});
/*  */

/* 
Funções 
*/
// 1ª função chamada no "form onsubmit"
function validarSelect(event) {
  event.preventDefault();

  let nomeDaMercadoria2 = document.getElementById("tipo_mercadoria").value;
  let compraVendaSelect = document.getElementById("tipo-select").value;
  let valor2 = document.getElementById("tipo_valor").value;

  if (
    compraVendaSelect == undefined ||
    compraVendaSelect == null ||
    compraVendaSelect == "" ||
    nomeDaMercadoria2 == "" ||
    valor2 == ""
  ) {
    alert("Por favor, preencha todos os campos!");
    return false;
  } else {
    // Tira a mensagem da tela
    //document.querySelector(".novoTexto").style.display = "none";
    textoSemMercadoriaCadastrada.remove();

    // Chama a função principal
    botaoTransacao();
  }
}

function botaoTransacao() {
  // Converte a escolha do input "Compra e Venda" para o sinal "+" ou "-"
  let maisOuMenos = compraVenda.value;
  // "0" por causa deste HTML: <option id="compra" value="0">Compra</option>. Se teve compra, o sinal será negativo
  maisOuMenos == 0 ? (maisOuMenos = "-") : (maisOuMenos = "+");

  if (mercadorias) {
    // valorParseado refere-se ao 2º valor inserido
    valorParseado = valor.value;
    valorParseado = parseFloat(valorParseado.replace(",", "."));
    
    // Adiciona ao 2º array o sinal de "+" ou "-", e soma com o valor passado no input valor (já parseado)
    valoresAdicionados2.push(maisOuMenos + valorParseado);

    // Converte pra "number"
    // valoresAdicionados = valoresAdicionados.map(Number);
    valoresAdicionados2 = valoresAdicionados2.map(Number);
    
    // Junta os arrays já no tipo "number"
    spread = [...valoresAdicionados2];
    
    // Método reduce() para trazer a soma dos 2 arrays na variável "valorFinal"
    valorFinal = spread.reduce((total, individual) => total + individual);

    // Transforma o valor final em moeda brasileira
    valorToLocaleString = valorFinal.toFixed(2);
    Math.sign(valorFinal) == -1
      ? (valorToLocaleString = -valorToLocaleString)
      : valorToLocaleString;
    valorToLocaleString = parseFloat(valorToLocaleString).toLocaleString(
      "pt-BR",
      { minimumFractionDigits: 2, style: "currency", currency: "BRL" }
    );

    // Método para excluir a div.excluiLinhas
    let exclui = [...document.querySelectorAll(".excluiLinhas")];
    exclui.forEach((elemento) => elemento.remove());

    mercadoria = `
    <div class="primeiro">
        <p class="primeiro-sinal">${maisOuMenos}</p>
        <p class="primeiro-lorem">${nomeDaMercadoria.value}</p>      
        <p class="primeiro-valor">R$ ${valor.value}</p>
    </div>
    <hr class="hr-main4" />
    `;

    ultimasLinhas = `
  <div class="excluiLinhas">
    <hr class="hr-main5" />
    <div class="totais">
        <p class="total">Total</p>
        <p class="total-valor">${valorToLocaleString}</p>
    </div>
    <p id="lucro" class="lucro">${
      Math.sign(valorFinal) == -1 ? "[Despesa]" : "[Lucro]"
    }</p>
  </div> 
    `;

    // Métodos para inserir os códigos na DOM
    frame.insertAdjacentHTML("afterbegin", mercadoria);
    account.insertAdjacentHTML("beforeend", ultimasLinhas);

    // Zera os campos após o cadastro do produto:
    nomeDaMercadoria.value = "";
    valor.value = "";
    compraVenda.focus();
    console.log(valorToLocaleString);
  } else {
    // Analisa um argumento string e retorna um número de ponto flutuante. Depois faz o replace/troca da vírgula pra ponto.
    // Este é o 1º valor inserido na aplicação
    valorParseado1 = valor.value;
    valorParseado1 = parseFloat(valorParseado1.replace(",", "."));

    // Adiciona ao 1º array criado o sinal de "+" ou "-", e soma com o valor passado no input valor (já parseado)
    // valoresAdicionados.push(maisOuMenos + valorParseado1);
    // console.log(valoresAdicionados)

    // Transforma o 1º valor final em moeda brasileira
      valorToLocaleString = valorParseado1.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      style: "currency",
      currency: "BRL",
    });

    // Saber se a mensagem será "[Lucro]" ou "[Despesa]"
    maisOuMenos == "-"
      ? (lucroOuPrejuizo = "[Despesa]")
      : (lucroOuPrejuizo = "[Lucro]");

    mercadoria = `
    <div class="primeiro">
        <p class="primeiro-sinal">${maisOuMenos}</p>
        <p class="primeiro-lorem">${nomeDaMercadoria.value}</p>      
        <p class="primeiro-valor">R$ ${valor.value}</p>
    </div>

    <hr class="hr-main4" />
    `;

    ultimasLinhas = `
  <div class="excluiLinhas">
    <hr class="hr-main5" />
    <div class="totais">
        <p class="total">Total</p>
        <p class="total-valor">${valorToLocaleString}</p>
    </div>
    <p id="lucro" class="lucro">${lucroOuPrejuizo}</p>
  </div> 
    `;

    // Esta é a 1ª inserção de código na DOM
    frame.innerHTML += mercadoria + ultimasLinhas;

    // Zera os campos após o cadastro do produto
    nomeDaMercadoria.value = "";
    valor.value = "";
    compraVenda.focus();
    console.log(valorToLocaleString);
  }

  // Adição de cada "mercadoria" no array "mercadorias", que por sua vez será enviado para o localStorage via função setItem()
  mercadorias.push(mercadoria);

  mercadoriaFinal = ultimasLinhas;

  salvaNoLocalStorage();
  console.log(valorToLocaleString);
}

function salvaNoLocalStorage() {
  localStorage.setItem("lista", JSON.stringify(mercadorias));
  localStorage.setItem("listaFinal", JSON.stringify(mercadoriaFinal));
}

function limpaLocalStorage() {
  // Mensagem de confirmação antes da exclusão:
  let alertaSobreExclusao = confirm(
    "Deseja prosseguir em excluir todos os dados?"
  );

  // Limpa o localStorage e a DOM:
  if (alertaSobreExclusao) {
    localStorage.clear();
    accountUltimoFilhoFrame.remove();
    location.reload();
  } else {
    return false;
  }
  // Zera o campo e volta o focus:
  compraVenda.value = "";
}

// Código do blog "https://www.blogson.com.br/formatar-moeda-dinheiro-com-javascript-do-jeito-facil/":
function testaCampoValor() {
  let elemento = document.getElementById("tipo_valor");
  let valor = elemento.value;

  valor = parseInt(valor.replace(/[\D]+/g, ""));
  valor = valor + "";

  valor = valor.replace(/([0-9]{2})$/g, ",$1");

  //valor = valor.replace(/([0-9]{3}),([0-9]{2})$/g, ".$1,$2");

  elemento.value = valor;
  if (valor == "NaN") elemento.value = "";
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