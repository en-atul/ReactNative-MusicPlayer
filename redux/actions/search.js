export const insertSearchedFile = (data) => async (dispatch) => {
  dispatch({type: 'INSERT_SEARCHED_FILE', payload: data});
};

export const deleteSearchedFile = (id) => async (dispatch) => {
  dispatch({type: 'DELETE_SEARCHED_FILE', payload: id});
};
