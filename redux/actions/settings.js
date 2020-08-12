import changeNavigationBarColor from 'react-native-navigation-bar-color';

export const toggleTheme = async (theme) => {
  if (theme === 'light') {
    await changeNavigationBarColor('#ffffff', true);
  } else {
    await changeNavigationBarColor('#000000', true);
  }
  return {type: 'THEME', payload: theme};
};
