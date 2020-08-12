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
import BottomMenu from './BottomMenu';
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

function Item2({data, index, bc, border, txtColor, un}) {
  return (
    <View
      key={index}
      style={[styles.item, {backgroundColor: bc, borderBottomColor: border}]}>
      <View style={styles.left}>
        {data.artwork ? (
          <Image source={{uri: data.artwork}} style={styles.cover} />
        ) : (
          <View style={[styles.cover]}>
            <Icon name="ios-musical-notes-outline" size={30} color={un} />
          </View>
        )}
      </View>
      <View style={styles.mid}>
        <Text style={[styles.itemTxt, {color: txtColor}]} numberOfLines={1}>
          {data.title ? data.title : data.title.replace('.mp3', '')}
        </Text>
        <Text style={[styles.item2, {width: '90%'}]}>
          {data.album ? data.album.trim() : 'unknown'}
        </Text>
        <Text style={styles.item2} numberOfLines={1}>
          {data.artist}
        </Text>
      </View>
      <View style={styles.right}>
        <BottomMenu song={data} />
      </View>
    </View>
  );
}

function PlayingSong(props) {
  const [panel, setPanel] = useState(false);
  const [pos, setPos] = useState(false);
  const [hide, setHide] = useState(false);

  const dispatch = useDispatch();
  const {theme} = useSelector((state) => state.settings);
  const {songs} = useSelector((state) => state.data);
  const {favorite} = useSelector((state) => state.favorite);

  const {
    currentTrack,
    loop,
    shuffle,
    isPlaying,
    queue,
    queueSong,
  } = useSelector((state) => state.playback);

  const scrollA = React.useRef(new Animated.Value(0)).current;

  const unRecognized = theme !== 'light' ? '#ccc' : '#121212';
  const bg2 = theme !== 'light' ? '#000' : '#fff';
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

  const currentPlay = (data) => {
    dispatch(setCurrentTrack(data));
  };

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

  function skipToPrevious() {
    if (queue) {
      const index = queueSong.findIndex(
        (data) => data.index === currentTrack.index,
      );
      let nextTrack = shuffle
        ? queueSong[getRandomNumber(0, queueSong.length)]
        : index === 0
        ? queueSong[queueSong.length - 1]
        : queueSong[index - 1];
      dispatch(setQueueTrack(nextTrack));
    } else {
      let nextTrack = shuffle
        ? songs[getRandomNumber(0, songs.length)]
        : currentTrack.index === 0
        ? songs[songs.length - 1]
        : songs[currentTrack.index - 1];
      dispatch(setCurrentTrack(nextTrack));
    }
  }

  function onShufflePress() {
    Toast(`Shuffle: ${shuffle ? 'Off' : 'On'}`);
    dispatch(setShuffle(!shuffle));
  }

  function onLoopPress() {
    Toast(`Loop ${loop ? 'all tracks' : 'this track'}`);
    dispatch(setLoop(!loop));
  }

  const closePanel = () => {
    setPanel(false);
  };
  const openPanel = () => {
    setPanel(true);
  };

  const favAction = (song) => {
    if (favorite.some((data) => data.id === song.id)) {
      props.deleteFavorite(song.id);
    } else {
      props.addFavorite(song);
    }
  };

  const Bar = () => (
    <View
      style={{
        flexDirection: 'column',
        height: panel ? 65 : 120,
        width: '100%',
        position: 'absolute',
        bottom: panel ? 0 : pos ? -55 : 5,
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
            <TouchableOpacity style={styles.title} onPress={() => openPanel()}>
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

        {panel && (
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              height: 64,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <TouchableWithoutFeedback onPress={onLoopPress}>
                <View style={{flexDirection: 'row'}}>
                  <Icon name="ios-repeat" size={25} color={txt} />
                  <Badge
                    visible={loop}
                    size={12}
                    style={{
                      color: '#fff',
                      backgroundColor: '#24292e',
                      position: 'absolute',
                      right: 2,
                      top: 3,
                    }}>
                    R
                  </Badge>
                </View>
              </TouchableWithoutFeedback>
              <View
                style={{
                  width: '50%',
                  height: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <TouchableWithoutFeedback onPress={() => skipToPrevious()}>
                  <Ion name="ios-play-skip-back" size={33} color={txt} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => dispatch(setPlayback(!isPlaying))}>
                  <Ion
                    name={isPlaying ? 'pause' : 'play'}
                    size={40}
                    color={txt}
                  />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => skipToNext()}>
                  <Ion name="ios-play-skip-forward" size={33} color={txt} />
                </TouchableWithoutFeedback>
              </View>
              <TouchableWithoutFeedback onPress={onShufflePress}>
                <Icon name="ios-shuffle" size={25} color={txt} />
              </TouchableWithoutFeedback>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <>
      <Modal
        isVisible={panel}
        animationInTiming={450}
        style={{margin: 0, overflow: 'hidden'}}
        coverScreen={true}
        backdropOpacity={0.5}
        backdropColor={bg2}
        hideModalContentWhileAnimating={true}
        onBackButtonPress={closePanel}
        useNativeDriver={true}>
        {currentTrack.title !== '' && (
          <Animated.ScrollView
            style={{backgroundColor: bg2}}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollA}}}],
              {useNativeDriver: true},
            )}
            scrollEventThrottle={16}>
            <View style={[styles.bigPlayer, {backgroundColor: bg2}]}>
              <Animated.View style={styles.coverWrap(scrollA)}>
                <TouchableOpacity onPress={() => closePanel()}>
                  <Icon2
                    name="chevron-small-down"
                    size={30}
                    style={{marginLeft: 20, color: '#ccc'}}
                  />
                </TouchableOpacity>
                {currentTrack.artwork ? (
                  <View
                    style={{
                      elevation: 15,
                      width: '70%',
                      height: '70%',
                      backgroundColor: bg2,
                      borderRadius: 5,
                    }}>
                    <Image
                      source={{uri: currentTrack.artwork}}
                      style={styles.bigCover}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      width: '70%',
                      height: '70%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon
                        name="ios-musical-notes-outline"
                        size={40}
                        color={txt}
                      />
                    </View>
                  </View>
                )}
                <Text
                  numberOfLines={1}
                  style={{
                    fontWeight: '700',
                    fontFamily: 'sans-serif-light',
                    padding: 5,
                    fontSize: 18,
                    maxWidth: '70%',
                    color: txt,
                  }}>
                  {currentTrack.title}
                </Text>

                <Text
                  numberOfLines={1}
                  style={{
                    fontWeight: '700',
                    fontFamily: 'sans-serif-light',
                    fontSize: 14,
                    color: txt2,
                  }}>
                  {currentTrack.album || 'unknown'}
                </Text>
                <TouchableOpacity
                  onPress={() => favAction(currentTrack)}
                  activeOpacity={1}
                  style={{
                    width: '20%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: 0,
                  }}>
                  <Icon
                    name={
                      favorite.some((data) => data.url === currentTrack.url)
                        ? 'ios-heart-sharp'
                        : 'ios-heart-outline'
                    }
                    size={25}
                    style={{
                      color: favorite.some(
                        (data) => data.url === currentTrack.url,
                      )
                        ? '#ff3366'
                        : '#999',
                      marginTop: 10,
                    }}
                  />
                </TouchableOpacity>
              </Animated.View>

              {songs.length > 0 &&
                songs
                  .slice(currentTrack.index, currentTrack.index + 40)
                  .map((data, i) => (
                    <TouchableWithoutFeedback
                      onPress={() => currentPlay(data)}
                      key={i}>
                      <View>
                        <Item2
                          data={data}
                          index={i}
                          bc={bg2}
                          border={border1}
                          txtColor={
                            data.id === currentTrack.id ? '#36C0FC' : txt
                          }
                          un={unRecognized}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  ))}
            </View>
          </Animated.ScrollView>
        )}
        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}>
          <ThemeProvider theme={themes[theme]}>
            <ProgressSlider />
          </ThemeProvider>
        </View>
        {currentTrack.title !== '' && <Bar />}
      </Modal>

      {currentTrack.title !== '' && !hide && <Bar />}
    </>
  );
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
PlayingSong.propTypes = {
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
)(React.memo(PlayingSong));
