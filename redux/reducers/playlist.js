const INITIAL_STATE = {
  playlist: [],
  playlistSongs: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'ADD_PLAYLIST':
      return {...state, playlist: [...state.playlist, action.payload]};
    case 'DELETE_PLAYLIST': {
      let arr = [...state.playlist];
      let index = arr.findIndex((data) => data === action.payload);
      if (index !== -1) arr.splice(index, 1);
      return {...state, playlist: arr};
    }

    case 'ADD_PLAYLIST_SONG':
      return {
        ...state,
        playlistSongs: [...state.playlistSongs, action.payload],
      };
    case 'DELETE_PLAYLIST_SONG': {
      let arr = [...state.playlistSongs];
      let index = arr.findIndex((data) => data.id === action.payload);
      if (index !== -1) arr.splice(index, 1);
      return {...state, playlistSongs: arr};
    }

    default:
      return state;
  }
}
