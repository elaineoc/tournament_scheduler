function ScheduleController($scope) {
  $scope.rounds = [];
  $scope.playerCount = 3;
  $scope.courtCount = 2;
  $scope.maxMatches = $scope.playerCount - 1;
  $scope.matchesPlayed = {};

  $scope.generate = function () {
    $scope.rounds = [];
    $scope.matchesPlayed = {};

    var players = getPlayers();
    var matchesRemaining = calculateAllCombinations(players);

    for (var round = 1; matchesRemaining.length > 0; round++) {
      var currentMatches = calculateCurrentMatches(matchesRemaining);
      matchesRemaining = compact(matchesRemaining);
      $scope.rounds.push(currentMatches);
    }
  }

  $scope.change = function () {
    $scope.maxMatches = $scope.playerCount - 1;
  }

  var getPlayers = function () {
    var players = [];

    for (var playerCount = 1; playerCount <= $scope.playerCount; playerCount++) {
      players.push(playerCount.toString());
    }

    return players;
  };

  var calculateAllCombinations = function (players) {
    var matchesRemaining = [];

    for (var playerIndex = 0; playerIndex < (players.length - 1); playerIndex++) {
      $scope.matchesPlayed[playerIndex + 1] = 0;
      for (var next = playerIndex + 1; next < players.length; next++) {
        matchesRemaining.push([players[playerIndex], players[next]]);
      }
    }

    //shuffle the array so all the last teams matches won't be grouped together the end
    return shuffleArray(matchesRemaining);
  };

  var calculateCurrentMatches = function (matchesRemaining) {
    var currentMatches = [];

    for (var matchesRemainingIndex = 0; currentMatches.length < $scope.courtCount && matchesRemainingIndex < matchesRemaining.length; matchesRemainingIndex++) {
      var nextMatch = matchesRemaining[matchesRemainingIndex];

      if (flatten(currentMatches).indexOf(nextMatch[0]) === -1 && flatten(currentMatches).indexOf(nextMatch[1]) === -1) {
        if ( !exceededMaxMatches(nextMatch[0]) && !exceededMaxMatches(nextMatch[1]) ) {
          currentMatches.push(nextMatch);
          $scope.matchesPlayed[nextMatch[0]]++;
          $scope.matchesPlayed[nextMatch[1]]++;
        }
        matchesRemaining[matchesRemainingIndex] = null
      }
    }
    return currentMatches;
  };

  var flatten = function (array) {
    return [].concat.apply([], array);
  };

  var compact = function (array) {
    var newArray = [];
    for (var i = 0; i < array.length; i++) {
      if (array[i] !== null) { newArray.push(array[i]); }
    }
    return newArray;
  };

  var shuffleArray = function (array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  var exceededMaxMatches = function (index) {
    return $scope.matchesPlayed[index] >= $scope.maxMatches
  };
}