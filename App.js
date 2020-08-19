/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import Container from './pages/Container';
import {Provider} from 'react-redux';
import {store, persistor} from './redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import SetUpPlayer from './util/setUpTrackPlayer';
import TrackPlayer from 'react-native-track-player';
import {ThemeProvider} from 'styled-components/native';
import * as themes from './themes';

const App = () => {
  const {
    playback: {currentTrack},
    settings: {theme},
  } = store.getState();

  React.useEffect(() => {
    SetUpPlayer();
    store.dispatch({type: 'set_playback', payload: false});
    currentTrack.title !== '' && TrackPlayer.add(currentTrack);
  }, []);

  return (
    <View style={styles.container}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ThemeProvider theme={themes[theme]}>
            <Container />
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
