import os
import json
from pprint import pprint

curpath = os.path.abspath(os.curdir)

filepath = os.path.join(curpath, '../../../public/assets/topic_models_small.json')
newfilepath = os.path.join(curpath, '../../../public/assets/data-totals-per-year.json')

try:
    data = []
    date_totals = {}
    with open(filepath) as data_file:
        for line in data_file:
            data.append(json.loads(line))
    clusters = data[0]['clusters']
    for key in clusters:
        single_topic = clusters[key]['data']
        for date in single_topic:
            total = single_topic[date][0]
            if date != 'total':
                if date in date_totals:
                    date_totals[date][0] += total
                else:
                    date_totals[date] = [total]

    with open(newfilepath, 'w') as outfile:
        json.dump(date_totals, outfile)

except IOError:
    print('error')
