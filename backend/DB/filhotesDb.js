const obterConexao = require('./conexão');

class FilhotesDb {
	async gravar(entidadeFilhote) {
		let sql = '';
		let parametros = [];

		if (entidadeFilhote.id) {
			sql = `
				INSERT INTO filhotes (id, especie, raca, id_interessado)
				VALUES (?, ?, ?, ?)
			`;
			parametros = [
				entidadeFilhote.id,
				entidadeFilhote.especie,
				entidadeFilhote.raca,
				entidadeFilhote.id_interessado,
			];
		} else {
			sql = `
				INSERT INTO filhotes (especie, raca, id_interessado)
				VALUES (?, ?, ?)
			`;
			parametros = [
				entidadeFilhote.especie,
				entidadeFilhote.raca,
				entidadeFilhote.id_interessado,
			];
		}

		const conexao = await obterConexao();
		try {
			const [resultado] = await conexao.execute(sql, parametros);
			if (!entidadeFilhote.id) {
				entidadeFilhote.id = resultado.insertId;
			}
		} finally {
			conexao.release();
		}
	}

	async editar(entidadeFilhote) {
		const sql = `
			UPDATE filhotes
			   SET especie = ?, raca = ?, id_interessado = ?
			 WHERE id = ?
		`;
		const parametros = [
			entidadeFilhote.especie,
			entidadeFilhote.raca,
			entidadeFilhote.id_interessado,
			entidadeFilhote.id,
		];

		const conexao = await obterConexao();
		try {
			await conexao.execute(sql, parametros);
		} finally {
			conexao.release();
		}
	}

	async excluir(entidadeFilhote) {
		const sql = 'DELETE FROM filhotes WHERE id = ?';

		const conexao = await obterConexao();
		try {
			await conexao.execute(sql, [entidadeFilhote.id]);
		} finally {
			conexao.release();
		}
	}

	async consultar(termo = '') {
		let sql = '';
		let parametros = [];

		if (!termo && termo !== 0) {
			sql = `
				SELECT
					id,
					especie,
					raca,
					id_interessado
				FROM filhotes
				ORDER BY id
			`;
		} else {
			sql = `
				SELECT
					id,
					especie,
					raca,
					id_interessado
				FROM filhotes
				WHERE id = ?
			`;
			parametros = [Number(termo)];
		}

		const conexao = await obterConexao();
		try {
			const [resultados] = await conexao.query(sql, parametros);
			return resultados;
		} finally {
			conexao.release();
		}
	}

	async consultarInteressado(idInteressado) {
		const sql = `
			SELECT
				id,
				cpf,
				nome,
				telefone,
				email
			FROM interessados
			WHERE id = ?
			ORDER BY nome
		`;

		const conexao = await obterConexao();
		try {
			const [resultados] = await conexao.query(sql, [Number(idInteressado)]);
			return resultados;
		} finally {
			conexao.release();
		}
	}

	async consultarPorInteressado(idInteressado) {
		const sql = `
			SELECT
				id,
				especie,
				raca,
				id_interessado
			FROM filhotes
			WHERE id_interessado = ?
			ORDER BY id
		`;

		const conexao = await obterConexao();
		try {
			const [resultados] = await conexao.query(sql, [Number(idInteressado)]);
			return resultados;
		} finally {
			conexao.release();
		}
	}
}

module.exports = FilhotesDb;
