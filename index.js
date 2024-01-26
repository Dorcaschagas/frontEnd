const endereco = 'http://localhost:9840'

let lista = JSON.parse(localStorage.getItem('lista')) || [];
let primeiraMsg = true;
let tempo = 60000;

function sendMensagem() {
    primeiraMsg = false

    if (primeiraMsg) {
        tempo = 130000
    }
    let contato = $('#enviarPara').val()
    let msg = $('#mensagem').val()
    let data = $('#data').val()
    let hora = $('#hora').val()

    if (msg && data && hora && contato) {
        listAgenda(contato, msg, data, hora);
    } else {
        alert('Preencha Todos os Campos!');
    }
}

function limparMensagem() {
    $('#enviarPara').val('')
    $('#mensagem').val('')
    $('#data').val('')
    $('#hora').val('')
}

function listAgenda(contato, mensagem, data, hora) {
    if (mensagem) {
        lista.push([contato, mensagem, data, hora]);
        localStorage.setItem('lista', JSON.stringify(lista));
    }

    limparMensagem()
    addLista()
}
listAgenda()

function addLista() {

    $('#tabela').empty();

    if (lista.length < 1) {
        $('#tabela').append(`<tr class="text-center"><td colspan="7">Lista Vazia...</td></tr>`)
    }

    for (let i = 0; i < lista.length; i++) {
        $('#tabela').append(
            `<tr>
            <td class="mensagemCustom filtro-id">${i}</td>
            <td class="mensagemCustom filtro-grupo">${lista[i][0]}</td>
            <td class="mensagemCustom filtro-data">${lista[i][2]}</td>
            <td class="mensagemCustom filtro-hora">${lista[i][3]}</td>
            <td class="mensagemCustom filtro-msg">${lista[i][1]}</td>
            <td class="mensagemCustom border text-center" onclick="apagaItemDaLista(${i})"><i class="bi bi-trash"></i></td>
            <td class="mensagemCustom border text-center" onclick="editar(${i})"><i class="bi bi-pencil"></i></td>
        </tr>)`)
    }
}

function apagaItemDaLista(index) {
    let res = confirm("Deseja Excluir a Mensagem?")
    if (res) {
        lista.splice(index, 1);
        localStorage.setItem('lista', JSON.stringify(lista));
        addLista();
    }
}

function editar(index) {
    let contato
    let mensagem;
    let data;
    let hora;
    for (let i = 0; i < lista.length; i++) {
        contato = lista[index][0]
        mensagem = lista[index][1]
        data = lista[index][2]
        hora = lista[index][3]
    }
    $('#enviarPara').val(contato)
    $('#mensagem').val(mensagem)
    $('#data').val(data)
    $('#hora').val(hora)
    lista.splice(index, 1);
    localStorage.setItem('lista', JSON.stringify(lista));
    addLista();
}

function dataAtual() {
    let dataAtual = new Date();
    let dia = String(dataAtual.getDate()).padStart(2, '0');
    let mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    let ano = dataAtual.getFullYear();

    let dataFormatada = `${ano}-${mes}-${dia}`;
    let horaFormatada = `${String(dataAtual.getHours()).padStart(2, '0')}:${String(dataAtual.getMinutes()).padStart(2, '0')}`;

    checandoDatas(dataFormatada, horaFormatada)
}

dataAtual();

setInterval(dataAtual, tempo);

function checandoDatas(dataAtual, horaAtual) {
    for (let i = 0; i < lista.length; i++) {
        let contato = lista[i][0]
        let dataMsg = lista[i][2];
        let horamsg = lista[i][3];
        let msg = lista[i][1];


        if (horaAtual >= horamsg && dataAtual >= dataMsg) {
            var settings = {
                "url": endereco + "/enviaMensagem",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    'contato': contato,
                    "mensagem": msg,
                    "data": dataMsg,
                    "hora": horamsg,
                }),
            };

            $.ajax(settings).done(function (response) {
                console.log(response);
            });

            lista.splice(i, 1);
            localStorage.setItem('lista', JSON.stringify(lista));
            addLista();
            i--; // Ajuste para compensar a remoção do elemento
        }
    }
}

addLista();

$(".filtro").click(function () {
    $('.titleTable').toggleClass('d-none')
})

$("#id").click(function () {
    $('.filtro-id').toggleClass('d-none')
    $('.id .input i').toggleClass('d-none')
})

$("#grupo").click(function () {
    $('.filtro-grupo').toggleClass('d-none')
    $('.grupo .input i').toggleClass('d-none')

})

