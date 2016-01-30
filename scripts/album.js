var albumPicasso = {
	name: 'The Colors',
	artist: 'Pablo Picasso',
	label: 'Cubism',
	year: '1881',
	albumArtUrl: 'assets/images/album_covers/01.png',
	songs: [
		{ name: 'Blue', length: '4:26' },
		{ name: 'Green', length: '3:14' },
		{ name: 'Red', length: '5:01' },
		{ name: 'Pink', length: '3:21' },
		{ name: 'Magenta', length: '2:15' }
	]
};

var albumMarconi = {
	name: 'The Telephone',
	artist: 'Guglielmo Marconi',
	label: 'EM',
	year: '1909',
	albumArtUrl: 'assets/images/album_covers/02.png',
	songs: [
		{ name: 'Hello, Operator?', length: '1:01' },
		{ name: 'Ring, ring, ring', length: '5:01' },
		{ name: 'Fits in your pocket', length: '3:21' },
		{ name: 'Can you hear me now?', length: '3:14' },
		{ name: 'Wong phone number', length: '2:15' },
	]
};

var albumDarius = {
	name: 'Velour',
	artist: 'Darius',
	label: 'Independent',
	year: '2012',
	albumArtUrl: 'assets/images/album_covers/03.png',
	songs: [
		{ name: 'Velour', length: '3:36' },
		{ name: 'Falling in Love', length: '4:03' },
		{ name: 'Once in a while', length: '5:01' },
		{ name: 'Maliblue', length: '3:14' },
		{ name: 'Constance', length: '2:15' },
		{ name: 'Road trip', length: '1:56' },
		{ name: 'Dans tes yeux', length: '4:31' }
	]
};

var createSongRow = function(songNumber, songName, songLength) {
	var template = 
			'<tr class="album-view-song-item">'
		+	'	<td class="song-item-number">' + songNumber + '</td>'
		+	'	<td class="song-item-title">' + songName + '</td>'
		+	'	<td class="song-item-duration">' + songLength+ '</td>'
		+	'</tr>'
		;
	return template;
}

var setCurrentAlbum = function(album) {
	var albumTitle = document.getElementsByClassName('album-view-title')[0];
	var albumArtist = document.getElementsByClassName('album-view-artist')[0];
	var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
	var albumImage = document.getElementsByClassName('album-cover-art')[0];
	var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
	
	albumTitle.firstChild.nodeValue = album.name;
	albumArtist.firstChild.nodeValue = album.artist;
	albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
	albumImage.setAttribute('src', album.albumArtUrl);
	
	albumSongList.innerHTML = '';
	
	for(var i=0; i<album.songs.length; i++) {
		albumSongList.innerHTML += createSongRow(i+1, album.songs[i].name, album.songs[i].length);
	}
};

window.onload = function() {
	setCurrentAlbum(albumPicasso);
	var albumCover = document.getElementsByClassName('album-cover-art')[0];
	var albums = [albumDarius, albumMarconi, albumPicasso]
	var i = 0;
	
	albumCover.addEventListener('click', function(event) {
		setCurrentAlbum(albums[i]);
		if (i==2) {
			i=0;
		}
		else {
			i++;
		}
	});
};