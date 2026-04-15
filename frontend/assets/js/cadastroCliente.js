const endpointInteressados = '/interessados';

const formInteressado = document.getElementById('formInteressado');
const campoEditandoId = document.getElementById('interessadoEditandoId');
const botaoSalvar = document.getElementById('btnSalvarInteressado');
const botaoCancelar = document.getElementById('btnCancelarEdicao');
const tabelaCorpo = document.querySelector('#tabelaInteressados tbody');
const mensagem = document.getElementById('mensagemInteressados');

function definirMensagem(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.style.color = erro ? '#b43434' : '';
}

function somenteDigitos(valor = '') {
  return String(valor).replace(/\D/g, '');
}

function validarCpf(cpf) {
  const cpfNumerico = somenteDigitos(cpf);
  if (cpfNumerico.length !== 11 || /^(\d)\1{10}$/.test(cpfNumerico)) {
    return false;
  }

  let soma = 0;
  for (let i = 0; i < 9; i += 1) {
    soma += Number(cpfNumerico[i]) * (10 - i);
  }
  let digito = (soma * 10) % 11;
  if (digito === 10) {
    digito = 0;
  }
  if (digito !== Number(cpfNumerico[9])) {
    return false;
  }

  soma = 0;
  for (let i = 0; i < 10; i += 1) {
    soma += Number(cpfNumerico[i]) * (11 - i);
  }
  digito = (soma * 10) % 11;
  if (digito === 10) {
    digito = 0;
  }

  return digito === Number(cpfNumerico[10]);
}

function validarTelefone(telefone) {
  const telefoneNumerico = somenteDigitos(telefone);
  return telefoneNumerico.length === 10 || telefoneNumerico.length === 11;
}

function quantidadeFilhotes(interessado) {
  return Array.isArray(interessado.filhotes) ? interessado.filhotes.length : 0;
}

function renderizarLinhaInteressado(interessado) {
  const linha = document.createElement('tr');

  linha.innerHTML = `
    <td>${interessado.id}</td>
    <td>${interessado.nome}</td>
    <td>${interessado.cpf}</td>
    <td>${interessado.telefone}</td>
    <td>${interessado.email}</td>
    <td>${quantidadeFilhotes(interessado)}</td>
    <td class="inline-actions">
      <button type="button" class="btn-action" data-acao="editar" data-id="${interessado.id}">Editar</button>
      <button type="button" class="btn-action remove" data-acao="excluir" data-id="${interessado.id}">Excluir</button>
    </td>
  `;

  return linha;
}

async function carregarInteressados() {
  const resposta = await fetch(endpointInteressados);
  const dados = await resposta.json();

  if (!resposta.ok || !dados.status) {
    throw new Error(dados.mensagem || 'Falha ao carregar interessados.');
  }

  const interessados = dados.interessados || [];
  tabelaCorpo.innerHTML = '';

  if (!interessados.length) {
    tabelaCorpo.innerHTML = '<tr><td colspan="7" class="queue-empty">Nenhum interessado cadastrado.</td></tr>';
    return;
  }

  interessados.forEach((interessado) => {
    tabelaCorpo.appendChild(renderizarLinhaInteressado(interessado));
  });
}

function preencherFormulario(interessado) {
  document.getElementById('nome').value = interessado.nome || '';
  document.getElementById('telefone').value = interessado.telefone || '';
  document.getElementById('email').value = interessado.email || '';
  document.getElementById('cpf').value = interessado.cpf || '';
  document.getElementById('observacoes').value = '';
  document.getElementById('termo').checked = true;
  campoEditandoId.value = interessado.id;
  botaoSalvar.textContent = 'Salvar alteracoes';
  definirMensagem(`Editando interessado #${interessado.id}.`);
}

function limparFormulario() {
  formInteressado.reset();
  campoEditandoId.value = '';
  botaoSalvar.textContent = 'Registrar interessado';
  definirMensagem('');
}

async function salvarInteressado(evento) {
  evento.preventDefault();

  const idEditando = campoEditandoId.value;
  const cpfDigitado = document.getElementById('cpf').value.trim();
  const telefoneDigitado = document.getElementById('telefone').value.trim();

  if (!validarCpf(cpfDigitado)) {
    definirMensagem('CPF invalido. Informe um CPF valido com 11 digitos.', true);
    return;
  }

  if (!validarTelefone(telefoneDigitado)) {
    definirMensagem('Telefone invalido. Use DDD + numero (10 ou 11 digitos).', true);
    return;
  }

  const payload = {
    nome: document.getElementById('nome').value.trim(),
    cpf: somenteDigitos(cpfDigitado),
    telefone: somenteDigitos(telefoneDigitado),
    email: document.getElementById('email').value.trim(),
  };

  const metodo = idEditando ? 'PUT' : 'POST';
  const url = idEditando ? `${endpointInteressados}/${idEditando}` : endpointInteressados;

  const resposta = await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const dados = await resposta.json();

  if (!resposta.ok || !dados.status) {
    definirMensagem(dados.mensagem || 'Nao foi possivel salvar o interessado.', true);
    return;
  }

  definirMensagem(dados.mensagem || 'Interessado salvo com sucesso.');
  limparFormulario();
  await carregarInteressados();
}

async function excluirInteressado(id) {
  const confirmar = window.confirm(`Deseja realmente excluir o interessado #${id}?`);
  if (!confirmar) {
    return;
  }

  const resposta = await fetch(`${endpointInteressados}/${id}`, { method: 'DELETE' });
  const dados = await resposta.json();

  if (!resposta.ok || !dados.status) {
    definirMensagem(dados.mensagem || 'Falha ao excluir interessado.', true);
    return;
  }

  definirMensagem(dados.mensagem || 'Interessado excluido com sucesso.');
  if (campoEditandoId.value === String(id)) {
    limparFormulario();
  }
  await carregarInteressados();
}

async function editarInteressado(id) {
  const resposta = await fetch(`${endpointInteressados}/${id}`);
  const dados = await resposta.json();

  if (!resposta.ok || !dados.status || !dados.interessado) {
    definirMensagem(dados.mensagem || 'Falha ao carregar interessado para edicao.', true);
    return;
  }

  preencherFormulario(dados.interessado);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

tabelaCorpo.addEventListener('click', async (evento) => {
  const botao = evento.target.closest('button[data-acao]');
  if (!botao) {
    return;
  }

  const acao = botao.getAttribute('data-acao');
  const id = Number(botao.getAttribute('data-id'));
  if (!id) {
    return;
  }

  if (acao === 'editar') {
    await editarInteressado(id);
    return;
  }

  if (acao === 'excluir') {
    await excluirInteressado(id);
  }
});

formInteressado.addEventListener('submit', salvarInteressado);
botaoCancelar.addEventListener('click', limparFormulario);

document.getElementById('cpf').addEventListener('input', (evento) => {
  const numeros = somenteDigitos(evento.target.value).slice(0, 11);
  const formatado = numeros
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
  evento.target.value = formatado;
});

document.getElementById('telefone').addEventListener('input', (evento) => {
  const numeros = somenteDigitos(evento.target.value).slice(0, 11);
  let formatado = numeros;

  if (numeros.length > 10) {
    formatado = numeros.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
  } else if (numeros.length > 6) {
    formatado = numeros.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
  } else if (numeros.length > 2) {
    formatado = numeros.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
  }

  evento.target.value = formatado.trim();
});

(async function iniciarTela() {
  try {
    await carregarInteressados();
  } catch (erro) {
    definirMensagem(erro.message || 'Erro ao inicializar a tela.', true);
  }
})();
