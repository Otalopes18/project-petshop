const filhotesCatalogo = [
  {
    id: 1,
    nome: 'Luna',
    status: 'Disponivel',
    descricaoCurta: 'Femea caramelo, tranquila e muito sociavel.',
    idade: '8 semanas',
    porte: 'Pequeno',
    temperamento: 'Doce e curiosa',
    vacinas: 'V10 1a dose e vermifugacao em dia',
    peso: '2,8 kg',
    origem: 'Resgatada com 18 dias e socializada em lar temporario',
    rotina: 'Acorda cedo, cochila no periodo da tarde e adora brinquedos de corda',
    imagem: '/assets/images/dogs/luna.png',
  },
  {
    id: 2,
    nome: 'Thor',
    status: 'Reservado',
    descricaoCurta: 'Machinho preto e branco com energia moderada.',
    idade: '9 semanas',
    porte: 'Medio',
    temperamento: 'Brincalhao e atento',
    vacinas: 'V8 1a dose aplicada e reforco agendado',
    peso: '4,1 kg',
    origem: 'Ninhada supervisionada por veterinario parceiro',
    rotina: 'Gosta de passeios curtos, interacao com pessoas e treino de comandos basicos',
    imagem: '/assets/images/dogs/thor.png',
  },
  {
    id: 3,
    nome: 'Mel',
    status: 'Disponivel',
    descricaoCurta: 'Filhote pequena e observadora, ideal para familia.',
    idade: '7 semanas',
    porte: 'Pequeno',
    temperamento: 'Calma e carinhosa',
    vacinas: 'V10 1a dose aplicada',
    peso: '2,2 kg',
    origem: 'Acompanhada por lar temporario com criancas',
    rotina: 'Adora colo, adaptacao rapida e responde bem a reforco positivo',
    imagem: '/assets/images/dogs/mel.png',
  },
];

const detalheSelecionado = document.getElementById('detalheSelecionado');
const listaDetalhes = document.getElementById('listaDetalhes');
const ctaCadastro = document.getElementById('ctaCadastro');

function obterIdSelecionado() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('filhote'));
  return Number.isInteger(id) && id > 0 ? id : 1;
}

function badgeClasse(status) {
  const texto = status.toLowerCase();
  if (texto.includes('reservado')) {
    return 'status-badge reservado';
  }
  if (texto.includes('adotado')) {
    return 'status-badge adotado';
  }
  return 'status-badge disponivel';
}

function renderizarDestaque(filhote) {
  detalheSelecionado.innerHTML = `
    <span class="${badgeClasse(filhote.status)}">${filhote.status}</span>
    <h2>${filhote.nome}</h2>
    <p class="detail-copy">${filhote.descricaoCurta}</p>
    <div class="details-stats">
      <div class="details-stat"><span>Idade</span><strong>${filhote.idade}</strong></div>
      <div class="details-stat"><span>Porte</span><strong>${filhote.porte}</strong></div>
      <div class="details-stat"><span>Peso atual</span><strong>${filhote.peso}</strong></div>
      <div class="details-stat"><span>Vacinas</span><strong>${filhote.vacinas}</strong></div>
    </div>
    <div class="details-image-wrap">
      <img src="${filhote.imagem}" alt="Foto do filhote ${filhote.nome}">
    </div>
    <ul class="details-list">
      <li><strong>Historico:</strong> ${filhote.origem}</li>
      <li><strong>Rotina:</strong> ${filhote.rotina}</li>
      <li><strong>Perfil comportamental:</strong> ${filhote.temperamento}</li>
    </ul>
  `;

  ctaCadastro.href = `/cadastroCliente.html?filhote=${filhote.id}`;
}

function renderizarLista(filhotes, idSelecionado) {
  listaDetalhes.innerHTML = '';

  filhotes.forEach((filhote) => {
    const card = document.createElement('article');
    card.className = 'puppy-card';

    card.innerHTML = `
      <div class="puppy-visual" style="background-image: linear-gradient(140deg, rgba(47, 111, 109, 0.7), rgba(33, 79, 78, 0.75)), url('${filhote.imagem}'); background-size: cover; background-position: center;">
        <span>${filhote.status}</span>
        <h3>${filhote.nome}</h3>
        <p>${filhote.descricaoCurta}</p>
      </div>
      <div class="puppy-meta">
        <div><strong>Idade:</strong> ${filhote.idade}</div>
        <div><strong>Porte:</strong> ${filhote.porte}</div>
        <div><strong>Temperamento:</strong> ${filhote.temperamento}</div>
      </div>
      <div class="card-actions">
        <a href="/detalhes.html?filhote=${filhote.id}" class="btn-soft">Ver detalhes completos</a>
        <a href="/cadastroCliente.html?filhote=${filhote.id}" class="btn-primary">Entrar na fila</a>
      </div>
    `;

    if (filhote.id === idSelecionado) {
      card.style.outline = '2px solid rgba(47, 111, 109, 0.35)';
      card.style.outlineOffset = '2px';
    }

    listaDetalhes.appendChild(card);
  });
}

(function iniciarPaginaDetalhes() {
  const idSelecionado = obterIdSelecionado();
  const filhoteAtual = filhotesCatalogo.find((item) => item.id === idSelecionado) || filhotesCatalogo[0];

  renderizarDestaque(filhoteAtual);
  renderizarLista(filhotesCatalogo, filhoteAtual.id);
})();
