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
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  ScrollView,
} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import * as themes from '../themes';
import {addFavorite, deleteFavorite} from '../redux/actions/favorite';
import {
  setPlayback,
  setCurrentTrack,
  setLoop,
  setShuffle,
  setQueueTrack,
} from '../redux/actions/playback';

import Ion from 'react-native-vector-icons/Ionicons';
import Toast from './Toast';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Entypo';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import TrackPlayer from 'react-native-track-player';
import {EventRegister} from 'react-native-event-listeners';
import Modal from 'react-native-modal';
import {Badge} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import ProgressSlider from './ProgressSlider';

TrackPlayer.setupPlayer();

function BottomNowPlaying(props) {
  const [panel, setPanel] = useState(false);
  const [pos, setPos] = useState(false);
  const [hide, setHide] = useState(false);

  const dispatch = useDispatch();
  const {theme} = useSelector((state) => state.settings);
  const {songs} = useSelector((state) => state.data);

  const {currentTrack, shuffle, isPlaying, queue, queueSong} = useSelector(
    (state) => state.playback,
  );

  const txt = theme !== 'light' ? '#fff' : '#24292e';
  const txt2 = theme !== 'light' ? '#6b6b6b' : '#999';
  const border1 = theme !== 'light' ? '#121212' : '#eee';
  const bc = theme !== 'light' ? '#0e0e0e' : '#fafafa';

  useEffect(() => {
    EventRegister.addEventListener('shift', (data) => {
      setPos(data);
      EventRegister.removeEventListener('shift');
    });

    EventRegister.addEventListener('hide', (data) => {
      setHide(data);
      EventRegister.removeEventListener('hide');
    });
  }, []);

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
      style={{
        height: 120,
        width: '100%',
        position: 'absolute',
        bottom: 0,
      }}>
      <View
        style={[
          styles.playing,
          {
            borderTopColor: panel ? 'transparent' : border1,
            borderBottomColor: panel ? 'transparent' : border1,
            borderColor: 'transparent',
            backgroundColor: bc,
          },
        ]}
        activeOpacity={1}>
        {!panel && (
          <View style={{flexDirection: 'row'}}>
            <View style={styles.thumbnail}>
              {currentTrack.artwork ? (
                <Image
                  source={{uri: currentTrack.artwork}}
                  style={styles.thumbnailCover}
                />
              ) : (
                <Icon
                  name="ios-musical-notes-outline"
                  size={30}
                  color="#212121"
                />
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
                <Ion
                  name={isPlaying ? 'pause' : 'play'}
                  size={35}
                  color={txt}
                />
              </TouchableWithoutFeedback>

              <TouchableOpacity onPress={() => skipToNext()}>
                <Ion name="ios-play-skip-forward" size={25} color={txt} />
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    backgroundColor: '#fff',
  },

  playing: {
    width: '100%',
    height: 65,
    backgroundColor: '#fafafa',
    borderWidth: 0.7,
    borderTopWidth: 1,
    borderColor: '#eee',
    flexDirection: 'column',
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

  bigPlayer: {
    marginTop: -1000,
    paddingTop: 1000,
    backgroundColor: '#fff',
    marginBottom: '100%',
  },
  coverWrap: (scrollA) => ({
    width: '100%',
    height: 400,
    justifyContent: 'flex-start',
    alignItems: 'center',
    transform: [
      {
        translateY: scrollA,
      },
    ],
  }),
  bigCover: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    resizeMode: 'stretch',
  },
  progress: {
    width: '100%',
    height: '60%',
  },

  slide: {
    width: '100%',
    height: 270,
    backgroundColor: '#fff',

    elevation: 28,
  },
  img: {
    width: '100%',
    height: 270,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    height: 70,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 0.7,
    borderColor: 'transparent',
    borderBottomColor: '#ecf1f7',
  },

  itemTxt: {
    marginLeft: 10,
    fontSize: 12,

    borderRadius: 10,
    fontFamily: 'sans-serif-medium',
  },

  search: {
    paddingRight: 10,
    marginTop: 10,
    width: '100%',
    flexDirection: 'row',
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
    alignItems: 'center',
    justifyContent: 'center',
  },

  left: {
    width: '20%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mid: {
    flexDirection: 'column',
    width: '70%',
    height: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  right: {
    flexDirection: 'column',
    width: '10%',
    height: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  Timer: {
    fontWeight: '700',
    fontFamily: 'sans-serif-light',
    fontStyle: 'italic',
    backgroundColor: '#fafafa',
    padding: 4,
    borderWidth: 0.7,
    borderColor: '#eee',
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    display: 'none',
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
)(React.memo(BottomNowPlaying));
