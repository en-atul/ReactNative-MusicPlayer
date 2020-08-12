import changeNavigationBarColor from 'react-native-navigation-bar-color';

export const toggleTheme = (data) => async (dispatch) => {
  if (data === 'light') {
    await changeNavigationBarColor('#ffffff', true);
  } else {
    await changeNavigationBarColor('#000000', true);
  }
  dispatch({type: 'THEME', payload: data});
};
