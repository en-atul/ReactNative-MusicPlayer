import _ from 'underscore';
import {store} from '../redux/store';

export default function mergeMedia(media) {
  if (!Array.isArray(media) || media.length === 0) return [];
  let newMedia = [];
  let folderName = '';
  let {
    settings: {foldersToSkip},
  } = store.getState();
  let mediaFiles = media.filter(
    (val) =>
      !(
        foldersToSkip.includes(getFolder(val.path).toLowerCase()) ||
        val.fileName.includes('.flac') ||
        val.fileName.includes('#')
      ),
  );
  for (let i = 0; i < mediaFiles.length; i++) {
    folderName = getFolder(mediaFiles[i].path);
    newMedia.push({
      id: mediaFiles[i].duration + i,
      duration: mediaFiles[i].duration,
      url: mediaFiles[i].path,
      title:
        mediaFiles[i].title ||
        mediaFiles[i].fileName.replace(/.mp3|.aac|.wav|.amr|.flac/, ''),
      artwork: mediaFiles[i].cover || null,
      artist:
        mediaFiles[i].author === '<unknown>' ? 'unknown' : mediaFiles[i].author,
      album:
        mediaFiles[i].album === '<unknown>' ? 'unknown' : mediaFiles[i].album,
      index: i,
      folder: folderName,
    });
  }

  return {
    songs: newMedia,
    artists: getArtistWithSong(newMedia),
    albums: getAlbumWithSong(newMedia),
  };
}

function getFolder(path) {
  let dirArr = path.split('/');
  return dirArr[dirArr.length - 2];
}

function getArtistWithSong(allSongs) {
  let arr = [];
  let data = _.groupBy(allSongs, 'artist');
  let artists = Object.keys(data);
  artists.forEach((name) => {
    arr.push({
      artistName: name,
      data: data[name],
    });
  });
  let sortedData = _.sortBy(arr, 'title').filter(
    (item) => item.title !== 'null',
  );
  return sortedData;
}

function getAlbumWithSong(allSongs) {
  let arr = [];
  let data = _.groupBy(allSongs, 'album');
  let albums = Object.keys(data);
  albums.forEach((name) => {
    arr.push({
      albumName: name,
      data: data[name],
    });
  });
  let sortedData = _.sortBy(arr, 'title').filter(
    (item) => item.title !== 'null',
  );
  return sortedData;
}
