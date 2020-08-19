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
import Icon4 from 'react-native-vector-icons/MaterialIcons';

import Share from 'react-native-share';
import TrackPlayer from 'react-native-track-player';
import {useSelector, useDispatch} from 'react-redux';
import {addFavorite} from '../redux/actions/favorite';
import Toast from './Toast';

export default function BottomMenuPlaylist(props) {
  const dispatch = useDispatch();

  const [visible, setVisible] = React.useState(false);
  const {favorite} = useSelector((state) => state.favorite);

  function onShare() {
    Share.open({
      url: `file://${props.song.url}`,
      type: 'audio/mp3',
      failOnCancel: false,
    });
  }

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

  const _AddToQueue = () => {
    setVisible(false);
    TrackPlayer.add(props.song);
    Toast(`Added to queue`);
  };

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
        backdropColor="#fff"
        style={{margin: 0}}
        animationInTiming={500}
        animationOutTiming={500}
        hideModalContentWhileAnimating={true}
        useNativeDriver={true}
        onBackButtonPress={() => setVisible(false)}
        onBackdropPress={() => setVisible(false)}>
        <View style={{flex: 1}}>
          <View style={styles.modal}>
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

            <TouchableOpacity onPress={_AddFavorite} style={styles.item}>
              <Icon2
                name="heart-outline"
                size={25}
                style={{marginLeft: 10, color: '#5b5b5b'}}
              />
              <Text style={styles.txt}>Add to Favorite</Text>
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
    backgroundColor: '#fff',
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
