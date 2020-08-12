import changeNavigationBarColor from 'react-native-navigation-bar-color';

export const toggleTheme = (theme) => {
  if (theme === 'light') {
    changeNavigationBarColor('#ffffff', true);
  } else {
    changeNavigationBarColor('#000000', true);
  }
  return {type: 'THEME', payload: theme};
};
