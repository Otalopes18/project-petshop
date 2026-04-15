const express = require('express');
const session = require('express-session');
const path = require('path');
const rotaFilhotes = require('./backend/routes/filhotes');
const rotaInteressados = require('./backend/routes/interessados');

const host = process.env.HOST || '0.0.0.0';
const porta = Number(process.env.PORT) || 3000;
const usuarioValido = 'admin';
const senhaValida = '123456';

const app = express();

const pastaFrontend = path.join(__dirname, 'frontend');
const pastaPublica = path.join(__dirname, 'frontend', 'public');
const pastaPrivada = path.join(__dirname, 'frontend', 'private');
const pastaAssets = path.join(__dirname, 'frontend', 'assets');

function enviarPaginaPrivada(res, nomeArquivo) {
    return res.sendFile(path.join(pastaPrivada, nomeArquivo));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'segredo-local-dev',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 30,
        },
    })
);

app.use('/assets', express.static(pastaAssets));
app.use(express.static(pastaPublica));
app.use('/frontend', express.static(pastaFrontend));

app.get('/', (req, res) => {
    res.sendFile(path.join(pastaFrontend, 'index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(pastaFrontend, 'index.html'));
});

app.get('/cadastro', (req, res) => {
    res.redirect('/cadastroCliente.html');
});

app.get('/cadastroCliente.html', (req, res) => {
    res.sendFile(path.join(pastaPublica, 'cadastroCliente.html'));
});

app.get('/cadastrofilhotes.html', (req, res) => {
    res.sendFile(path.join(pastaPublica, 'cadastrofilhotes.html'));
});

app.get('/detalhes', (req, res) => {
    res.redirect('/detalhes.html');
});

app.post('/login', (req, res) => {
    const { usuario, senha, imovel } = req.body;

    if (usuario !== usuarioValido || senha !== senhaValida) {
        return res.redirect('/cadastroCliente.html');
    }

    req.session.clienteLogado = true;
    req.session.usuario = usuario;

    if (imovel) {
        return res.redirect(`/detalhes.html?imovel=${encodeURIComponent(imovel)}`);
    }

    return res.redirect('/detalhes.html');
});

app.post('/loginInteressado', (req, res) => {
    const { cpf, email, filhote } = req.body;

    if (!cpf || !email) {
        return res.redirect('/cadastroCliente.html');
    }

    req.session.interessadoLogado = true;
    req.session.interessadoCpf = cpf;
    req.session.interessadoEmail = email;

    if (filhote) {
        return res.redirect(`/fila.html?filhote=${encodeURIComponent(filhote)}`);
    }

    return res.redirect('/fila.html');
});

app.get('/detalhes.html', (req, res) => {
    res.sendFile(path.join(pastaPublica, 'detalhes.html'));
});

app.get('/cadastroFilhote.html', (req, res) => {
    enviarPaginaPrivada(res, 'cadastroFilhote.html');
});

app.get('/fila.html', (req, res) => {
    enviarPaginaPrivada(res, 'Fila.html');
});

app.get('/edicaoImovel.html', (req, res) => {
    enviarPaginaPrivada(res, 'edicaoImovel.html');
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/cadastroCliente.html'));
});

app.get('/logoutInteressado', (req, res) => {
    req.session.destroy(() => res.redirect('/cadastroCliente.html'));
});

app.use('/filhotes', rotaFilhotes);
app.use('/interessados', rotaInteressados);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use((req, res) => {
    if ((req.headers.accept || '').includes('text/html')) {
        return res.redirect('/cadastroCliente.html');
    }

    return res.status(404).json({ mensagem: 'Rota nao encontrada.' });
});

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});
