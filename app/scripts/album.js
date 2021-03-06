var albumMarconi = {
	name: "The Telephone",
	artist: "Guglielmo Marconi",
	label: "EM",
	year: "1989",
	albumArtUrl: "/images/album-placeholder.png",
	songs: [
			{ name: "Hello Operator", length: "1.26"},
			{ name: "Ring, ring, ring", length: "5.04"},
			{ name: "Fits in your pocket", length: "3.21"},
			{ name: "Can you hear me now?", length: "3.14"},
			{ name: "Wrong phone number", length: "2.15"}
	]
};
var albumArray = [albumPicasso, albumMarconi];
var currentlyPlayingSong = null;

var createSongRow = function(songNumber, songName, songLength) {
	var template =
		'<tr>'
	+	' <td class="song-number col-md-1" data-song-number="' + songNumber + '">' + songNumber + '<td>'
	+	' <td class="col-md-9">' + songName + '<td>'
	+	' <td class="col-md-2">' + songLength + '<td>'
	+ '<tr>'
	;
	var $row = $(template);

	var onHover = function(event) {
		var songNumberCell = $(this).find('.song-number');
		if (songNumber !== currentlyPlayingSong) {
			songNumberCell.html('<a class="album-song-button"><i class="fa fa-play"></i></a>');
		}
	};

	var offHover = function(event) {
		var songNumberCell = $(this).find('.song-number');
		if (songNumber !== currentlyPlayingSong) {
			songNumberCell.html(songNumber);
		}
	};

	var clickHandler = function(event) {
		var songNumber = $(this).data('song-number');

		if(currentlyPlayingSong !== null) {
			currentlyPlayingCell = $('.songNumber[data-song-number="' + currentlyPlayingSong + '"]');
			currentlyPlayingCell.html(currentlyPlayingSong);
		}

		if(currentlyPlayingSong !== songNumber) {
			$(this).html('<a class="album-song-button"><i class="fa fa-pause"></i></a>');
			currentlyPlayingSong = songNumber;
		} else if(currentlyPlayingSong == songNumber) {
			$(this).html('<a class="album-song-button"><i class="fa fa-play"></i></a>');
			currentlyPlayingSong = null;
		}
	}

	$row.find('.song-number').click(clickHandler);
	$row.hover(onHover, offHover);
	return $row;
};

var changeAlbumView = function(album) {
		var $albumTitle = $('.album-title');
		$albumTitle.text(album.name);
		var $albumArtist = $('.album-artist');
		$albumArtist.text(album.artist);
		var $albumMeta = $('.album-meta-info');
		$albumMeta.text(album.year + " on " + album.label);
		var $albumImage = $('.album-image img');
		$albumImage.attr('src', album.albumArtUrl);

		var $songList = $(".album-song-listing");
		$songList.empty();
		var songs = album.songs;
		for (var i = 0; i < songs.length; i++) {
			var songData = songs[i];
			var $newRow = createSongRow(i + 1, songData.name, songData.length);
			$songList.append($newRow);
		}
};

var updateSeekPercentage = function($seekBar, event) {
	var barWidth = $seekBar.width();
	var offsetX = event.pageX - $seekBar.offset().left;

	var offsetXPercent = (offsetX / barWidth) * 100;
	offsetXPercent = Math.max(0, offsetXPercent);
	offsetXPercent = Math.max(0, offsetXPercent);

var percentageString = offsetXPercent + '%';
$seekBar.find('.fill').width(percentageString);
$seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
	$seekBars = $('.player-bar .seek-bar');
	$seekBars.click(function() {
		updateSeekPercentage($(this), event);
	});

	$seekBars.find('.thumb').mousedown(function(event){
    var $seekBar = $(this).parent();
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
};

if (document.URL.match(/\/album.html/)) {
	$(document).ready(function() {
		changeAlbumView(albumPicasso);
		$(".album-image").click(function () {
			changeAlbumView(albumMarconi);
			setupSeekBars();
		});
	});
}