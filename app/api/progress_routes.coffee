exports.get_numbers = (req, res) ->
  requested_number = req.url.split('/progress/')[1]

  data =
    name : requested_number
    total : Math.random() * 100
  res.status(200).send data
