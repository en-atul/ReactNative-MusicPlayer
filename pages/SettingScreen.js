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
  BackHandler,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {EventRegister} from 'react-native-event-listeners';
import Menu from 'react-native-vector-icons/Feather';
import {useRoute} from '@react-navigation/native';

export default class SettingScreen extends React.Component {
  componentDidMount() {
    console.log('hello from setting');
  }

  render() {
    return (
      <View style={[styles.container]}>
        <View style={[styles.header]}>
          <TouchableOpacity
            onPress={() => this.props.navigation.openDrawer()}
            style={{
              width: '10%',

              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Menu name="menu" size={27} />
          </TouchableOpacity>
          <View
            style={{
              width: '60%',

              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                textAlign: 'left',
                width: '100%',
                marginLeft: 35,
                fontWeight: '700',
                fontFamily: 'sans-serif-light',
                fontSize: 18,
              }}>
              Setting
            </Text>
          </View>
        </View>

        <View style={{marginTop: 64, width: '100%', height: '100%'}}>
          <TouchableOpacity activeOpacity={1}></TouchableOpacity>
        </View>
      </View>
    );
  }
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
    backgroundColor: '#fff',
  },

  item: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    overflow: 'hidden',
    borderWidth: 0.7,
    borderColor: 'transparent',
    borderBottomColor: '#ecf1f7',
    backgroundColor: '#fff',
  },

  itemTxt: {
    marginLeft: 20,
    fontSize: 18,
    color: '#6b6b6b',
    borderRadius: 10,
    fontFamily: 'sans-serif-medium',
  },
  title: {
    fontSize: 32,
  },
  search: {
    paddingRight: 10,
    marginTop: 10,
    width: '100%',
    flexDirection: 'row',
    // backgroundColor: '#fff',
  },
  item2: {
    marginLeft: 10,
    fontSize: 10,
    fontFamily: 'sans-serif-medium',
    color: '#6b6b6b',
    width: '70%',
  },
  result: {
    fontStyle: 'italic',
    fontFamily: 'sans-serif-medium',
    padding: 10,
    paddingTop: 0,
    textAlign: 'center',
  },

  cover: {
    width: 45,
    height: 45,
    borderRadius: 5,
    backgroundColor: '#fafafa',
    alignItems: 'center',
    justifyContent: 'center',
  },

  left: {
    width: '60%',
    height: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  select: {
    width: '40%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
