const {Sequelize} = require('sequelize')

const sequelize = new Sequelize(process.env.database, process.env.user, process.env.password, {
  host: process.env.host,
  dialect: 'mysql'
})

try {
  sequelize.authenticate()
  console.log('Conectamos com sucesso')
} catch(err) {
  console.log(`Não foi possível conectar: ${err}`)
}

module.exports = sequelize