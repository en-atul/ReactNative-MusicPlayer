import {RNAndroidAudioStore} from 'react-native-get-music-files';
import RNFetchBlob from 'rn-fetch-blob';
import {
  getStoragePermission,
  checkStoragePermissions,
} from '../../util/Permission';
import mergeMedia from '../../util/File';
import {store} from '../store';

const options = {
  title: true,
  artist: true,
  album: true,
  duration: true,
  cover: false,
  blured: false,
};

export const getMedia = () => async (dispatch) => {
  try {
    let granted = await checkStoragePermissions();
    if (!granted) await getStoragePermission();
    let {data} = store.getState();
    if (data.mediaLoaded) {
      let media = await getMediaWithCovers();
      dispatch({type: 'FETCHED_SONGS', payload: media});
    } else {
      let results = await RNAndroidAudioStore.getAll(options);
      let media = mergeMedia(results);
      dispatch({type: 'FETCHED_SONGS', payload: media});
      let mediaWithCovers = await getMediaWithCovers();
      dispatch({type: 'FETCHED_SONGS', payload: mediaWithCovers});
    }
  } catch (e) {
    //errorReporter(e);
  }
};

const getMediaWithCovers = async () => {
  const coverFolder = RNFetchBlob.fs.dirs.DocumentDir + '/.vion';
  let results = await RNAndroidAudioStore.getAll({
    ...options,
    cover: true,
    coverFolder,
  });
  return mergeMedia(results);
};
