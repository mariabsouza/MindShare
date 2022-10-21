//É um middleware que checa se o usuário está logado, usado para quando há rotas protegidas
module.exports.checkAuth = function(req, res, next) {
  const userId = req.session.userId

  if(!userId) {
    res.redirect('/login')
  }

  next()
}