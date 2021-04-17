// Elementos do DOM
var btLimparDados = document.getElementById('limpar-dados');
var hamburgerIcone = document.getElementById('menu-icone');
var fundoMenuLateral = document.getElementById('fundo-menu-lateral');
var iconeFecharMenuLateral = document.getElementById('icone-fechar');
var limparDadosLateral = document.getElementById('limpar-dados-lateral');
var tabelaTransacoes = document.getElementById('lista-transacoes');
var semTransacoes = document.getElementById('sem-transacoes');
var containerLinhasTrasacoes = document.getElementById('container-transacoes');
var btnAdd = document.getElementById('btn-add');
var resultadoTotal = document.getElementById('resultado-total');
var sentenca = document.getElementById('sentenca');
var novaTransacao = {
    tipo: document.getElementById('tipo'),
    mercadoria: document.getElementById('nome-mercadoria'),
    valor: document.getElementById('valor')
};
var transacoes = [];

btLimparDados.addEventListener('click', limparDados);
hamburgerIcone.addEventListener('click', abrirMenuLateral);
fundoMenuLateral.addEventListener('click', fecharMenuLateral);
iconeFecharMenuLateral.addEventListener('click', fecharMenuLateral);
limparDadosLateral.addEventListener('click', limparDados);
btnAdd.addEventListener('click', adicionarTransacao);
novaTransacao.tipo.addEventListener('change', validarTipo);
novaTransacao.mercadoria.addEventListener('keyup', validarMercadoria);
novaTransacao.valor.addEventListener('keyup', validarValor);
novaTransacao.valor.addEventListener('input', (e) => {
    e.target.value = mascaraValor(e.target.value);
});





