/**atul15r
 * React Native Music Player
 * https://github.com/atul15r
 *7 Aug 2020
 * @format
 * @flow
 */

import React from 'react';
import {
  View,
  StatusBar,
  Text,
  PermissionsAndroid,
  StyleSheet,
} from 'react-native';
import NavDrawer from '../routes/Drawer';
import {getMedia} from '../redux/actions/data';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';
import {useSelector} from 'react-redux';
import NowPlaying from '../components/NowPlaying';
import {ThemeProvider} from 'styled-components/native';
import * as themes from '../themes';
import SplashScreen from 'react-native-splash-screen';

function Container(props) {
  const [vol, setVol] = React.useState(false);

  React.useEffect(() => {
    props.getMedia();
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);

  const {songs} = useSelector((state) => state.data);
  const {theme} = useSelector((state) => state.settings);
  // const {currentTrack} = useSelector((state) => state.playback);
  const bc = '#fff';
  const bg = '#121212';
  const bar = 'dark-content';
  //   songs.length > 0 && console.log(songs[0]);
  return (
    <View
      style={{
        backgroundColor: bc,
        flex: 1,
      }}>
      <StatusBar backgroundColor={bc} barStyle={bar} />

      {songs.length > 0 ? (
        <ThemeProvider theme={themes[theme]}>
          <NavDrawer />
        </ThemeProvider>
      ) : (
        <View
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '20%',
              height: '8%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <LottieView
              source={require('../image/loading.json')}
              autoPlay
              loop
            />
          </View>
          <Text style={{color: bg, fontFamily: 'OpenSans'}}>
            fetching songs...
          </Text>
          {vol && (
            <Text
              style={{
                color: '#999',
                fontSize: 10,
                marginTop: 3,
                fontFamily: 'OpenSans',
              }}>
              High Volume
            </Text>
          )}
        </View>
      )}
      <NowPlaying />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#121212',
    padding: 10,
    fontSize: 22,
    marginLeft: 10,
    marginBottom: 10,
  },
});

Container.propTypes = {
  //data: PropTypes.object.isRequired,
  getMedia: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  //data: state.data,
});

const mapActionsToProps = {
  getMedia,
};
export default connect(mapStateToProps, mapActionsToProps)(Container);
