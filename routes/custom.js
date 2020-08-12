/**atul15r
 * React Native Music Player
 * https://github.com/atul15r
 *7 Aug 2020
 * @format
 * @flow
 */

import * as React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Share from 'react-native-share';

class Custom extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  _Share = () => {
    Share.open({
      message:
        'Download vion and enjoy offline playing!!!\nhttps://play.google.com/store/apps/details?id=com.vion',
    });
  };

  render() {
    const {
      settings: {theme},
      ...rest
    } = this.props;
    const bc2 = theme !== 'light' ? '#0c0c0c' : '#fafafa';
    const inactive = theme !== 'light' ? '#29292a' : '#6b6b6b';

    return (
      <>
        <DrawerContentScrollView {...rest}>
          <View
            style={{
              backgroundColor: bc2,
              height: 1,
              width: '80%',
              left: '10%',
            }}></View>
          <DrawerItemList {...rest} />
        </DrawerContentScrollView>
        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 110,
          }}>
          <TouchableOpacity
            onPress={() => {
              this._Share();
            }}
            style={{
              flexDirection: 'row',
              width: '100%',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: 0,
            }}>
            <View style={{position: 'absolute', left: 20}}>
              <Icon
                name="share-social-outline"
                size={15}
                style={{marginLeft: 10, color: inactive}}
              />
            </View>
            <Text
              style={{
                position: 'absolute',
                left: 58,
                color: inactive,
                fontSize: 12,
                fontFamily: 'sans-serif-medium',
              }}>
              Share
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

Custom.propTypes = {
  settings: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  settings: state.settings,
});

const mapActionsToProps = {};
export default connect(mapStateToProps, mapActionsToProps)(Custom);
