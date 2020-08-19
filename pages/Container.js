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
import {useSelector, useDispatch} from 'react-redux';
import BottomNowPlaying from '../components/BottomNowPlaying';
import {toggleTheme} from '../redux/actions/settings';
import SplashScreen from 'react-native-splash-screen';

function Container(props) {
  const [vol, setVol] = React.useState(false);
  const dispatch = useDispatch();
  const {songs} = useSelector((state) => state.data);
  const {theme} = useSelector((state) => state.settings);

  React.useEffect(() => {
    props.getMedia();
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
    if (theme === 'light') {
      dispatch(toggleTheme('light'));
    } else {
      dispatch(toggleTheme('dark'));
    }
  }, []);

  const bc = theme === 'light' ? '#fff' : '#0e0e0e';
  const bar = theme === 'light' ? 'dark-content' : 'light-content';

  return (
    <View
      style={{
        backgroundColor: bc,
        flex: 1,
      }}>
      <StatusBar backgroundColor={bc} barStyle={bar} />

      {songs.length > 0 ? (
        <NavDrawer />
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
          <Text style={{color: '#000', fontFamily: 'OpenSans'}}>
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
  getMedia: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  //data: state.data,
});

const mapActionsToProps = {
  getMedia,
};
export default connect(mapStateToProps, mapActionsToProps)(Container);
