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
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useRoute} from '@react-navigation/native';
import {EventRegister} from 'react-native-event-listeners';
import Menu from 'react-native-vector-icons/Feather';

import Songs from '../components/Songs';
import Modal from 'react-native-modal';

import Details from '../components/Details';
import {Banner} from 'react-native-paper';

function MainScreen(props) {
  const [info, setInfo] = React.useState(false);
  React.useEffect(() => {
    EventRegister.emit('shift', false);
  }, []);
  const {theme} = useSelector((state) => state.settings);
  const navigate = (path) => {
    setModalVisible(false);

    props.navigation.navigate(path);
  };
  const bg = theme !== 'light' ? '#fff' : '#3e3e3e';
  const sideMenu = '#2EC7FC';
  const bg2 = theme !== 'light' ? '#000' : '#fff';
  const border1 = theme !== 'light' ? '#000' : '#eee';
  const header = theme !== 'light' ? '#000' : '#fff';
  return (
    <View style={[styles.container, {backgroundColor: bg2}]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: header,
            borderColor: 'transparent',
            borderBottomColor: border1,
            borderWidth: 0.5,
          },
        ]}>
        <TouchableOpacity
          onPress={() => props.navigation.openDrawer()}
          style={{
            width: '10%',

            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Menu name="menu" size={27} color={bg} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            width: '80%',

            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setInfo(!info)}>
          <Text
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: 37,
              color: bg,
              fontFamily: 'Baumans',
            }}>
            vion
          </Text>
        </TouchableOpacity>
        <View
          style={{
            width: '10%',
            justifyContent: 'center',
            alignItems: 'center',
          }}></View>
      </View>

      <View
        style={{
          marginTop: 64,
          width: '100%',
          height: '100%',
        }}>
        <Banner
          visible={info}
          actions={[]}
          style={{
            borderColor: 'transparent',
            width: Dimensions.get('screen').width,
            backgroundColor: '#fdfdfd',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Details />
        </Banner>
        <Songs />
      </View>
      {/* <Modal isVisible={true} animationInTiming={750}>
        <View style={{flex: 1}}>
          <Text>I am the modal content!</Text>
        </View>
      </Modal> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    top: 0,
    height: 64,
    borderWidth: 0.5,
    borderColor: 'transparent',
    borderBottomColor: '#ccc',
  },
  item: {
    height: 60,
    backgroundColor: '#fff',
    borderWidth: 0.7,
    borderColor: 'transparent',
    borderBottomColor: '#ecf1f7',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  cover: {
    width: 45,
    height: 45,
    borderRadius: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  left: {
    width: '20%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    width: '80%',
    height: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});

export default React.memo(MainScreen);