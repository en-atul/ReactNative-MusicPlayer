export const addPlaylist = (data) => async (dispatch) => {
  console.log('playlist name', data);
  dispatch({type: 'ADD_PLAYLIST', payload: data});
};

export const deletePlaylist = (data) => async (dispatch) => {
  dispatch({type: 'DELETE_PLAYLIST', payload: data});
};

export const addPlaylistSong = (data) => async (dispatch) => {
  dispatch({type: 'ADD_PLAYLIST_SONG', payload: data});

  console.log('add playlist song', data);
};

export const deletePlaylistSong = (data) => async (dispatch) => {
  dispatch({type: 'DELETE_PLAYLIST_SONG', payload: data});
};
