// require("./landing");
// require("./collection");
// require("./album");
// require("./profile");

blocJams = angular.module('BlocJams', ['ui.router']);
blocJams.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('landing', {
    url: '/',
    controller: 'Landing.controller',
    templateUrl: '/templates/landing.html'
  });
  $stateProvider.state('collection', {
    url: '/collection',
    controller: 'Collection.controller',
    templateUrl: '/templates/collection.html'
  });
  $stateProvider.state('album', {
    url: '/album',
    controller: 'Album.controller',
    templateUrl: '/templates/album.html'
  });
}]);

var albumPicasso = {
  name: "The Colours",
  artist: "Pablo Picasso",
  label: "Cubism",
  year: "1881",
  albumArtUrl: "/images/album-placeholder.png",
  songs: [
      { name: "Blue", length: "4.26"},
      { name: "Green", length: "3.14"},
      { name: "Red", length: "5.01"},
      { name: "Pink", length: "3.21"},
      { name: "Magenta", length: "2.15"}
  ]
};

blocJams.controller('Landing.controller', ['$scope', function($scope) {
  $scope.subText = "Turn the music up!";
  $scope.subTextClicked = function() {
    $scope.subText += "!";
  };
}]);

blocJams.controller('Collection.controller', ['$scope','SongPlayer', function($scope, SongPlayer) {
  $scope.albums = [];
  for (var i = 0; i < 33; i++) {
    $scope.albums.push(angular.copy(albumPicasso));
  }

  $scope.playAlbum = function(album){
    SongPlayer.setSong(album, album.songs[0]); // Targets first song in the array.
  }
  $scope.header = "Bloc Jams";
  $scope.headerClicked = function shuffle(o) { //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  };

  $scope.albumURLs = [
    '/images/album-placeholders/album-1.jpg',
    '/images/album-placeholders/album-2.jpg',
    '/images/album-placeholders/album-3.jpg',
    '/images/album-placeholders/album-4.jpg',
    '/images/album-placeholders/album-5.jpg',
    '/images/album-placeholders/album-6.jpg',
    '/images/album-placeholders/album-7.jpg',
    '/images/album-placeholders/album-8.jpg',
    '/images/album-placeholders/album-9.jpg',
  ];
  }]);

blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
  $scope.songPlayer = SongPlayer;
}]);

blocJams.controller('Album.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer){
  $scope.album = angular.copy(albumPicasso);

  var hoveredSong = null;
  var playingSong = null;

  $scope.onHoverSong = function(song) {
    hoveredSong = song;
  };
  $scope.offHoverSong = function(song) {
    hoveredSong = null;
  };

  $scope.getSongState = function(song) {
    if (song === SongPlayer.currentSong && SongPlayer.playing) {
      return 'playing';
    }
    else if (song === hoveredSong) {
      return 'hovered';
    }
    return 'default';
  };

  $scope.playSong = function(song){
    SongPlayer.setSong($scope.album, song);
  };
  $scope.pauseSong = function(song){
    SongPlayer.pause();
  };
}]);

blocJams.directive('slider', function(){
  var updateSeekPercentage = function($seekBar, event) {
    var barWidth = $seekBar.width();
    var offsetX =  event.pageX - $seekBar.offset().left;

    var offsetXPercent = (offsetX  / $seekBar.width()) * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);

    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
  }

  return {
    restrict: 'E',
    templateUrl: '/templates/directives/slider.html',
    replace: true,
    link: function(scope, element, attributes) {
      var $seekBar = $(element);
      $seekBar.click(function(event) {
        updateSeekPercentage($seekBar, event);
      });

      $seekBar.find('.thumb').mousedown(function(event){
        $seekBar.addClass('no-animate');
        $(document).bind('mousemove.thumb', function(event){
          updateSeekPercentage($seekBar, event);
        });
        //cleanup
        $(document).bind('mouseup.thumb', function(){
          $seekBar.removeClass('no-animate');
          $(document).unbind('mousemove.thumb');
          $(document).unbind('mouseup.thumb');
        });
      });
    }
  };
});

blocJams.directive('clickMe', function() {
  return {
    restrict: 'EA',
    replace: true,
    template: '<button>Click Me!</button>',
    link: function(scope, elem, attrs) {
      console.log(scope, elem, attrs);
      $(elem).on('click', function() {
        alert('The clickMe directive has been triggered!');
      });
    }
  }
});

blocJams.directive('countHoverTime', function(){
  return{
    restrict: 'A',
    template: '<p>Hover Over Me</p>',
    link: function(scope, elem, attrs){
      $(elem).hover(
        function(){
          console.log('foo');
        }, function(){
          console.log('bar');
        }
      );
    }
  }
});

blocJams.service('SongPlayer', function() {
  var currentSoundFile = null;
  var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
  };
  return {
    currentSong: null,
    currentAlbum: null,
    playing: false,

    play: function() {
      this.playing = true;
      currentSoundFile.play();
    },
    pause: function() {
      this.playing = false;
      currentSoundFile.pause();
    },
    next: function() {
      var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
      currentTrackIndex++;
      if (currentTrackIndex >= this.currentAlbum.songs.length) {
        currentTrackIndex = 0;
      }
      this.currentSong = this.currentAlbum.songs[currentTrackIndex];
      var song = this.currentAlbum.songs[currentTrackIndex];
      this.setSong(this.currentAlbum, song);
    },
    previous: function() {
      var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
      currentTrackIndex--;
      if (currentTrackIndex < 0) {
        currentTrackIndex = this.currentAlbum.songs.length - 1;
      }
      var song = this.currentAlbum.songs[currentTrackIndex];
      this.setSong(this.currentAlbum, song);
      this.currentSong = this.currentAlbum.songs[currentTrackIndex];
    },
    setSong: function(album, song) {
      if (currentSoundFile) {
        currentSoundFile.stop();
      }
      this.currentAlbum = album;
      this.currentSong = song;
      currentSoundFile = new buzz.sound(song.audioUrl, {
        formats: [ "mp3" ],
        preload: true
      });
    this.play();
    }
  };
});


