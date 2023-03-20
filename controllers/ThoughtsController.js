const { raw } = require('express')
const Thought = require('../models/Thought')
const User = require('../models/User')
const Comment = require('../models/Comment')
const { all } = require('../routes/thoughtsRoutes')
const {Op} = require('sequelize')



module.exports = class ThoughtsController {



  static async showThoughts(req, res) {


    let search = ''
    let thoughtsQty = false

    //usamos o req.query porque quando a gent submete vai para a url
    if(req.query.search) {
      search = req.query.search
      thoughtsQty = true

    }

    //Para definir os pensamentos de mais novos para mais velhos como padrão
    let order = 'DESC'

    if(req.query.order === 'old'){
      order = 'ASC'
    } else {
      order = 'DESC'
    }
    
    const allThoughts = await Thought.findAll({
      //O include faz o join com Use
      include: User,
      where: {title: {[Op.like]: `%${search}%`}},
      order: [['createdAt', order]]
    })

    thoughtsQty = allThoughts.length
    console.log(thoughtsQty)
    


    //O map faz pegar apenas os dados, limpa os campos desnecessários
    //O "result.get({plain: true})" faz com que a gente pegue os dados como play e que todos eles sejam jogados no mesmo array



    const thoughts = allThoughts.map((result) => result.get({plain: true}))

    res.render('thoughts/home', {thoughts, search, thoughtsQty})

  }

  static async seeThought(req, res) {

    const thoughtId = req.params.id

    let thought = await Thought.findAll({
      where: {
        id: thoughtId
      },
      include: User,
    })

    let comments = await Comment.findAll({
      where: {
        ThoughtId: thoughtId
      },
      include: User
    })


    // const user = await thought.User.dataValues

    // comment = await comment.Comments[0].dataValues


    thought = thought.map((result) => result.get({plain: true}))[0]
    comments = comments.map((result) => result.get({plain: true}))

    res.render('thoughts/thought', {thought, comments})
  }

  static async addComment(req,res) {

    const text = req.body.comment
    const UserId = req.session.userId
    const ThoughtId = req.body.id

    const comment = {
      text,
      UserId,
      ThoughtId
    }

    try {
      await Comment.create(comment)
  
      req.flash('message', 'Comentário criado com sucesso')
  
      req.session.save(() => {
        res.redirect(`/thoughts/${ThoughtId}`)
      })
        
      } catch (error) {
        console.log(error)
      }
  }

  static async dashboard(req, res) {

    const userId = req.session.userId

    const user = await User.findOne({
      where: {
        id: userId
      },
      include: Thought,
      plain: true
    })

    //check if user exists
    if(!user) {
      res.redirect('/login')
    }



    //Limpar o resultado
    const thoughts = user.Thoughts.map((result) => result.dataValues)



    let emptyThoughts = false

    if(thoughts.length === 0) {
      emptyThoughts = true
    }

    res.render('thoughts/dashboard', { thoughts, emptyThoughts})

  }

  static createThought(req, res) {
    res.render('thoughts/create')
  }

  static async addThought(req, res) {
    
    const thought = {
      title: req.body.title,
      content: req.body.content.replace(/\r?\n/g, '<br>'),
      UserId: req.session.userId
    }

    
    try {
    await Thought.create(thought)

    req.flash('message', 'Pensamento criado com sucesso')

    req.session.save(() => {
      res.redirect('/thoughts/dashboard')
    })
      
    } catch (error) {
      console.log(error)
    }

  }

  static async editThought(req,res){

    const thoughtId = req.params.id

    const thought = await Thought.findOne({where: {id: thoughtId}, raw: true})

    thought.content = thought.content.replace(/<br\s*\/?>/ig, "\r\n")


    res.render('thoughts/edit', {thought})
  }
  

  static async updateThought (req, res) {
    const id = req.params.id

    const title = req.body.title
    const content = req.body.content.replace(/\r?\n/g, '<br>')

    await Thought.update({title : title, content: content}, { where: { id: id } })

    res.redirect('/thoughts/dashboard')
  }

  static async removeThought(req,res) {
    const id = req.body.id

    await Thought.destroy({where: {id : id}})

    res.redirect('/thoughts/dashboard')
  }

}