const mysql = require('mysql2/promise');

async function obterConexao() {
	if (!global.poolConexoes) {
		global.poolConexoes = mysql.createPool({
			host: process.env.DB_HOST || 'localhost',
			user: process.env.DB_USER || 'root',
			password: process.env.DB_PASSWORD || '123456',
			database: process.env.DB_NAME || 'projectpetshop',
			waitForConnections: true,
			connectionLimit: 10,
			maxIdle: 10,
			idleTimeout: 60000,
			queueLimit: 0,
			enableKeepAlive: true,
			keepAliveInitialDelay: 0,
		});
	}

	return global.poolConexoes.getConnection();
}

module.exports = obterConexao;
