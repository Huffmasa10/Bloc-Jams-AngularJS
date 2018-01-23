(function() {
  function SongPlayer($rootScope, Fixtures) {
    /**
    * @desc currentAlbum oject stores album info
    * @type {Object}
    */

    var SongPlayer = {};

    var currentAlbum = Fixtures.getAlbum();

    /**
    * @desc Current song object
    * @type {Object}
    */

    /**
    * @desc Buzz object audio file
    * @type {Object}
    */
    var currentBuzzObject = null;

    /**
    *@function stopSong
    *@desc stops playing selected song and sets playing property to null
    *@param {Object} song
    */
    var stopSong = function(song) {
      currentBuzzObject.stop();
      SongPlayer.currentSong.playing = null;
    };

    /**
    * @function setSong
    * @desc Stops currently playing song and loads new audio file as currentBuzzObject
    * @param {Object} song
    */
    var setSong = function(song) {
        if (currentBuzzObject) {
            stopSong();
          }

          currentBuzzObject = new buzz.sound(song.audioUrl, {
              formats: ["mp3"],
              preload: true
          });

          currentBuzzObject.bind('timeupdate', function() {
                  $rootScope.$apply(function() {
                      SongPlayer.currentTime = currentBuzzObject.getTime();
                  });
              });
        SongPlayer.currentSong = song;
    };

    /**
    * @function playSong
    * @desc Starts playing selected song and sets playing property to "true"
    * @param {Object} song
    */
    var playSong = function(song) {
      currentBuzzObject.play();
      song.playing = true;
    };

    /**
    *@function getSongIndex
    *@desc gets index number of current song
    *@param {Object} song
    *@return Index number of current song
    */
    var getSongIndex = function(song) {
      return currentAlbum.songs.indexOf(song);
    };

    /**
    *@desc Current song Object
    *@type {Object}
    */
    SongPlayer.currentSong = null;
    /**
    *@desc Current playback time (in seconds) of currently playing song
    *@type {Number}
    */
    SongPlayer.currentTime = null;

    /**
    * @function SongPlayer.play
    * @desc Plays selected song or paused song
    * @param {Object} song
    */
    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;
        if (SongPlayer.currentSong !== song) {
        setSong(song);
        playSong(song);
      } else if (SongPlayer.currentSong === song) {
        if(currentBuzzObject.isPaused()) {
          playSong(song);
        }
      }
    };

    /**
    * @function SongPlayer.pause
    * @desc Pauses selected song if playing and sets playing property to false
    * @param {Object} song
    */
    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    };

    /**
    *@function SongPlayer.previous
    *@desc plays previous song in songs array and stops playing of currentSongIndex is at 0
    */
    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;
      if(currentSongIndex < 0) {
          stopSong();
       } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
     };

     /**
     *@function SongPlayer.next
     *@desc plays next song in songs array, and stops playing if last song
     */
     SongPlayer.next = function() {
       var currentSongIndex = getSongIndex(SongPlayer.currentSong);
       currentSongIndex++;
       if(currentSongIndex > currentAlbum.songs.length - 1) {
          stopSong();
       } else {
         var newSong = currentAlbum.songs[currentSongIndex];
         setSong(newSong);
         playSong(newSong);
       }
     };
     /**
     *@function setCurrentTime
     *@desc Set current time (in seconds) of currently playing song
     *@param {Number} time
     */
     SongPlayer.setCurrentTime = function(time) {
         if(currentBuzzObject) {
           currentBuzzObject.setTime(time);
         }
     };


    return SongPlayer;
  }

  angular
    .module("blocJams")
    .factory("SongPlayer", ["$rootScope", "Fixtures", SongPlayer]);
  }) ();
