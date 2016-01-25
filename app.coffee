express    = require 'express'
path       = require 'path'
app        = express()
bodyParser = require 'body-parser'

mongoose   = require 'mongoose'
fibrous    = require 'fibrous'
config     = require './config'
keys       = require './keys'
routes     = require './app/api/routes'
reqeustToken = null

client = null

mongoose.connect config.keys.MONGO_URL
app.use express.static(path.join(__dirname, 'public'))
app.use fibrous.middleware

app.use bodyParser.urlencoded({ extended: false })
app.use bodyParser.json()
app.all '/*', (req, res, next) ->
  res.header 'Access-Control-Allow-Origin', '*'
  res.header 'Access-Control-Allow-Headers', 'Content-Type,X-Requested-With'
  next()

app.get '/', (req, res) ->
  res.render 'index.html', { requestToken : request_token }

app.get '/topic/:topic', routes.findByTopic
app.get '/topics/list', routes.listTopics
app.get '/topics', routes.findByTopics

port = process.env.PORT || 8001
server = app.listen port, ->
  console.log 'Example app listening to port', port
