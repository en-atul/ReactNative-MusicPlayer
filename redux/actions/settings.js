import changeNavigationBarColor from 'react-native-navigation-bar-color';

export const toggleTheme = (theme) => {
  if (theme === 'light') {
    changeNavigationBarColor('#ffffff', true);
  } else {
    changeNavigationBarColor('#0e0e0e', true);
  }
  return {type: 'THEME', payload: theme};
};
