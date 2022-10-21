const User = require('../models/User')

const bcrypt = require('bcryptjs')
const session = require('express-session')

module.exports = class AuthController {
  static login(req, res) {
    res.render('auth/login')
  }

  static async loginPost(req, res) {
    const { email, password } = req.body

    //find user
    const user = await User.findOne({ where: { email: email } })

    if (!user) {
      req.flash('message', 'Usuário não encontrado')
      res.render('auth/login')

      return
    }


    // compare password
    const passwordMatch = bcrypt.compareSync(password, user.password)

    if (!passwordMatch) {
      res.render('auth/login', {
        message: 'Senha inválida!'
      })

      return
    }

    // auth user
    req.session.userId = user.id

    req.flash('message', 'Login realizado com sucesso!')

    req.session.save(() => {
      res.redirect('/')
    })
  }

  static register(req, res) {
    res.render('auth/register')
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body

    //password match validation
    if (password != confirmpassword) {
      req.flash('message', 'As senhas não conferem, tente novamente!')
      res.render('auth/register')

      return
    }

    //Check if user exists

    const checkIfUserExists = await User.findOne({ where: { email: email } })

    if (checkIfUserExists) {
      req.flash('message', 'O e-mail já está em uso!')
      res.render('auth/register')

      return
    }

    //create a password
    //O salt complica ainda mais a criptografia da senha
    const salt = bcrypt.genSaltSync(10)

    //Depois, a gente gera um hash em cima da o salt e criptografa a senha
    const hashedPassword = bcrypt.hashSync(password, salt)

    //Mandar o usuário para o banco de dados
    const user = {
      name,
      email,
      password: hashedPassword
    }

    try {
      const createdUser = await User.create(user)

      //Initialize session
      req.session.userId = createdUser.id

      // console.log( req.session.userId)

      req.flash('message', 'Cadastro realizado com sucesso!')

      req.session.save(() => {
        res.redirect('/')
      })

      // console.log(session.userId)
      // console.log(req.session, "\n\n\n")
    } catch (error) {
      console.log(error)
    }
  }

  static logout(req, res) {
    req.session.destroy()
    res.redirect('/login')
  }
}
