const INITIAL_STATE = {
  favorite: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'ADD_FAVORITE':
      return {...state, favorite: [...state.favorite, action.payload]};
    case 'DELETE_FAVORITE': {
      let arr = [...state.favorite];
      let index = arr.findIndex((data) => data.id === action.payload);
      if (index !== -1) arr.splice(index, 1);
      return {...state, favorite: arr};
    }

    default:
      return state;
  }
}