$("#table-data").click(function () {
    $('.filtro-data').toggleClass('d-none')
    $('.data .input i').toggleClass('d-none')

})

$("#table-hora").click(function () {
    $('.filtro-hora').toggleClass('d-none')
    $('.hora .input i').toggleClass('d-none')

})

$("#table-mensagem").click(function () {
    $('.filtro-msg').toggleClass('d-none')
    $('.mensagem .input i').toggleClass('d-none')
})

$(".limpar-filtor").click(function () {
    $('.input i').addClass('d-none')
    $('.filtro-id').removeClass('d-none')
    $('.filtro-grupo').removeClass('d-none')
    $('.filtro-data').removeClass('d-none')
    $('.filtro-hora').removeClass('d-none')
    $('.filtro-msg').removeClass('d-none')
})

$(".aplicar-filtro").click(function () {
    $('.titleTable').toggleClass('d-none')
})

function tamanhoTela() {
    var larguraTela = $(window).width()
    if (larguraTela <= 500) {
        $('.filtro-id').addClass('d-none')
        $('.id .input i').toggleClass('d-none')
    }

    if (larguraTela <= 400) {
        $('.filtro-grupo').addClass('d-none')
        $('.grupo .input i').toggleClass('d-none')
    }
}

$(window).resize(function () {
    tamanhoTela()
})

let click = false;
$('.listaFront').click(function () {
    click = !click;
    $(".caixaMensagem").toggleClass('d-none')
    if (click) {
        $(this).html('Voltar')
    } else {
        $(this).html('Lista')
    }
})

$('.listIcones li').click(function () {
    let conteudo = $(this).text().trim()
    let valorAtual = $("#enviarPara").val()
    $("#enviarPara").val(valorAtual + conteudo)
    // console.log($("#enviarPara").val())
})

// localStorage.clear("Contatos") 
var listaContatos = JSON.parse(localStorage.getItem("Contatos")) || [];

$('#historico').click(function () {
    $('#historico_Contato').removeClass('d-none')
    $('.corpoMensagem').addClass('d-none')
    historicoContatos()
})

$('.voltarCorpoMensagem').click(function () {
    $('#historico_Contato').addClass('d-none')
    $('.corpoMensagem').removeClass('d-none')
})

$('.salvaContato').click(function () {
    if ($('#enviarPara').val() !== "") {
        $('#historico_Contato').removeClass('d-none')
        $('.corpoMensagem').addClass('d-none')

        if (listaContatos.includes($('#enviarPara').val())) {
            alert("Este contato já está na lista.");
        } else {
            listaContatos.push($('#enviarPara').val());
    
            localStorage.setItem("Contatos", JSON.stringify(listaContatos));
    
            historicoContatos()
        }
    }
})

function historicoContatos() {
    $('#tabelaHistorico').empty();
    
    listaContatos.sort();

    for (let i = 0; i < listaContatos.length; i++) {
        $('#tabelaHistorico').append(
            `<tr>
                <td>${i + 1}</td>
                <td>${listaContatos[i]}</td>
                <td onclick="selecionarCtt('${listaContatos[i]}')"><button class="border">Selecionar</button></td>
                <td><button class="border" onclick="apagaContato(${i})"><i class="bi bi-trash"></i></button></td>
                <td class="mensagemCustom border text-center" onclick="editar(${i} , '${listaContatos[i]}')"><i class="bi bi-pencil"></i></td>
            </tr>`
        );
    }
}

function apagaContato(index) {
    var res = confirm('Quer apagar o contato?')
    if (res) {
        listaContatos.splice(index, 1);
        console.log(listaContatos)
        localStorage.setItem("Contatos", JSON.stringify(listaContatos));
        historicoContatos();
    }
}

function editar(index, nome) {
    listaContatos.splice(index, 1);
    localStorage.setItem("Contatos", JSON.stringify(listaContatos));
    $('#enviarPara').val(`${nome}`)
    $('#historico_Contato').addClass('d-none')
    $('.corpoMensagem').removeClass('d-none')
}

function selecionarCtt(nome){
    $('#enviarPara').val(`${nome}`)
    $('#historico_Contato').addClass('d-none')
    $('.corpoMensagem').removeClass('d-none')
}

$(".btnEmoji").click(function(){
    $(".emoji ").toggleClass('d-none')
})


$(".cxFuctions").click(function(){
    $(this).toggleClass('cxFuctionsAtivo')
    $(".iconeMais").toggleClass('d-none')
})

