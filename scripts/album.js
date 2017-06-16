var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
      + ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + ' <td class="song-item-title">' + songName + '</td>'
      + ' <td class="song-item-duration">' + songLength + '</td>'
      + ' </tr>'
      ;

      var $row = $(template);

      var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));

        if (currentlyPlayingSongNumber !== null) {
          // Revert to song number for currently playing song
          var currentlyPlayingCell = parseInt($('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]'));
          currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber !== songNumber) {
              // Switch from Play -> Pause button to indicate new song is playing
          $(this).html(pauseButtonTemplate);
          currentlyPlayingSongNumber = songNumber;
          currentSongFromAlbum = currentAlbum.songs[songNumber -1];
          updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber) === songNumber {
              // Switch from Pause -> Play button to indicate new song is playing
          $(this).html(playButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPlayButton);
          currentlyPlayingSongNumber = null;
          currentSongFromAlbum = null;
        }
      };

      var onHover = function(event) {
        var songNumberCell = parseInt($(this).find('.song-item-number'));
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
          songNumberCell.html(playButtonTemplate);
        }
      };

      var offHover = function(event) {
        var songNumberCell = parseInt($(this).find('song-item-number'));
        var songNumber = parseInt(songNumberCell.attr('.data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
          songNumberCell.html(songNumber);
        }
        console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
      };

      $row.find('.song-item-number').click(clickHandler);
      $row.hover(onHover, offHover);
      return $row;
};

var setCurrentAlbum = function(album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    $albumSongList.empty();

    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);

    $('.main-controls .play-pause').html(playerBarPauseButton);
};

var nextSong = function() {
    // 1
    var getLastSongNumber = parseInt(function(index)) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    //2
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    //3
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    //4
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.name);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    //5
    var lastSongNumber = parseInt(getLastSongNumber(currentSongIndex));
    var $nextSongNumberCell = parseInt($('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]'));
    var $lastSongNumberCell = parseInt($('.song-item-number[data-song-number="' + lastSongNumber + '"]'));

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
    // decrementing the index

    if (currentSongIndex < 0) {
      currentSongIndex =currentAlbum.songs.length -1;
    }

    // Save the last song number before changing it
    var lastSongNumber = parseInt(currentlyPlayingSongNumber);

    // Set a new current song
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar Information
    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = parseInt($('.song-item-number[data-song-number="' + lastSongNumber + '"]'));
    var $lastSongNumberCell = parseInt($('.song-item-number[data-song-number="' + lastSongNumber + '"]'));

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = parseInt(null);
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});
