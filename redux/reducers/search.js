const INITIAL_STATE = {
  searched: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'INSERT_SEARCHED_FILE':
      return {...state, searched: [...state.searched, action.payload]};
    case 'DELETE_SEARCHED_FILE': {
      let arr = [...state.searched];
      let index = arr.findIndex((i) => i.id === action.payload);
      if (index !== -1) arr.splice(index, 1);
      return {...state, searched: arr};
    }

    default:
      return state;
  }
}
