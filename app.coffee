express         = require 'express'
path            = require 'path'
app             = express()
bodyParser      = require 'body-parser'
fibrous         = require 'fibrous'
config          = require './config'
topic_routes    = require './app/api/topic_routes'
ngrams          = require './app/api/ngrams_routes'
progress_routes = require './app/api/progress_routes'
wordclouds = require './app/api/wordclouds_routes'
limericks = require './app/api/limericks_routes'
reqeustToken    = null

client = null

app.use express.static(path.join(__dirname, 'public'))
app.use fibrous.middleware

app.use bodyParser.urlencoded({ extended: false })
app.use bodyParser.json()
app.all '/*', (req, res, next) ->
  res.header 'Access-Control-Allow-Origin', '*'
  res.header 'Access-Control-Allow-Headers', 'Content-Type,X-Requested-With'
  next()

app.get '/topic/:topic', topic_routes.find_by_topic
app.get '/topics/list', topic_routes.list_topics
app.get '/topics/totals', topic_routes.get_totals
app.get '/topics', topic_routes.find_by_topics


app.get '/progress/*', progress_routes.get_numbers


app.get '/ngrams', ngrams.get_words


app.get '/wordclouds/list-states', wordclouds.list_states
app.get '/wordclouds/:state', wordclouds.get_state

app.get '/limerick/all', limericks.get_list
app.get '/limerick', limericks.get_random

port = process.env.PORT || 8001
server = app.listen port, ->
  console.log 'Example app listening to port', port
