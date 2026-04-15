const Filhote = require('../model/filhotesModel');
const Interessado = require('../model/interessadosModel');

class FilhotesCtrl {
	async gravar(requisicao, resposta) {
		if (requisicao.method !== 'POST' || !requisicao.is('application/json')) {
			return resposta.status(405).json({ status: false, mensagem: 'Metodo nao permitido.' });
		}

		const { id, especie, raca, id_interessado } = requisicao.body;
		if (!especie || !raca) {
			return resposta.status(400).json({
				status: false,
				mensagem: 'Informe especie e raca para cadastrar o filhote.',
			});
		}

		let interessadoVinculado = null;
		let idInteressadoNormalizado = null;
		if (id_interessado != null && id_interessado !== '') {
			idInteressadoNormalizado = Number(id_interessado);
			const interessadoModel = new Interessado();
			const interessadosConsulta = await interessadoModel.consultar(idInteressadoNormalizado);
			interessadoVinculado = Array.isArray(interessadosConsulta)
				? interessadosConsulta.find((item) => Number(item.id) === idInteressadoNormalizado)
				: null;
			if (!interessadoVinculado) {
				return resposta.status(400).json({
					status: false,
					mensagem: 'id_interessado invalido. Interessado nao encontrado.',
				});
			}
		}

		const filhote = new Filhote(
			id ? Number(id) : null,
			especie,
			raca,
			idInteressadoNormalizado
		);
		await filhote.gravar();
		filhote.interessado = interessadoVinculado;

		return resposta.status(201).json({
			status: true,
			mensagem: 'Filhote cadastrado com sucesso!',
			filhote: filhote.toJSON(),
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
		const { especie, raca, id_interessado } = requisicao.body;
		if (!id || !especie || !raca) {
			return resposta.status(400).json({
				status: false,
				mensagem: 'Informe id, especie e raca para atualizar.',
			});
		}

		const filhoteModel = new Filhote();
		const filhoteConsulta = await filhoteModel.consultar(id);
		if (!Array.isArray(filhoteConsulta) || !filhoteConsulta.length) {
			return resposta.status(404).json({ status: false, mensagem: 'Filhote nao encontrado.' });
		}

		let interessadoVinculado = null;
		let idInteressadoNormalizado = null;
		if (id_interessado != null && id_interessado !== '') {
			idInteressadoNormalizado = Number(id_interessado);
			const interessadoModel = new Interessado();
			const interessadosConsulta = await interessadoModel.consultar(idInteressadoNormalizado);
			interessadoVinculado = Array.isArray(interessadosConsulta)
				? interessadosConsulta.find((item) => Number(item.id) === idInteressadoNormalizado)
				: null;
			if (!interessadoVinculado) {
				return resposta.status(400).json({
					status: false,
					mensagem: 'id_interessado invalido. Interessado nao encontrado.',
				});
			}
		}

		const filhote = new Filhote(id, especie, raca, idInteressadoNormalizado);
		await filhote.editar();
		filhote.interessado = interessadoVinculado;

		return resposta.status(200).json({
			status: true,
			mensagem: 'Filhote atualizado com sucesso!',
			filhote: filhote.toJSON(),
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

		const filhoteModel = new Filhote();
		const filhoteConsulta = await filhoteModel.consultar(id);
		if (!Array.isArray(filhoteConsulta) || !filhoteConsulta.length) {
			return resposta.status(404).json({ status: false, mensagem: 'Filhote nao encontrado.' });
		}

		const filhote = new Filhote(id);
		await filhote.excluir();

		return resposta.status(200).json({
			status: true,
			mensagem: 'Filhote excluido com sucesso!',
		});
	}

	async consultar(requisicao, resposta) {
		if (requisicao.method !== 'GET') {
			return resposta.status(405).json({ status: false, mensagem: 'Metodo nao permitido.' });
		}

		const id = Number(requisicao.params.id || requisicao.query.id);
		const filhoteModel = new Filhote();

		if (id) {
			const registros = await filhoteModel.consultar(id);
			const registro = Array.isArray(registros)
				? registros.find((item) => Number(item.id) === id)
				: null;
			if (!registro) {
				return resposta.status(404).json({ status: false, mensagem: 'Filhote nao encontrado.' });
			}

			const filhote = new Filhote(
				registro.id,
				registro.especie,
				registro.raca,
				registro.id_interessado ?? null
			);
			const interessado = await filhote.consultarInteressado();
			filhote.interessado = Array.isArray(interessado) && interessado.length ? interessado[0] : null;

			return resposta.status(200).json({
				status: true,
				filhote: filhote.toJSON(),
			});
		}

		const registros = await filhoteModel.consultar();
		const filhotes = [];

		for (const item of registros || []) {
			const filhote = new Filhote(
				item.id,
				item.especie,
				item.raca,
				item.id_interessado ?? null
			);
			const interessado = await filhote.consultarInteressado();
			filhote.interessado = Array.isArray(interessado) && interessado.length ? interessado[0] : null;
			filhotes.push(filhote.toJSON());
		}

		return resposta.status(200).json({
			status: true,
			filhotes,
		});
	}
}

module.exports = FilhotesCtrl;
