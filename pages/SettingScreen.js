/**atul15r
 * React Native Music Player
 * https://github.com/atul15r
 *7 Aug 2020
 * @format
 * @flow
 */

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {EventRegister} from 'react-native-event-listeners';
import {withTheme} from 'styled-components/native';
import Toast from '../components/Toast';
import Menu from 'react-native-vector-icons/Feather';
import {Switch} from 'react-native-paper';
import * as actions from '../redux/actions';
import RNFetchBlob from 'rn-fetch-blob';
import {connect} from 'react-redux';

const clearCache = async () => {
  try {
    const {unlink, dirs} = RNFetchBlob.fs;
    await unlink(dirs.DocumentDir + '/.vion');
    Toast('Cache Cleared');
  } catch (e) {}
};

function SettingScreen(props) {
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const dispatch = useDispatch();

  const onToggleSwitch = () => {
    if (!isSwitchOn) {
      dispatch(props.toggleTheme('dark'));
    } else {
      dispatch(props.toggleTheme('light'));
    }
    setIsSwitchOn(!isSwitchOn);
  };

  const {current, background, border, txtColor} = props.theme;

  React.useEffect(() => {
    setIsSwitchOn(current === 'light' ? false : true);
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: background}]}>
      <View
        style={[
          styles.header,
          {backgroundColor: background, borderBottomColor: border},
        ]}>
        <TouchableOpacity
          onPress={() => props.navigation.openDrawer()}
          style={{
            width: '10%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Menu name="menu" size={27} color={txtColor} />
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
              color: txtColor,
            }}>
            Setting
          </Text>
        </View>
      </View>

      <View style={{marginTop: 64, width: '100%', height: '100%'}}>
        <View
          activeOpacity={1}
          style={[
            styles.item,
            {backgroundColor: background, borderBottomColor: border},
          ]}>
          <View style={styles.left}>
            <Text style={styles.txt}>Dark theme</Text>
          </View>
          <View style={styles.right}>
            <Switch
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
              color="#2EC7FC"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={clearCache}
          activeOpacity={1}
          style={[
            styles.item,
            {backgroundColor: background, borderBottomColor: border},
          ]}>
          <View style={styles.left}>
            <Text style={styles.txt}>Clear Cache</Text>
          </View>
        </TouchableOpacity>
      </View>
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

  txt: {
    marginLeft: 20,
    fontSize: 18,
    color: '#6b6b6b',
    borderRadius: 10,
    fontFamily: 'sans-serif-medium',
  },

  left: {
    width: '85%',
    height: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  right: {
    width: '15%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default connect('', actions)(withTheme(SettingScreen));
