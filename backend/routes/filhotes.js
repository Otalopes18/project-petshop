const express = require('express');
const FilhotesCtrl = require('../control/filhotesCtrl');

const rotaFilhotes = express.Router();
const filhotesCtrl = new FilhotesCtrl();

rotaFilhotes.get('/', (req, res) => filhotesCtrl.consultar(req, res));
rotaFilhotes.post('/', (req, res) => filhotesCtrl.gravar(req, res));
rotaFilhotes.get('/:id', (req, res) => filhotesCtrl.consultar(req, res));
rotaFilhotes.put('/:id', (req, res) => filhotesCtrl.atualizar(req, res));
rotaFilhotes.patch('/:id', (req, res) => filhotesCtrl.atualizar(req, res));
rotaFilhotes.delete('/:id', (req, res) => filhotesCtrl.excluir(req, res));

module.exports = rotaFilhotes;
