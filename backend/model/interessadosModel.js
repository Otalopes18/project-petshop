const InteressadosDb = require('../DB/interessadosDb');

class Interessado {
	#id;
	#cpf;
	#nome;
	#telefone;
	#email;

	constructor(id = null, cpf = '', nome = '', telefone = '', email = '') {
		this.id = id;
		this.cpf = cpf;
		this.nome = nome;
		this.telefone = telefone;
		this.email = email;
	}

	get id() {
		return this.#id;
	}

	get cpf() {
		return this.#cpf;
	}

	get nome() {
		return this.#nome;
	}

	get telefone() {
		return this.#telefone;
	}

	get email() {
		return this.#email;
	}

	set id(novoId) {
		this.#id = novoId == null ? null : Number(novoId);
	}

	set cpf(novoCpf) {
		this.#cpf = novoCpf ?? '';
	}

	set nome(novoNome) {
		this.#nome = novoNome ?? '';
	}

	set telefone(novoTelefone) {
		this.#telefone = novoTelefone ?? '';
	}

	set email(novoEmail) {
		this.#email = novoEmail ?? '';
	}

	toString() {
		return `${this.#id} - ${this.#nome} (${this.#cpf})`;
	}

	async gravar() {
		const interessadosDb = new InteressadosDb();
		await interessadosDb.gravar(this);
	}

	async editar() {
		const interessadosDb = new InteressadosDb();
		await interessadosDb.editar(this);
	}

	async excluir() {
		const interessadosDb = new InteressadosDb();
		await interessadosDb.excluir(this);
	}

	async consultar(termo = '') {
		const interessadosDb = new InteressadosDb();
		return interessadosDb.consultar(termo);
	}

	toJSON() {
		return {
			id: this.#id,
			cpf: this.#cpf,
			nome: this.#nome,
			telefone: this.#telefone,
			email: this.#email,
		};
	}
}

module.exports = Interessado;
