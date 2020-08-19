const INITIAL_STATE = {
  songs: [],
  artists: [],
  albums: [],
  mediaLoaded: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'FETCHED_SONGS':
      return {mediaLoaded: true, ...action.payload};
    case 'rename_track': {
      let mediaArr = [...state.songs];
      let index = mediaArr.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) mediaArr[index] = action.payload;
      return {...state, songs: mediaArr};
    }
    case 'delete_track': {
      let mediaArray = [...state.songs];
      let i = mediaArray.findIndex((item) => item.id === action.payload.id);
      if (i !== -1) {
        mediaArray.splice(i, 1);
        mediaArray = mediaArray.map((val, i) => {
          return {...val, index: i};
        });
      }
      return {...state, songs: mediaArray};
    }
    default:
      return state;
  }
}
