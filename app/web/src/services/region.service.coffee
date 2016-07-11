angular.module('ftlTopics')
.service 'regionService', ->
  obj =
    regions:
      new_england: false
      mountain: false
      west_north_central: false
      east_north_central: false
      east_south_central: false
      south_atlantic: false
      middle_atlantic: false
      pacific: false
    toggleRegion: (region) ->
      @regions[region] = !@regions[region]
