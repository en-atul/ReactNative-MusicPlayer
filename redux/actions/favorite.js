export const addFavorite = (data) => async (dispatch) => {
  console.log('playlist name', data);
  dispatch({type: 'ADD_FAVORITE', payload: data});
};

export const deleteFavorite = (data) => async (dispatch) => {
  dispatch({type: 'DELETE_FAVORITE', payload: data});
};
