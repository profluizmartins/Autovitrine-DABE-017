const provider = (process.env.DB_PROVIDER || 'json').toLowerCase();

module.exports = provider === 'postgres'
  ? require('./postgres/UsuarioRepositoryPostgres')
  : require('./json/UsuarioRepositoryJson');