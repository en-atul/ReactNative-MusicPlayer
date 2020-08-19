/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';
import Container from './pages/Container';
import {Provider} from 'react-redux';
import {store, persistor} from './redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import SetUpPlayer from './util/setUpTrackPlayer';
import TrackPlayer from 'react-native-track-player';

const App = () => {
  const {
    playback: {currentTrack},
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
          <Container />
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