function abrirMenuLateral() {
    fundoMenuLateral.classList.remove('esconder');

}
function fecharMenuLateral() {
    fundoMenuLateral.classList.add('esconder');



window.onload = () => {
    transacoes = buscarDadosLocalStorage();
    atualizarExtrato();
}


function formatarValorParaUsuario(valor) {
    return Math.abs(valor).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


function formatarValor(valor) {
    return parseFloat(valor.toString().replace('.', '').replace(',', '.'));


}




function validarTipo() {

    var validarTipo = document.getElementById('validar-tipo');
    var tipoTransacaoAtual = novaTransacao.tipo.value;

    if (tipoTransacaoAtual === '') {
        validarTipo.style.display = 'block';
        novaTransacao.tipo.style.border = '1px solid #ff182b';
        return false;
    } else {
        validarTipo.style.display = 'none';
        novaTransacao.tipo.style.border = '1px solid #808080';
        return true;
    }
}




function validarMercadoria() {
    var validarMercadoria = document.getElementById('validar-mercadoria');
    var mercadoriaTransacaoAtual = novaTransacao.mercadoria.value;

    if (mercadoriaTransacaoAtual === '') {
        validarMercadoria.style.display = 'block';
        novaTransacao.mercadoria.style.border = '1px solid #ff182b';
        return false;
    } else {
        validarMercadoria.style.display = 'none';
        novaTransacao.mercadoria.style.border = '1px solid #808080';
        return true;
    }
}


function validarValor() {
    var valorTransacaoAtual = novaTransacao.valor.value.toString().substr(3);
    var valorVazio = document.getElementById('valor-erro1');
    var valorIncompleto = document.getElementById('valor-erro2');


    if (valorTransacaoAtual === '') {
        valorVazio.style.display = 'block';
    } else {
        valorVazio.style.display = 'none';
    }
    if (valorTransacaoAtual.length > 0 && valorTransacaoAtual.length < 4) {
        valorIncompleto.style.display = 'block';
    } else {
        valorIncompleto.style.display = 'none';
    }
    if (valorVazio.style.display === 'none' &&
        valorIncompleto.style.display === 'none') {
        novaTransacao.valor.style.border = '1px solid #808080';
        return true;
    } else {
        novaTransacao.valor.style.border = '1px solid #ff182b';
        return false;
    }
}



function adicionarTransacao() {
    var validacaoTipo = validarTipo();
    var validacaoMercadoria = validarMercadoria();
    var validacaoValor = validarValor();


    if (validacaoTipo && validacaoMercadoria && validacaoValor) {
        var tipoTransacaoAtual = novaTransacao.tipo.value;
        var mercadoriaTransacaoAtual = novaTransacao.mercadoria.value;
        var valorTransacaoAtual = (tipoTransacaoAtual === 'venda')       
            ? formatarValor(novaTransacao.valor.value.substr(3))
            : 0 - formatarValor(novaTransacao.valor.value.substr(3));
        transacoes.push({
            tipo: tipoTransacaoAtual,
            mercadoria: mercadoriaTransacaoAtual,
            valor: valorTransacaoAtual
        });
        
        salvarDadosLocalStorage();
        atualizarExtrato();
        calcularTotal();
        limparCampos();
    }
}


function limparDados() {
    transacoes = [];
    salvarDadosLocalStorage();
    atualizarExtrato();
}


function criarLineTransacao(transacao) {
    var novaLinha = document.createElement('div');
    novaLinha.classList.add('line');
    novaLinha.innerHTML = `
        <div class='transacao'>
            <span class='sinal'>${transacao.tipo === 'venda' ? '+' : '-'}</span>
            <span>${transacao.mercadoria}</span>
        </div>
        <span>R$ ${formatarValorParaUsuario(transacao.valor)}</span>
    `;
    containerLinhasTrasacoes.append(novaLinha);
}


function atualizarExtrato() {
    if (transacoes.length != 0) {
        if ((novaTransacao.tipo.value === 'selecione') &&
            (novaTransacao.mercadoria.value === '') &&
            (novaTransacao.valor.value === '')) {
            for (let transacao of transacoes) {
                criarLineTransacao(transacao);
            }
        } else {
            var ultimaTransacao = transacoes[transacoes.length - 1];
            criarLineTransacao(ultimaTransacao);
        }
        semTransacoes.style.display = 'none';
        tabelaTransacoes.style.display = 'block';
    } else {
        containerLinhasTrasacoes.innerHTML = '';
        semTransacoes.style.display = 'block';
        tabelaTransacoes.style.display = 'none';
    }
}


function limparCampos() {
    novaTransacao.tipo.value = 'selecione';
    novaTransacao.mercadoria.value = '';
    novaTransacao.valor.value = '';
}


function calcularTotal() {
    let total = 0;
    for (transacao of transacoes) {
        total += transacao.valor;
    }
    resultadoTotal.innerText = 'R$ ' + formatarValorParaUsuario(total);
    sentenca.innerText = (total >= 0) ? '[LUCRO]' : '[PREJUÍZO]';
}


function salvarDadosLocalStorage() {
    if (transacoes.length === 0) {
        localStorage.setItem('transacoesNC', '');
    } else {
        localStorage.setItem('transacoesNC', JSON.stringify(transacoes));
    }
}
function buscarDadosLocalStorage()  {
    let dados;
    if ((localStorage.getItem('transacoesNC') != null) &&
        (localStorage.getItem('transacoesNC') != '')) {
        dados = JSON.parse(localStorage.getItem('transacoesNC'));
    } else {
        dados = [];
    }
    return dados;
}



// Máscara valor contábil
function mascaraValor(valorCampo) {
    valorCampo = valorCampo.toString().replace(/\D/g, '');
    valorCampo = parseInt(valorCampo.replace(/[.,]/g, '')).toString();
    let valorFormatado = '';
    if (valorCampo === '0' || valorCampo === 'NaN') {
        valorFormatado = '';
    } else if (valorCampo.length === 1) {
        valorFormatado += '00' + valorCampo;
    } else if (valorCampo.length === 2) {
        valorFormatado += '0' + valorCampo;
    } else {
        valorFormatado = valorCampo;
    }
    if (valorFormatado.length > 0) {
        var doisUltimos = valorFormatado.substr(-2);
        var resto = valorFormatado.substr(0, valorFormatado.length - 2);
        valorFormatado = resto + ',' + doisUltimos;
        if (valorFormatado.length >= 7) {
            var ultimosSeis = valorFormatado.substr(-6);
            var resto = valorFormatado.substr(0, valorFormatado.length - 6);
            valorFormatado = resto + '.' + ultimosSeis;
        }
        valorFormatado = 'R$ ' + valorFormatado;
    }
    return valorFormatado;
}

/*  NÃO CONSEGUI TERMINAR, SÓ ESTAVA FUNCIONANDO COM O LOCALSTORAGE MAS ACABEI ESTRAGANDO E NÃO TEM TEMPO PARA ARRUMAR!!

var aluno = "2004"

function salvaServidor(){

    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico",{
        headers: {
            Authorization: "Bearer key2CwkHb0CKumjuM"
        }
    })
    .then(response => response.json())
    .then(responseJson => {
        existe = responseJson.records.filter((record) => {
            if (aluno == record.fields.Aluno) {
                return true
            }

            return false
        })

        if (existe.length == 0) {
            insereDados()
        } else {
            alteraDados(existe[0].id)
        }

    })

}

function insereDados() {
    var json = JSON.stringify(transacoes)

    var body = JSON.stringify ({
        "records": [
          {
            "fields": {
            "Aluno": aluno,
            "Json": json
            }
          }
        ]
      })

    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
        method: "POST",
        headers: {
            Authorization: "Bearer key2CwkHb0CKumjuM",
            "Content-Type" : "application/json"
        },
        body:body
    })
}

function alteraDados(id) {
    var json = JSON.stringify(transacoes)

    var body = JSON.stringify ({
        "records": [
          {
            "id": id,
            "fields": {
            "Aluno": aluno,
            "Json": json
            }
          }
        ]
      })

    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
        method: "PATCH",
        headers: {
            Authorization: "Bearer key2CwkHb0CKumjuM",
            "Content-Type" : "application/json"
        },
        body:body
    })
}

function pullAirTable (){
    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico",{
        headers: {
            Authorization: "Bearer key2CwkHb0CKumjuM"
        }
    })
    .then(response => response.json())
    .then(responseJson => {
        existe = responseJson.records.filter((record) => {
            if (aluno == record.fields.Aluno) {
                return true
            }

            return false
        })

        if (existe.length == 0) {
            transacoes = []
        } else {
            transacoes = JSON.parse(existe[0].fields.Json)
        }

        adicionarTransacao()

    })
}*/