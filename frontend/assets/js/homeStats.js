const totalFilhotesEl = document.getElementById('totalFilhotes');
const totalInteressadosEl = document.getElementById('totalInteressados');

function formatarQuantidade(valor) {
  const numero = Number(valor) || 0;
  return String(numero).padStart(2, '0');
}

async function buscarTotal(url, chaveLista) {
  const resposta = await fetch(url);
  const dados = await resposta.json();

  if (!resposta.ok || !dados.status || !Array.isArray(dados[chaveLista])) {
    throw new Error(`Falha ao consultar ${url}`);
  }

  return dados[chaveLista].length;
}

async function carregarIndicadores() {
  try {
    const [totalFilhotes, totalInteressados] = await Promise.all([
      buscarTotal('/filhotes', 'filhotes'),
      buscarTotal('/interessados', 'interessados'),
    ]);

    totalFilhotesEl.textContent = formatarQuantidade(totalFilhotes);
    totalInteressadosEl.textContent = formatarQuantidade(totalInteressados);
  } catch (_erro) {
    totalFilhotesEl.textContent = '--';
    totalInteressadosEl.textContent = '--';
  }
}

carregarIndicadores();
