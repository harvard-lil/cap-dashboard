angular.module('myApp', ['ui.router'])
.config ($stateProvider, $urlRouterProvider, $httpProvider) ->
  console.log "in config, woo"

  $stateProvider
    .state 'dashboard',
      template: """
      <div>HELLO</div>
      <div style="width:80%">
    		<div>
    			<canvas id="canvas" height="450" width="600"></canvas>
    		</div>
    	</div>
        """
      controller: ->
        console.log "HELLO dashboard"
        return
    # .state 'single-topic'
    # .state 'compare-topics'
  return
