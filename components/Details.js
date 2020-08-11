/**atul15r
 * React Native Music Player
 * https://github.com/atul15r
 *7 Aug 2020
 * @format
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import * as Animatable from 'react-native-animatable';

class Details extends React.PureComponent {
  render() {
    const {
      data: {songs},
      playlist: {playlist},
      favorite: {favorite},
      history: {mostPlayed, recentlyPlayed},
    } = this.props;
    return (
      songs.length > 0 && (
        <View
          style={{
            width: Dimensions.get('window').width,
            height: 200,
            position: 'absolute',
            left: 0,
            flexDirection: 'row',
            backgroundColor: 'transparent',
          }}>
          <View
            style={{
              width: '40%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.boxTxt}>{songs.length}</Text>
            <Text style={[styles.title, {fontSize: 12}]}>Total Tracks</Text>
          </View>
          <View
            style={{
              width: '60%',
              height: '100%',

              flexWrap: 'wrap',
            }}>
            <View style={styles.box}>
              <Text style={styles.boxTxt}>{favorite.length}</Text>
              <Text style={styles.title}>Favorite</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.boxTxt}>{playlist.length}</Text>
              <Text style={styles.title}>Playlist</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.boxTxt}>{recentlyPlayed.length}</Text>
              <Text style={styles.title}>Recently Played</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.boxTxt}>
                {mostPlayed.filter((data) => data.count > 4).length}
              </Text>
              <Text style={styles.title}>Most Played</Text>
            </View>
          </View>
        </View>
      )
    );
  }
}
const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    width: Dimensions.get('screen').width,
    height: 230,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: '100%',
    height: 230,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: '50%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxTxt: {
    color: '#121212',
    fontWeight: '700',
  },
  title: {
    fontSize: 10,
    fontWeight: '700',
    color: '#616161',
  },
});
Details.propTypes = {
  data: PropTypes.object.isRequired,
  playlist: PropTypes.object.isRequired,
  favorite: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  favorite: state.favorite,
  playlist: state.playlist,
  data: state.data,
  history: state.history,
});
const mapActionsToProps = {};
export default connect(mapStateToProps, mapActionsToProps)(Details);
