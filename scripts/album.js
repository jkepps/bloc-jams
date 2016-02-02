var createSongRow = function(songNumber, songName, songLength) {
	var template = 
			'<tr class="album-view-song-item">'
		+	'	<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
		+	'	<td class="song-item-title">' + songName + '</td>'
		+	'	<td class="song-item-duration">' + songLength+ '</td>'
		+	'</tr>'
		;
	var $row = $(template);
	
	var clickHandler = function() {
		var songNumber = parseInt($(this).attr('data-song-number'));
		
		if(currentlyPlayingSongNumber !== null) {																	// if there is a song currently playing
			var $currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
			$currentlyPlayingCell.html(currentlyPlayingSongNumber);  								// change the currently playing song's number cell back to it's track number
		}
		
		if(currentlyPlayingSongNumber !== songNumber) {    										// if the song clicked is not the one currently playing
			$(this).html(pauseButtonTemplate);																			// change the number cell to the pause button
			currentlyPlayingSongNumber = songNumber;														// update currently playing song variables
			currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
			updatePlayerBarSong();
		}
		else if(currentlyPlayingSongNumber === songNumber) {									// if the song clicked is the one currently playing
			$(this).html(playButtonTemplate);																				// change the number cell back to the play button
			$('.main-controls .play-pause').html(playerBarPlayButton);
			currentlyPlayingSongNumber = null;																			// and update the currently playing song variables to null
			currentSongFromAlbum = null;
		}
	};
	
	var onHover = function(event) {
		var $songNumberCell = $(this).find('.song-item-number');
		var songNumber = parseInt($songNumberCell.attr('data-song-number'));
			
		if(songNumber !== currentlyPlayingSongNumber) {
				$songNumberCell.html(playButtonTemplate);
			}
	};
	
	var offHover = function(event) {
		var $songNumberCell = $(this).find('.song-item-number');
		var songNumber = parseInt($songNumberCell.attr('data-song-number'));
		
		if(songNumber !== currentlyPlayingSongNumber) {
			$songNumberCell.html(songNumber);
		}
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
	
	$albumTitle.text(album.name);
	$albumArtist.text(album.artist);
	$albumReleaseInfo.text(album.year + ' ' + album.label);
	$albumImage.attr('src', album.albumArtUrl);
	
	$albumSongList.empty();
	
	for(var i=0; i<album.songs.length; i++) {
		var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
		$albumSongList.append($newRow);
	}
};

var trackIndex = function(album, song) {
	return album.songs.indexOf(song);
};

var updatePlayerBarSong = function() {
	$('.currently-playing .song-name').text(currentSongFromAlbum.name);
	$('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + ' - ' + currentAlbum.artist);
	$('.currently-playing .artist-name').text(currentAlbum.artist);
	$('.main-controls .play-pause').html(playerBarPauseButton);
};

var nextSong = function() {
	
	var getLastSongNumber = function(index) {
		return index==0 ? currentAlbum.songs.length : index;
	}
	
	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
	currentSongIndex === currentAlbum.songs.length - 1 ? currentSongIndex = 0 : currentSongIndex++;
	
	// Set new current song
	currentlyPlayingSongNumber = currentSongIndex + 1;
	currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
	
	// update player bar
	updatePlayerBarSong();
	
	var lastSongNumber = getLastSongNumber(currentSongIndex);
	var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
	var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
	
	$nextSongNumberCell.html(pauseButtonTemplate);
	$lastSongNumberCell.html(lastSongNumber);
}

var previousSong = function() {
	
	var getLastSongNumber = function(index) {
		return index==currentAlbum.songs.length - 1 ? 1 : index+2;
	};
	
	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
	currentSongIndex === 0 ? currentSongIndex = currentAlbum.songs.length - 1 : currentSongIndex--;
	
	// Set new current song
	currentlyPlayingSongNumber = currentSongIndex + 1;
	currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
	
	// update player bar
	updatePlayerBarSong();
	
	var lastSongNumber = getLastSongNumber(currentSongIndex);
	var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
	var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
	
	$previousSongNumberCell.html(pauseButtonTemplate);
	$lastSongNumberCell.html(lastSongNumber);
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>'

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
	setCurrentAlbum(albumPicasso);
	$nextButton.click(nextSong);
	$previousButton.click(previousSong);
});