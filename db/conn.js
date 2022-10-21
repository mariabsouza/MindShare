const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('heroku_67d20d733457b22', 'b4c854fdadcfcf', '7e90de98', {
  host: 'us-cdbr-east-06.cleardb.net',
  dialect: 'mysql'
})

try {
  sequelize.authenticate()
  console.log('Conectamos com sucesso')
} catch(err) {
  console.log(`Não foi possível conectar: ${err}`)
}

module.exports = sequelize