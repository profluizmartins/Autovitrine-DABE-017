const provider = (process.env.DB_PROVIDER || 'json').toLowerCase();

module.exports = provider === 'postgres'
  ? require('./postgres/CarroRepositoryPostgres')
  : require('./json/CarroRepositoryJson');