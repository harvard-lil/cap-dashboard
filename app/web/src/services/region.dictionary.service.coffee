angular.module('CAPmodule')
.service "regionDictionaryService", ->
  regions =
    new_england : [
      'maine',
      'new_hampshire',
      'vermont',
      'massachusetts',
      'rhode_island',
      'connecticut'
    ]

    middle_atlantic : [
      'new_york',
      'pennsylvania',
      'new_jersey'
    ]

    east_north_central : [
      'wisconsin',
      'michigan',
      'illinois',
      'indiana',
      'ohio',
    ]
    west_north_central : [
      'north_dakota',
      'south_dakota',
      'nebraska',
      'kansas',
      'minnesota',
      'iowa',
      'missouri',
    ]

    south_atlantic : [
      'delaware',
      'maryland',
      'district_of_columbia',
      'virginia',
      'west_virginia',
      'north_carolina',
      'south_carolina',
      'georgia',
      'florida',
    ]
    east_south_central : [
      'kentucky',
      'tennessee',
      'mississippi',
      'alabama'
    ]

    west_south_central : [
      'oklahoma',
      'texas',
      'arkansas',
      'louisiana'
    ]

    mountain : [
      'idaho',
      'montana',
      'wyoming',
      'nevada',
      'utah',
      'colorado',
      'arizona',
      'new_mexico,'
    ]

    pacific : [
      'alaska',
      'washington',
      'oregon',
      'california',
      'hawaii'
    ]
  #
  # northeast = {
  #   'new_england': new_england,
  #   'middle_atlantic': middle_atlantic,
  # }
  #
  # west = {
  #   'mountain': mountain,
  #   'pacific': pacific,
  # }
  # south = {
  #   'south_atlantic': south_atlantic,
  #   'east_south_central': east_south_central,
  #   'west_south_central': west_south_central,
  # }
  #
  # midwest = {
  #   'east_north_central': east_north_central,
  #   'west_north_central': west_north_central,
  # }
  #
  # regions = {
  #   'northeast': northeast,
  #   'west': west,
  #   'south': south,
  #   'midwest': midwest,
  # }
  #
  return regions
