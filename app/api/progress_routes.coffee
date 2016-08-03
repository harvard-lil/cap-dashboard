request = require 'request'
config = require '../../config'

parse_url = (requested_stat) ->
  if requested_stat is 'casesProcessed' and config.keys.ENV != 'development'
    return "#{config.keys.PROGRESS_API}#{requested_stat}"
  else
    return "#{config.keys.PROGRESS_STATS}#{requested_stat}"

exports.get_numbers = (req, res) ->
  requested_stat = req.url.split('/progress/')[1]

  url = parse_url(requested_stat)

  request.get url, (err, resp, body) ->
    if err
      res.status(500).send {err: err}
    else

      num = parseFloat body
      if num
        # errors sometimes coming through as responses
        res.status(200).send
          name : requested_stat
          total : num
      else
        res.status(500).send {data : 'oops'}
