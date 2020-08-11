import TrackPlayer from 'react-native-track-player';

export const setCurrentTrack = (currentTrack) => async (dispatch) => {
  try {
    await TrackPlayer.reset();
    await TrackPlayer.add(currentTrack);
    dispatch({type: 'current_track', payload: currentTrack});
    TrackPlayer.play();
    dispatch({type: 'set_playback', payload: true});

    dispatch({type: 'RECENTLY_PLAYED', payload: currentTrack});
    dispatch({type: 'MOST_PLAYED', payload: {currentTrack, count: 0}});

    dispatch({type: 'SET_QUEUE', payload: false});
  } catch (e) {
    // do nothing lmao
  }
};

export const setQueueTrack = (currentTrack) => async (dispatch) => {
  try {
    await TrackPlayer.reset();
    await TrackPlayer.add(currentTrack);
    dispatch({type: 'current_track', payload: currentTrack});
    TrackPlayer.play();
    dispatch({type: 'set_playback', payload: true});

    dispatch({type: 'RECENTLY_PLAYED', payload: currentTrack});
    dispatch({type: 'MOST_PLAYED', payload: {currentTrack, count: 0}});
  } catch (e) {
    // do nothing lmao
  }
};

export const setQueue = (data) => async (dispatch) => {
  dispatch({type: 'SET_QUEUE_SONG', payload: data});
  dispatch({type: 'SET_QUEUE', payload: true});
  await TrackPlayer.reset();
  await TrackPlayer.add(data[0]);
  dispatch({
    type: 'current_track',
    payload: await TrackPlayer.getTrack(await TrackPlayer.getCurrentTrack()),
  });
  TrackPlayer.play();
  dispatch({type: 'set_playback', payload: true});

  dispatch({type: 'RECENTLY_PLAYED', payload: data[0]});
  dispatch({type: 'MOST_PLAYED', payload: {currentTrack: data[0], count: 0}});
};

export const setPlayback = (isPlaying) => {
  isPlaying ? TrackPlayer.play() : TrackPlayer.pause();
  return {type: 'set_playback', payload: isPlaying};
};

export const setLoop = (isLoop) => {
  return {type: 'set_loop', payload: isLoop};
};

export const setShuffle = (isShuffle) => {
  return {type: 'set_shuffle', payload: isShuffle};
};
