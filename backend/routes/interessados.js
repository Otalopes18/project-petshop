const express = require('express');
const InteressadosCtrl = require('../control/interessadosCtrl');

const rotaInteressados = express.Router();
const interessadosCtrl = new InteressadosCtrl();

rotaInteressados.get('/', (req, res) => interessadosCtrl.consultar(req, res));
rotaInteressados.post('/', (req, res) => interessadosCtrl.gravar(req, res));
rotaInteressados.get('/:id', (req, res) => interessadosCtrl.consultar(req, res));
rotaInteressados.put('/:id', (req, res) => interessadosCtrl.atualizar(req, res));
rotaInteressados.patch('/:id', (req, res) => interessadosCtrl.atualizar(req, res));
rotaInteressados.delete('/:id', (req, res) => interessadosCtrl.excluir(req, res));

module.exports = rotaInteressados;
