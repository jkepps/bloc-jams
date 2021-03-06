var createSongRow = function(songNumber, songName, songLength) {
	var template = 
			'<tr class="album-view-song-item">'
		+	'	<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
		+	'	<td class="song-item-title">' + songName + '</td>'
		+	'	<td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
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
			currentSoundFile.play();
			updateSeekBarWhileSongPlays();
			updatePlayerBarSong();
			updateSeekPercentage($('.volume .seek-bar'), currentVolume/100);
		}
		else if(currentlyPlayingSongNumber === songNumber) {											// if the song clicked is the one currently playing
			if(currentSoundFile.isPaused()) {
				$(this).html(pauseButtonTemplate)
				$('.main-controls .play-pause').html(playerBarPauseButton);
				currentSoundFile.play();
				updateSeekBarWhileSongPlays();
				updateSeekPercentage($('.volume .seek-bar'), currentVolume/100);
			} else {
				$(this).html(playButtonTemplate);																				// change the number cell back to the play button
				$('.main-controls .play-pause').html(playerBarPlayButton);
				currentSoundFile.pause();
			}
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

var updateSeekBarWhileSongPlays = function() {
	if (currentSoundFile) {
		currentSoundFile.bind('timeupdate', function(event) {
			var seekBarFillRatio = this.getTime() / this.getDuration();
			var $seekBar = $('.seek-control .seek-bar');
			
			updateSeekPercentage($seekBar, seekBarFillRatio);
			setCurrentTimeInPlayerBar(this.getTime());
		});
	}
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
	var offsetXPercent = seekBarFillRatio * 100;
	offsetXPercent = Math.max(0, offsetXPercent);
	offsetXPercent = Math.min(100, offsetXPercent);
	
	var percentageString = offsetXPercent + '%';
	$seekBar.find('.fill').width(percentageString);
	$seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
	var $seekBars = $('.player-bar .seek-bar');
	
	$seekBars.click(function(event) {
		var offsetX = event.pageX - $(this).offset().left;
		var barWidth = $(this).width();
		var seekBarFillRatio = offsetX / barWidth;
		
		updateSeekPercentage($(this), seekBarFillRatio);
		$(this).parent().hasClass('seek-control') ? seek(seekBarFillRatio * currentSoundFile.getDuration()) : setVolume(seekBarFillRatio * 100);
	});
	
	$seekBars.find('.thumb').mousedown(function(event) {
		var $seekBar = $(this).parent();
		
		$(document).bind('mousemove.thumb', function(event) {
			var offsetX = event.pageX - $seekBar.offset().left;
			var barWidth = $seekBar.width();
			var seekBarFillRatio = offsetX / barWidth;
			
			updateSeekPercentage($seekBar, seekBarFillRatio);
			$seekBar.parent().hasClass('seek-control') ? seek(seekBarFillRatio * currentSoundFile.getDuration()) : setVolume(seekBarFillRatio * 100);
		});
		
		$(document).bind('mouseup.thumb', function() {
			$(document).unbind('mousemove.thumb');
			$(document).unbind('mouseup.thumb');
		});
	});
};

var trackIndex = function(album, song) {
	return album.songs.indexOf(song);
};

var updatePlayerBarSong = function() {
	$('.currently-playing .song-name').text(currentSongFromAlbum.name);
	$('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + ' - ' + currentAlbum.artist);
	$('.currently-playing .artist-name').text(currentAlbum.artist);
	$('.main-controls .play-pause').html(playerBarPauseButton);
	setTotalTimeInPlayerBar(currentSongFromAlbum.length);
};

var togglePlayFromPlayerBar = function() {
	var $currentSong = getSongNumberCell(currentlyPlayingSongNumber);
	if(currentSoundFile) {
		if(currentSoundFile.isPaused()) {
			$currentSong.html(pauseButtonTemplate);
			$(this).html(playerBarPauseButton);
			currentSoundFile.play();
		} else {
			$currentSong.html(playButtonTemplate);
			$(this).html(playerBarPlayButton);
			currentSoundFile.pause();
		}
	}
};

var nextSong = function() {
	
	var getLastSongNumber = function(index) {
		return index==0 ? currentAlbum.songs.length : index;
	}
	
	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
	currentSongIndex === currentAlbum.songs.length - 1 ? currentSongIndex = 0 : currentSongIndex++;
	
	// Set new current song
	setSong(currentSongIndex+1);
	
	// start playing new song
	currentSoundFile.play();
	updateSeekBarWhileSongPlays();
	
	// update player bar
	updatePlayerBarSong();
	
	var lastSongNumber = getLastSongNumber(currentSongIndex);
	var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
	var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
	
	$nextSongNumberCell.html(pauseButtonTemplate);
	$lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
	
	var getLastSongNumber = function(index) {
		return index==currentAlbum.songs.length - 1 ? 1 : index+2;
	};
	
	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
	currentSongIndex === 0 ? currentSongIndex = currentAlbum.songs.length - 1 : currentSongIndex--;
	
	// Set new current song
	setSong(currentSongIndex+1);
	
	// start playing new song
	currentSoundFile.play();
	updateSeekBarWhileSongPlays();
	
	// update player bar
	updatePlayerBarSong();
	
	var lastSongNumber = getLastSongNumber(currentSongIndex);
	var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
	var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
	
	$previousSongNumberCell.html(pauseButtonTemplate);
	$lastSongNumberCell.html(lastSongNumber);
};

var setSong = function(songNumber) {
	if(currentSoundFile) {
		currentSoundFile.stop();
	}
	currentlyPlayingSongNumber = parseInt(songNumber);
	currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
	currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
		formats: [ 'mp3' ],
		preload: true
	});
	
	setVolume(currentVolume);
};

var seek = function(time) {
	if (currentSoundFile) {
		currentSoundFile.setTime(time);
	}
}

var setVolume = function(volume) {
	if(currentSoundFile) {
		currentSoundFile.setVolume(volume);
	}
	currentVolume = volume;
};

var setCurrentTimeInPlayerBar = function(currentTime) {
	$('.current-time').text(filterTimeCode(currentTime));
};

var setTotalTimeInPlayerBar = function(totalTime) {
	$('.total-time').text(filterTimeCode(totalTime));
};

var filterTimeCode = function(timeInSeconds) {
	var seconds = Number.parseFloat(timeInSeconds);
	var wholeSeconds = Math.floor(seconds);
	var minutes = Math.floor(wholeSeconds / 60);
	var remainingSeconds = wholeSeconds % 60;
	var output;
	remainingSeconds < 10 ? output = minutes + ':0' + remainingSeconds : output = minutes + ':' + remainingSeconds;
	return output;
};

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
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $playButton = $('.main-controls .play-pause');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
	setCurrentAlbum(albumPicasso);
	setupSeekBars();
	$nextButton.click(nextSong);
	$previousButton.click(previousSong);
	$playButton.click(togglePlayFromPlayerBar);
});