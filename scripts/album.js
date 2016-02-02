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
			var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
			$currentlyPlayingCell.html(currentlyPlayingSongNumber);  								// change the currently playing song's number cell back to it's track number
		}
		
		if(currentlyPlayingSongNumber !== songNumber) {    										    // if the song clicked is not the one currently playing
			$(this).html(pauseButtonTemplate);																			// change the number cell to the pause button
			setSong(songNumber);																										// update the currently playing song variables
			updatePlayerBarSong();
		}
		else if(currentlyPlayingSongNumber === songNumber) {											// if the song clicked is the one currently playing
			$(this).html(playButtonTemplate);																				// change the number cell back to the play button
			$('.main-controls .play-pause').html(playerBarPlayButton);
			setSong(null);																													// and update the currently playing song variables to null
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

var changeSong = function() {
	var dir;
	if($(this).hasClass('previous')) { dir = 'prev'; }
	else if($(this).hasClass('next')) {	dir = 'next'; }
	
	var getLastSongNumber = function(index) {
		var lastSongNumber;
		if(dir==='next') { index==0 ? lastSongNumber = currentAlbum.songs.length : lastSongNumber = index; }
		else if(dir==='prev') { index==currentAlbum.songs.length - 1 ? lastSongNumber = 1 : lastSongNumber = index+2; }
		return lastSongNumber;
	};
	
	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
	if(dir==='next') { currentSongIndex === currentAlbum.songs.length - 1 ? currentSongIndex = 0 : currentSongIndex++; }
	else if(dir==='prev'){ currentSongIndex === 0 ? currentSongIndex = currentAlbum.songs.length - 1 : currentSongIndex--; }
	
	setSong(currentSongIndex+1);
	
	updatePlayerBarSong();
	
	var oldSongNumber = getLastSongNumber(currentSongIndex);
	var $newSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
	var $oldSongNumberCell = getSongNumberCell(oldSongNumber);
	
	$newSongNumberCell.html(pauseButtonTemplate);
	$oldSongNumberCell.html(oldSongNumber);
}

var setSong = function(songNumber) {
	currentlyPlayingSongNumber = songNumber;
	currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
}

var getSongNumberCell = function(number) {
	return $('.song-item-number[data-song-number="' + number + '"]');
}

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
	$nextButton.click(changeSong);
	$previousButton.click(changeSong);
});