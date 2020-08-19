/**atul15r
 * React Native Music Player
 * https://github.com/atul15r
 *7 Aug 2020
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {addFavorite, deleteFavorite} from '../redux/actions/favorite';
import {
  setPlayback,
  setCurrentTrack,
  setQueueTrack,
} from '../redux/actions/playback';

import Ion from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import TrackPlayer from 'react-native-track-player';
import {withTheme} from 'styled-components/native';

import {EventRegister} from 'react-native-event-listeners';

import {useDispatch, useSelector} from 'react-redux';

TrackPlayer.setupPlayer();

function BottomNowPlaying(props) {
  const [hide, setHide] = useState(false);

  const dispatch = useDispatch();
  const {theme} = useSelector((state) => state.settings);
  const {songs} = useSelector((state) => state.data);

  const {currentTrack, shuffle, isPlaying, queue, queueSong} = useSelector(
    (state) => state.playback,
  );

  const {txt, txt2, bc, border} = props.theme;

  // useEffect(() => {
  //   EventRegister.addEventListener('shift', (data) => {
  //     setPos(data);
  //     EventRegister.removeEventListener('shift');
  //   });

  function skipToNext() {
    if (queue) {
      const index = queueSong.findIndex(
        (data) => data.index === currentTrack.index,
      );

      let nextTrack = shuffle
        ? queueSong[getRandomNumber(0, queueSong.length)]
        : index === queueSong.length - 1
        ? queueSong[0]
        : queueSong[index + 1];
      dispatch(setQueueTrack(nextTrack));
    } else {
      let nextTrack = shuffle
        ? songs[getRandomNumber(0, songs.length)]
        : currentTrack.index === songs.length - 1
        ? songs[0]
        : songs[currentTrack.index + 1];
      dispatch(setCurrentTrack(nextTrack));
    }
  }

  const Bar = () => (
    <View
      style={[
        styles.playing,
        {
          borderTopColor: border,
          borderBottomColor: border,
          borderColor: 'transparent',
          backgroundColor: bc,
        },
      ]}
      activeOpacity={1}>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.thumbnail}>
          {currentTrack.artwork ? (
            <Image
              source={{uri: currentTrack.artwork}}
              style={styles.thumbnailCover}
            />
          ) : (
            <Icon name="ios-musical-notes-outline" size={30} color="#212121" />
          )}
        </View>
        <TouchableOpacity
          style={styles.title}
          onPress={() => props.nav.navigate('NowPlaying')}>
          <Text
            numberOfLines={1}
            style={{
              fontWeight: '700',
              fontFamily: 'sans-serif-light',
              color: txt,
            }}>
            {currentTrack.title}
          </Text>
          <Text numberOfLines={1} style={{fontSize: 11, color: txt2}}>
            {currentTrack.artist || 'unknown'}
          </Text>
        </TouchableOpacity>
        <View style={styles.controller}>
          <TouchableWithoutFeedback
            onPress={() => dispatch(setPlayback(!isPlaying))}>
            <Ion name={isPlaying ? 'pause' : 'play'} size={35} color={txt} />
          </TouchableWithoutFeedback>

          <TouchableOpacity onPress={() => skipToNext()}>
            <Ion name="ios-play-skip-forward" size={25} color={txt} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return <>{currentTrack.title !== '' && !hide && <Bar />}</>;
}

const styles = StyleSheet.create({
  thumbnailCover: {
    width: 55,
    height: 55,
    borderRadius: 5,
  },

  playing: {
    width: '100%',
    height: 65,
    backgroundColor: '#fafafa',
    borderWidth: 0.7,
    borderTopWidth: 1,
    borderColor: '#eee',
    flexDirection: 'column',
    position: 'absolute',
    bottom: 60,
  },
  thumbnail: {
    width: '15%',
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    width: '60%',
    height: 65,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 2,

    // lineHeight: 40,
  },
  controller: {
    width: '25%',
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
BottomNowPlaying.propTypes = {
  data: PropTypes.object.isRequired,
  addFavorite: PropTypes.func.isRequired,
  deleteFavorite: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  data: state.data,
});

const mapActionsToProps = {
  addFavorite,
  deleteFavorite,
};
export default connect(
  mapStateToProps,
  mapActionsToProps,
)(withTheme(React.memo(BottomNowPlaying)));
