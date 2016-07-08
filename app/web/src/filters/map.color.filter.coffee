angular.module('ftlTopics')
.filter 'mapcolor', ->
  return (input) ->
    b = 255 - Math.floor(input * 255);
    g = Math.floor(input * 255);
    return "rgba(255," + g + "," + b + ",1)";
