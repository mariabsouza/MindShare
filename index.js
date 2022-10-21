const express = require('express')
const exphbs = require('express-handlebars')
const cookieParser = require("cookie-parser");
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()

const conn = require('./db/conn')

//Models
const Thought = require('./models/Thought')
const User = require('./models/User')
const Comment = require('./models/Comment')

//Import Routes
const thoughtsRoutes = require('./routes/thoughtsRoutes')
const authRoutes = require('./routes/authRoutes')

//Import controller
const ThoughtsController = require('./controllers/ThoughtsController')

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())

//session middleware
const oneDay = 1000 * 60 * 60 * 24;

app.use(
  session({
    name: 'session',
    secret: 'nosso_secret',
    resave: false,
    saveUninitialized: true,
    store: new FileStore({
      logFn:function() {},
      path: require('path').join(require('os').tmpdir(), 'sessions')
    }),
    cookie: {
      secure: false,
      maxAge: oneDay,
      httpOnly: true
    }
  })
  )
  
app.use(cookieParser());
//flash messages
app.use(flash())

//public
app.use(express.static('public'))

//set session to res
app.use((req, res, next) => {
  if(req.session.userId) {
    res.locals.session = req.session
  }

  next()
})

//Routes
app.use('/thoughts', thoughtsRoutes)
app.use('/', authRoutes)


app.get('/', ThoughtsController.showThoughts)

conn.sync().then(() => {
  // app.listen(3000)
  process.env.PORT
}).catch((err) => console.log(err))