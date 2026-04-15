const Interessado = require('../model/interessadosModel');
const Filhote = require('../model/filhotesModel');

function somenteDigitos(valor = '') {
	return String(valor).replace(/\D/g, '');
}

function cpfValido(cpf) {
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

function telefoneValido(telefone) {
	const telefoneNumerico = somenteDigitos(telefone);
	return telefoneNumerico.length === 10 || telefoneNumerico.length === 11;
}

class InteressadosCtrl {
	async gravar(requisicao, resposta) {
		if (requisicao.method !== 'POST' || !requisicao.is('application/json')) {
			return resposta.status(405).json({ status: false, mensagem: 'Metodo nao permitido.' });
		}

		const { id, cpf, nome, telefone, email } = requisicao.body;
		if (!cpf || !nome || !telefone || !email) {
			return resposta.status(400).json({
				status: false,
				mensagem: 'Informe cpf, nome, telefone e email.',
			});
		}

		if (!cpfValido(cpf)) {
			return resposta.status(400).json({ status: false, mensagem: 'CPF invalido.' });
		}

		if (!telefoneValido(telefone)) {
			return resposta.status(400).json({
				status: false,
				mensagem: 'Telefone invalido. Use 10 ou 11 digitos.',
			});
		}

		const cpfNormalizado = somenteDigitos(cpf);
		const telefoneNormalizado = somenteDigitos(telefone);

		const interessado = new Interessado(
			id ? Number(id) : null,
			cpfNormalizado,
			nome,
			telefoneNormalizado,
			email
		);
		await interessado.gravar();

		return resposta.status(201).json({
			status: true,
			mensagem: 'Interessado cadastrado com sucesso!',
			interessado: interessado.toJSON(),
		});
	}

	async atualizar(requisicao, resposta) {
		if (
			(requisicao.method !== 'PUT' && requisicao.method !== 'PATCH') ||
			!requisicao.is('application/json')
		) {
			return resposta.status(405).json({ status: false, mensagem: 'Metodo nao permitido.' });
		}

		const id = Number(requisicao.params.id);
		const { cpf, nome, telefone, email } = requisicao.body;
		if (!id || !cpf || !nome || !telefone || !email) {
			return resposta.status(400).json({
				status: false,
				mensagem: 'Informe id, cpf, nome, telefone e email.',
			});
		}

		if (!cpfValido(cpf)) {
			return resposta.status(400).json({ status: false, mensagem: 'CPF invalido.' });
		}

		if (!telefoneValido(telefone)) {
			return resposta.status(400).json({
				status: false,
				mensagem: 'Telefone invalido. Use 10 ou 11 digitos.',
			});
		}

		const cpfNormalizado = somenteDigitos(cpf);
		const telefoneNormalizado = somenteDigitos(telefone);

		const interessadoModel = new Interessado();
		const interessadosConsulta = await interessadoModel.consultar(id);
		const interessadoExistente = Array.isArray(interessadosConsulta)
			? interessadosConsulta.find((item) => Number(item.id) === id)
			: null;
		if (!interessadoExistente) {
			return resposta.status(404).json({ status: false, mensagem: 'Interessado nao encontrado.' });
		}

		const interessado = new Interessado(id, cpfNormalizado, nome, telefoneNormalizado, email);
		await interessado.editar();

		return resposta.status(200).json({
			status: true,
			mensagem: 'Interessado atualizado com sucesso!',
			interessado: interessado.toJSON(),
		});
	}

	async excluir(requisicao, resposta) {
		if (requisicao.method !== 'DELETE') {
			return resposta.status(405).json({ status: false, mensagem: 'Metodo nao permitido.' });
		}

		const id = Number(requisicao.params.id);
		if (!id) {
			return resposta.status(400).json({ status: false, mensagem: 'Informe um id valido.' });
		}

		const interessadoModel = new Interessado();
		const interessadosConsulta = await interessadoModel.consultar(id);
		const interessadoExistente = Array.isArray(interessadosConsulta)
			? interessadosConsulta.find((item) => Number(item.id) === id)
			: null;
		if (!interessadoExistente) {
			return resposta.status(404).json({ status: false, mensagem: 'Interessado nao encontrado.' });
		}

		const filhoteModel = new Filhote();
		const filhotesVinculados = await filhoteModel.consultarPorInteressado(id);
		for (const item of filhotesVinculados || []) {
			const filhoteAtualizado = new Filhote(item.id, item.especie, item.raca, null);
			await filhoteAtualizado.editar();
		}

		const interessado = new Interessado(id);
		await interessado.excluir();

		return resposta.status(200).json({
			status: true,
			mensagem: 'Interessado excluido com sucesso!',
		});
	}

	async consultar(requisicao, resposta) {
		if (requisicao.method !== 'GET') {
			return resposta.status(405).json({ status: false, mensagem: 'Metodo nao permitido.' });
		}

		const id = Number(requisicao.params.id || requisicao.query.id);
		const interessadoModel = new Interessado();
		const filhoteModel = new Filhote();

		if (id) {
			const resultados = await interessadoModel.consultar(id);
			const interessadoRegistro = Array.isArray(resultados)
				? resultados.find((item) => Number(item.id) === id)
				: null;
			if (!interessadoRegistro) {
				return resposta.status(404).json({ status: false, mensagem: 'Interessado nao encontrado.' });
			}

			const interessado = new Interessado(
				interessadoRegistro.id,
				interessadoRegistro.cpf,
				interessadoRegistro.nome,
				interessadoRegistro.telefone,
				interessadoRegistro.email
			);
			const filhotes = await filhoteModel.consultarPorInteressado(id);

			return resposta.status(200).json({
				status: true,
				interessado: {
					...interessado.toJSON(),
					filhotes,
				},
			});
		}

		const registros = await interessadoModel.consultar();
		const lista = [];

		for (const item of registros || []) {
			const interessado = new Interessado(item.id, item.cpf, item.nome, item.telefone, item.email);
			const filhotes = await filhoteModel.consultarPorInteressado(item.id);
			lista.push({
				...interessado.toJSON(),
				filhotes,
			});
		}

		return resposta.status(200).json({
			status: true,
			interessados: lista,
		});
	}
}

module.exports = InteressadosCtrl;
