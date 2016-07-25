request         = require 'request'
config            = require '../../config'
route_endpoints =
  pages: 'pagesProcessed'
  cases: 'casesProcessed'
  volumes: 'volumesProcessed'
  metadata: 'metadataComplete'
  total_percent: 'percentComplete'
  metadata_change: 'metadataCompleteChange'
  pages_change: 'pagesProcessedChange'
  volumes_change: 'volumesProcessedChange'

exports.get_numbers = (req, res) ->
  requested_number = req.url.split('/progress/')[1]
  if config.keys.NODE_ENV is 'development'
    # if dev, send fake numbers
    res.status(200).send {
      name: requested_number
      total: parseInt(Math.random() * 100)
    }
  else
    url = "http://library.law.harvard.edu/projects/ftltracker/visualizationAPI/#{route_endpoints[requested_number]}"

    url = if requested_number.indexOf('change') > -1 then "#{url}/30" else url
    request.get url, (err, resp, body) ->
      if err
        res.status(500).send err
      else
        num = parseFloat body
        if num
          # errors sometimes coming through as responses
          data =
          res.status(200).send {
            name : requested_number
            total : num
          }
