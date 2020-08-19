import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import styled from 'styled-components';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon4 from 'react-native-vector-icons/MaterialIcons';

import {addFavorite} from '../redux/actions/favorite';
import Toast from './Toast';
import Share from 'react-native-share';
import TrackPlayer from 'react-native-track-player';

import {useSelector, useDispatch} from 'react-redux';
import {addPlaylistSong} from '../redux/actions/playlist';

export default function BottomMenu(props) {
  const dispatch = useDispatch();

  const [visible, setVisible] = React.useState(false);
  const [visiblePlaylist, setVisiblePlaylist] = React.useState(false);
  const {playlist, playlistSongs} = useSelector((state) => state.playlist);
  const {favorite} = useSelector((state) => state.favorite);
  const {theme} = useSelector((state) => state.settings);

  function onShare() {
    Share.open({
      url: `file://${props.song.url}`,
      type: 'audio/mp3',
      failOnCancel: false,
    });
  }

  const onAddPress = () => {
    setVisible(false);
    setVisiblePlaylist(true);
  };

  const _AddFavorite = () => {
    setVisible(false);
    if (
      favorite.some(
        (data) => data.id === props.song.id || data.index === props.song.index,
      )
    ) {
      Toast(`Already added to favorite`);
    } else {
      dispatch(addFavorite(props.song));
      Toast(`Added to favorite`);
    }
  };

  const onAdd = (db) => {
    setVisiblePlaylist(false);

    if (playlistSongs.some((data) => data.id === props.song.id + db)) {
      Toast(`Already added to Playlist`);
    } else {
      const track = {
        id: props.song.id + db,
        title: props.song.title,
        artist: props.song.artist,
        url: props.song.url,
        artwork: props.song.artwork,
        album: props.song.album,
        duration: props.song.duration,
        fileName: props.song.fileName,
        db: db,
        index: props.song.index,
      };
      dispatch(addPlaylistSong(track));
      Toast(`Added to playlist`);
    }
  };

  const _AddToQueue = () => {
    setVisible(false);
    TrackPlayer.add(props.song);
    Toast(`Added to queue`);
  };

  const bg = theme === 'light' ? '#ffffff' : '#121212';

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(!visible)}
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        activeOpacity={1}>
        <Icon name="dots-three-vertical" size={15} color="#999" />
      </TouchableOpacity>

      <Modal
        isVisible={visible}
        backdropOpacity={0.5}
        backdropColor={bg}
        style={{margin: 0}}
        animationInTiming={500}
        animationOutTiming={500}
        hideModalContentWhileAnimating={true}
        useNativeDriver={true}
        onBackButtonPress={() => setVisible(false)}
        onBackdropPress={() => setVisible(false)}>
        <View style={{flex: 1}}>
          <View style={[styles.modal, {backgroundColor: bg}]}>
            {props.song.artwork && (
              <View style={[styles.artwork, {elevation: 18}]}>
                <Image
                  source={{uri: props.song.artwork}}
                  style={{width: '100%', height: '100%', borderRadius: 5}}
                />
              </View>
            )}
            <Text
              style={{
                marginTop: props.song.artwork ? '21%' : 20,
                fontWeight: '700',
                textAlign: 'center',
                width: '80%',
                color: '#323738',
              }}
              numberOfLines={1}>
              {props.song.title}
            </Text>
            <Text style={{fontWeight: '700', fontSize: 12, color: '#999'}}>
              {props.song.album || 'unknown'}
            </Text>
            <TouchableOpacity onPress={onAddPress} style={styles.item}>
              <Icon3
                name="playlist-plus"
                size={25}
                style={{marginLeft: 10, color: '#5b5b5b'}}
              />
              <Text style={styles.txt}>Add to Playlist</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={_AddToQueue}
              style={[styles.item, {marginTop: 2}]}>
              <Icon4
                name="queue-music"
                size={25}
                style={{marginLeft: 10, color: '#5b5b5b'}}
              />
              <Text style={styles.txt}>Add to Queue</Text>
            </TouchableOpacity>
            {!props.favoriteHide && (
              <TouchableOpacity
                onPress={_AddFavorite}
                style={[styles.item, {marginTop: 2}]}>
                <Icon2
                  name="heart-outline"
                  size={25}
                  style={{marginLeft: 10, color: '#5b5b5b'}}
                />
                <Text style={styles.txt}>Add to Favorite</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={onShare}
              style={[styles.item, {marginTop: 2}]}>
              <Icon2
                name="share-social-outline"
                size={25}
                style={{marginLeft: 10, color: '#5b5b5b'}}
              />
              <Text style={styles.txt}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={visiblePlaylist}
        backdropOpacity={0.5}
        backdropColor={bg}
        style={{margin: 0}}
        animationInTiming={500}
        animationOutTiming={500}
        hideModalContentWhileAnimating={true}
        useNativeDriver={true}
        onBackButtonPress={() => setVisiblePlaylist(false)}
        onBackdropPress={() => setVisiblePlaylist(false)}>
        <View style={{flex: 1}}>
          <View style={[styles.modal, {backgroundColor: bg}]}>
            {props.song.artwork && (
              <View style={[styles.artwork, {elevation: 18}]}>
                <Image
                  source={{uri: props.song.artwork}}
                  style={{width: '100%', height: '100%', borderRadius: 5}}
                />
              </View>
            )}
            <Text
              style={{
                marginTop: props.song.artwork ? '21%' : 20,
                fontWeight: '700',
                textAlign: 'center',
                width: '80%',
                color: '#121212',
              }}
              numberOfLines={1}>
              {props.song.title}
            </Text>
            <Text style={{fontWeight: '700', fontSize: 12, color: '#6b6b6b'}}>
              {props.song.album || 'unknown'}
            </Text>
            {playlist.length > 0 ? (
              <FlatList
                data={playlist}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => (
                  <View
                    style={[
                      styles.item,
                      {
                        marginBottom: playlist.length - 1 === index ? 50 : 0,
                        marginTop: index === 0 ? 20 : 2,
                      },
                    ]}
                    key={index}>
                    <Text style={[styles.txt, {fontSize: 14}]}>{item}</Text>
                    <TouchableOpacity
                      onPress={() => onAdd(item)}
                      style={{
                        padding: 25,
                        paddingBottom: 4,
                        paddingTop: 4,
                        borderRadius: 20,
                        backgroundColor: '#2EC7FC',
                        position: 'absolute',
                        right: 20,
                      }}
                      activeOpacity={0.7}>
                      <Text style={{color: '#fff'}}>Add</Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item) => item}
              />
            ) : (
              <Text style={{color: '#999', marginTop: '10%'}}>
                No Playlist found !!!
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  modal: {
    height: '50%',
    width: '100%',
    borderRadius: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
    elevation: 18,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'column',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  item: {
    width: Dimensions.get('window').width,
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  txt: {
    padding: 15,
    fontSize: 12,
    fontWeight: '700',
    color: '#5b5b5b',
    textTransform: 'capitalize',
  },
  artwork: {
    width: '50%',
    height: 200,

    position: 'absolute',
    top: '-30%',
    borderRadius: 5,
  },
});
