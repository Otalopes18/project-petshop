const endpointFilhotes = '/filhotes';
const endpointInteressados = '/interessados';

const formFilhote = document.getElementById('formFilhote');
const campoEspecie = document.getElementById('especie');
const campoRaca = document.getElementById('raca');
const selectInteressado = document.getElementById('interessadoVinculado');
const campoFilhoteEditandoId = document.getElementById('filhoteEditandoId');
const botaoSalvarFilhote = document.getElementById('btnSalvarFilhote');
const botaoCancelarFilhote = document.getElementById('btnCancelarFilhote');
const tabelaFilhotesCorpo = document.querySelector('#tabelaFilhotes tbody');
const mensagemFilhotes = document.getElementById('mensagemFilhotes');

const mapaInteressados = new Map();

function definirMensagem(texto, erro = false) {
  mensagemFilhotes.textContent = texto;
  mensagemFilhotes.style.color = erro ? '#b43434' : '';
}

function nomeInteressadoPorId(idInteressado) {
  if (!idInteressado) {
    return 'Nenhum';
  }

  const interessado = mapaInteressados.get(Number(idInteressado));
  if (!interessado) {
    return `#${idInteressado}`;
  }

  return interessado.nome;
}

async function carregarInteressadosSelect() {
  const resposta = await fetch(endpointInteressados);
  const dados = await resposta.json();

  if (!resposta.ok || !dados.status) {
    throw new Error(dados.mensagem || 'Falha ao carregar interessados.');
  }

  const interessados = dados.interessados || [];
  mapaInteressados.clear();
  selectInteressado.innerHTML = '<option value="">Nenhum interessado vinculado</option>';

  interessados.forEach((interessado) => {
    mapaInteressados.set(Number(interessado.id), interessado);
    const opcao = document.createElement('option');
    opcao.value = String(interessado.id);
    opcao.textContent = `${interessado.nome} (#${interessado.id})`;
    selectInteressado.appendChild(opcao);
  });
}

function renderizarLinhaFilhote(filhote) {
  const interessadoNome = nomeInteressadoPorId(filhote.id_interessado);
  const linha = document.createElement('tr');

  linha.innerHTML = `
    <td>${filhote.id}</td>
    <td>${filhote.especie}</td>
    <td>${filhote.raca}</td>
    <td>${interessadoNome}</td>
    <td class="inline-actions">
      <button type="button" class="btn-action" data-acao="editar" data-id="${filhote.id}">Editar</button>
      <button type="button" class="btn-action remove" data-acao="excluir" data-id="${filhote.id}">Excluir</button>
    </td>
  `;

  return linha;
}

async function carregarFilhotes() {
  const resposta = await fetch(endpointFilhotes);
  const dados = await resposta.json();

  if (!resposta.ok || !dados.status) {
    throw new Error(dados.mensagem || 'Falha ao carregar filhotes.');
  }

  const filhotes = dados.filhotes || [];
  tabelaFilhotesCorpo.innerHTML = '';

  if (!filhotes.length) {
    tabelaFilhotesCorpo.innerHTML = '<tr><td colspan="5" class="queue-empty">Nenhum filhote cadastrado.</td></tr>';
    return;
  }

  filhotes.forEach((filhote) => {
    tabelaFilhotesCorpo.appendChild(renderizarLinhaFilhote(filhote));
  });
}

function limparFormularioFilhote() {
  formFilhote.reset();
  campoFilhoteEditandoId.value = '';
  botaoSalvarFilhote.textContent = 'Registrar filhote';
  definirMensagem('');
}

function preencherFormularioFilhote(filhote) {
  campoEspecie.value = filhote.especie || '';
  campoRaca.value = filhote.raca || '';
  selectInteressado.value = filhote.id_interessado || '';
  campoFilhoteEditandoId.value = filhote.id;
  botaoSalvarFilhote.textContent = 'Salvar alteracoes';
  definirMensagem(`Editando filhote #${filhote.id}.`);
}

async function salvarFilhote(evento) {
  evento.preventDefault();

  const idEditando = campoFilhoteEditandoId.value;
  const payload = {
    especie: campoEspecie.value.trim(),
    raca: campoRaca.value.trim(),
    id_interessado: selectInteressado.value ? Number(selectInteressado.value) : null,
  };

  const metodo = idEditando ? 'PUT' : 'POST';
  const url = idEditando ? `${endpointFilhotes}/${idEditando}` : endpointFilhotes;

  const resposta = await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const dados = await resposta.json();

  if (!resposta.ok || !dados.status) {
    definirMensagem(dados.mensagem || 'Nao foi possivel salvar filhote.', true);
    return;
  }

  definirMensagem(dados.mensagem || 'Filhote salvo com sucesso.');
  limparFormularioFilhote();
  await carregarInteressadosSelect();
  await carregarFilhotes();
}

async function editarFilhote(id) {
  const resposta = await fetch(`${endpointFilhotes}/${id}`);
  const dados = await resposta.json();

  if (!resposta.ok || !dados.status || !dados.filhote) {
    definirMensagem(dados.mensagem || 'Falha ao carregar filhote para edicao.', true);
    return;
  }

  preencherFormularioFilhote(dados.filhote);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function excluirFilhote(id) {
  const confirmar = window.confirm(`Deseja realmente excluir o filhote #${id}?`);
  if (!confirmar) {
    return;
  }

  const resposta = await fetch(`${endpointFilhotes}/${id}`, { method: 'DELETE' });
  const dados = await resposta.json();

  if (!resposta.ok || !dados.status) {
    definirMensagem(dados.mensagem || 'Falha ao excluir filhote.', true);
    return;
  }

  definirMensagem(dados.mensagem || 'Filhote excluido com sucesso.');
  if (campoFilhoteEditandoId.value === String(id)) {
    limparFormularioFilhote();
  }
  await carregarInteressadosSelect();
  await carregarFilhotes();
}

tabelaFilhotesCorpo.addEventListener('click', async (evento) => {
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
    await editarFilhote(id);
    return;
  }

  if (acao === 'excluir') {
    await excluirFilhote(id);
  }
});

formFilhote.addEventListener('submit', salvarFilhote);
botaoCancelarFilhote.addEventListener('click', limparFormularioFilhote);

(async function iniciar() {
  try {
    await carregarInteressadosSelect();
    await carregarFilhotes();
  } catch (erro) {
    definirMensagem(erro.message || 'Erro ao inicializar tela de filhotes.', true);
  }
})();
