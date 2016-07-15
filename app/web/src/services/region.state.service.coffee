angular.module('ftlTopics')
.service 'regionAndStateService', (regionDictionaryService) ->
  obj =
    states: []
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
    clearRegions: ->
      for key,val of @regions
        @regions[key] = false
    selectAll: false
    getListOfStates: ->
      # call this if selectAll is false
      return if @selectAll
      return @states if @states.length
      statesList = []
      for region,val in @regions
        if @regions[region]
          statesList.push regionDictionaryService.region
      return statesList

    clearAll: ->
      @clearRegions()
      @states = []
      @selectAll = false
