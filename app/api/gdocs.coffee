GoogleSpreadsheet = require "google-spreadsheet"
name_doc          = new GoogleSpreadsheet '1qKZqYmQrvRkbAwbZkLGbM9hyejxRzcFtLZPVo3Z4F3Q'

topics_dictionary = {}

name_doc.getRows 1, (err, row_data) ->
  for key,data of row_data
    if data.orifthereisnoobvioustopicputanxhere == 'X'
      continue
    topic_name = data.casesinthegroupmightbeaboutthistopic
    if !topic_name
      tmp_arr    = data['ifagroupofcasestendstosharemanyofthesewordsincommonmoreimportantwordsfirst...']
      topic_name = tmp_arr.replace(/\, /, ' ').split(' ')[0]
    fixed = clean_topic_name topic_name
    topics_dictionary[fixed] = key

clean_topic_name = (topic) ->
  topic = topic.replace(/&|\//g, ' and ')
  return topic

exports.topics_dictionary = topics_dictionary
