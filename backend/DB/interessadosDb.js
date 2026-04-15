const obterConexao = require('./conexão');

class InteressadosDb {
	async gravar(entidadeInteressado) {
		let sql = '';
		let parametros = [];

		if (entidadeInteressado.id) {
			sql = `
				INSERT INTO interessados (id, cpf, nome, telefone, email)
				VALUES (?, ?, ?, ?, ?)
			`;
			parametros = [
				entidadeInteressado.id,
				entidadeInteressado.cpf,
				entidadeInteressado.nome,
				entidadeInteressado.telefone,
				entidadeInteressado.email,
			];
		} else {
			sql = `
				INSERT INTO interessados (cpf, nome, telefone, email)
				VALUES (?, ?, ?, ?)
			`;
			parametros = [
				entidadeInteressado.cpf,
				entidadeInteressado.nome,
				entidadeInteressado.telefone,
				entidadeInteressado.email,
			];
		}

		const conexao = await obterConexao();
		try {
			const [resultado] = await conexao.execute(sql, parametros);
			if (!entidadeInteressado.id) {
				entidadeInteressado.id = resultado.insertId;
			}
		} finally {
			conexao.release();
		}
	}

	async editar(entidadeInteressado) {
		const sql = `
			UPDATE interessados
			   SET cpf = ?, nome = ?, telefone = ?, email = ?
			 WHERE id = ?
		`;
		const parametros = [
			entidadeInteressado.cpf,
			entidadeInteressado.nome,
			entidadeInteressado.telefone,
			entidadeInteressado.email,
			entidadeInteressado.id,
		];

		const conexao = await obterConexao();
		try {
			await conexao.execute(sql, parametros);
		} finally {
			conexao.release();
		}
	}

	async excluir(entidadeInteressado) {
		const sql = 'DELETE FROM interessados WHERE id = ?';

		const conexao = await obterConexao();
		try {
			await conexao.execute(sql, [entidadeInteressado.id]);
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
					cpf,
					nome,
					telefone,
					email
				FROM interessados
				ORDER BY nome
			`;
		} else {
			sql = `
				SELECT
					id,
					cpf,
					nome,
					telefone,
					email
				FROM interessados
				WHERE id = ? OR cpf = ?
				ORDER BY nome
			`;
			parametros = [Number(termo), termo];
		}

		const conexao = await obterConexao();
		try {
			const [resultados] = await conexao.query(sql, parametros);
			return resultados;
		} finally {
			conexao.release();
		}
	}

}

module.exports = InteressadosDb;
