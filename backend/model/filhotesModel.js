const FilhotesDb = require('../DB/filhotesDb');

class Filhote {
	#id;
	#especie;
	#raca;
	#id_interessado;
	#interessado;

	constructor(id = null, especie = '', raca = '', id_interessado = null, interessado = null) {
		this.id = id;
		this.especie = especie;
		this.raca = raca;
		this.id_interessado = id_interessado;
		this.interessado = interessado;
	}

	get id() {
		return this.#id;
	}

	get especie() {
		return this.#especie;
	}

	get raca() {
		return this.#raca;
	}

	get id_interessado() {
		return this.#id_interessado;
	}

	get interessado() {
		return this.#interessado;
	}

	set id(novoId) {
		this.#id = novoId == null ? null : Number(novoId);
	}

	set especie(novaEspecie) {
		this.#especie = novaEspecie ?? '';
	}

	set raca(novaRaca) {
		this.#raca = novaRaca ?? '';
	}

	set id_interessado(novoIdInteressado) {
		this.#id_interessado = novoIdInteressado == null ? null : Number(novoIdInteressado);
	}

	set interessado(novoInteressado) {
		this.#interessado = novoInteressado || null;
	}

	toString() {
		return `${this.#id} - ${this.#especie} / ${this.#raca}`;
	}

	async gravar() {
		const filhotesDb = new FilhotesDb();
		await filhotesDb.gravar(this);
	}

	async editar() {
		const filhotesDb = new FilhotesDb();
		await filhotesDb.editar(this);
	}

	async excluir() {
		const filhotesDb = new FilhotesDb();
		await filhotesDb.excluir(this);
	}

	async consultar(termo = '') {
		const filhotesDb = new FilhotesDb();
		return filhotesDb.consultar(termo);
	}

	async consultarInteressado() {
		if (!this.#id_interessado) {
			return [];
		}
		const filhotesDb = new FilhotesDb();
		return filhotesDb.consultarInteressado(this.#id_interessado);
	}

	async consultarPorInteressado(idInteressado) {
		const filhotesDb = new FilhotesDb();
		return filhotesDb.consultarPorInteressado(idInteressado);
	}

	toJSON() {
		return {
			id: this.#id,
			especie: this.#especie,
			raca: this.#raca,
			id_interessado: this.#id_interessado,
			interessado: this.#interessado,
		};
	}
}

module.exports = Filhote;
