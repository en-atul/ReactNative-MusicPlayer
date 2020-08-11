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
  TextInput,
  FlatList,
  Animated,
  Keyboard,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  addPlaylist,
  deletePlaylist,
  deletePlaylistSong,
} from '../redux/actions/playlist';
import Menu from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import {EventRegister} from 'react-native-event-listeners';
import Toast from '../components/Toast';
import Modal from 'react-native-modal';

import Swipeable from 'react-native-gesture-handler/Swipeable';

export default function PlayistScreen(props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  const [select, setSelect] = React.useState(false);
  const [selectarr, setSelectArr] = React.useState([]);

  const dispatch = useDispatch();
  const {playlist, playlistSongs} = useSelector((state) => state.playlist);
  const {theme} = useSelector((state) => state.settings);

  const bg = theme !== 'light' ? '#fff' : '#24292e';
  const bg2 = theme !== 'light' ? '#000' : '#fff';
  const txt = theme !== 'light' ? '#fff' : '#212121';
  const txt2 = theme !== 'light' ? '#6b6b6b' : '#212121';
  const border1 = theme !== 'light' ? '#121212' : '#eee';
  const bc = theme !== 'light' ? '#0e0e0e' : '#fafafa';
  const header = theme !== 'light' ? '#000' : '#fff';
  const modal = theme !== 'light' ? '#121212' : '#fff';

  React.useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      EventRegister.emit('shift', true);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      EventRegister.emit('shift', false);
    });
    return () => {
      Keyboard.addListener('keyboardDidHide', () => {
        EventRegister.emit('shift', false);
      });
    };
  }, [Keyboard]);

  function Item2({data, index, l, color, select, arr, bc, border, txtColor}) {
    return (
      <View
        key={index}
        style={[styles.item, {backgroundColor: bc, borderBottomColor: border}]}>
        <View style={styles.left}>
          <Text style={[styles.itemTxt, {color: txtColor}]} numberOfLines={1}>
            {data}
          </Text>
        </View>
        <View style={styles.select}>
          <View
            style={{
              backgroundColor: '#2EC7FC',
              width: select ? '50%' : '70%',
              height: 30,

              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff'}} numberOfLines={1}>
              {playlistSongs.filter((value) => value.db === data).length}{' '}
              {playlistSongs.filter((value) => value.db === data).length <= 1
                ? 'song'
                : 'songs'}
            </Text>
          </View>
          {select && (
            <View
              style={{
                backgroundColor: arr.includes(data) ? '#2EC7FC' : '#ecf1f7',
                width: 20,
                height: 20,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                right: 15,
              }}>
              {arr.includes(data) && (
                <Menu name="check" color="#fff" size={15} />
              )}
            </View>
          )}
        </View>
      </View>
    );
  }

  const selectItem = (id) => {
    setSelect(false);
    setSelectArr('');
  };

  const selectId = (id) => {
    if (selectarr.includes(id)) {
      let index = selectarr.findIndex((data) => data === id);
      selectarr.splice(index, 1);
      setSelectArr([...selectarr]);
      selectarr.length === 0 && setSelect(false);
    } else {
      setSelect(true);
      setSelectArr([...selectarr, id]);
    }
  };
  const create = () => {
    setOpen(false);

    if (playlist.some((data) => data === value.toLowerCase().trim())) {
      Toast(`Playlist already created`);
    } else {
      dispatch(addPlaylist(value.toLowerCase().trim()));
    }
  };

  const deletePlaylistByName = (data) => {
    const arr = playlistSongs.filter((data2) => data2.db === data);
    arr.map((song) => {
      dispatch(deletePlaylistSong(song.id));
    });
    dispatch(deletePlaylist(data));
  };

  const RightActions = ({progress, dragX, id}) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0.7, 0],
    });
    return (
      <>
        <TouchableOpacity
          onPress={() => deletePlaylistByName(id)}
          style={{height: 60}}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              borderWidth: 0.7,
              borderColor: 'transparent',
              borderBottomColor: '#ecf1f7',
              backgroundColor: '#ff5d72',
            }}>
            <Animated.View
              style={{
                paddingHorizontal: 10,

                transform: [{scale}],
              }}>
              <Menu name="trash" color="#fff" size={50} />
            </Animated.View>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const deleteAll = () => {
    selectarr.map((data) => {
      const arr = playlistSongs.filter((data2) => data2.db === data);
      arr.map((song) => {
        dispatch(deletePlaylistSong(song.id));
      });
      dispatch(deletePlaylist(data));
    });
    selectItem();
  };
  const navigate = (item) => {
    props.navigation.navigate('PlaylistSong', {
      data: item,
    });
  };
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
              color: bg,
            }}>
            Playlist
          </Text>
        </View>

        {select && (
          <>
            {selectarr.length > 0 && (
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  width: '15%',

                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => deleteAll()}>
                <Menu
                  name="check"
                  color={bg}
                  size={30}
                  style={{fontWeight: '100'}}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{
                width: '15%',
                position: 'absolute',
                right: 0,
                height: 64,

                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => selectItem()}>
              <Icon
                name="ios-close"
                color={bg}
                size={30}
                style={{fontWeight: '100'}}
              />
            </TouchableOpacity>
          </>
        )}
        {!select && (
          <TouchableOpacity
            activeOpacity={1}
            style={{
              width: '15%',
              position: 'absolute',
              right: 0,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => setOpen(true)}>
            <Icon name="add" color={bg} size={30} style={{fontWeight: '100'}} />
          </TouchableOpacity>
        )}
      </View>

      <View style={{marginTop: 64, width: '100%', height: '100%'}}>
        {playlist.length > 0 ? (
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            legacyImplementation={false}
            data={playlist}
            renderItem={({item, index}) =>
              item !== '' && (
                <Swipeable
                  renderRightActions={(progress, dragX) => (
                    <RightActions progress={progress} dragX={dragX} id={item} />
                  )}
                  key={index}
                  useNativeAnimations>
                  <TouchableOpacity
                    onPress={() => (select ? selectId(item) : navigate(item))}
                    onLongPress={() => selectId(item)}
                    key={item}
                    activeOpacity={1}
                    style={{
                      marginBottom: playlist.length - 1 === index ? 220 : 0,
                    }}>
                    <Item2
                      data={item}
                      index={index}
                      id={item}
                      color="#24292e"
                      select={select}
                      arr={selectarr}
                      bc={bg2}
                      border={border1}
                      txtColor={txt}
                    />
                  </TouchableOpacity>
                </Swipeable>
              )
            }
            keyExtractor={(item) => item}
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#999'}}>No Playlist</Text>
          </View>
        )}

        <Modal
          isVisible={open}
          onBackdropPress={() => setOpen(false)}
          onBackButtonPress={() => setOpen(false)}
          backdropColor={bg2}
          backdropOpacity={0.7}>
          <View
            style={{
              height: 200,
              backgroundColor: modal,
              width: '100%',
              borderRadius: 4,
              justifyContent: 'flex-start',
              alignItems: 'center',
              elevation: 18,
              position: 'absolute',
              bottom: '10%',
            }}>
            <Text
              style={{
                color: '#121212',
                padding: 15,
                marginTop: 10,
                color: '#6b6b6b',
                fontSize: 17,
                position: 'absolute',
                left: 10,
              }}>
              Create Playlist
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: 'transparent',
                borderBottomColor: '#eee',
                width: '80%',
                marginTop: '20%',
                paddingLeft: 10,
              }}
              onChangeText={(e) => setValue(e)}
            />
            <View
              style={{
                borderRadius: 5,
                width: '80%',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginTop: 10,
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  borderRadius: 5,
                  width: '47%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                }}
                onPress={() => setOpen(false)}>
                <Text style={{color: '#6b6b6b', fontSize: 17}}>cancel</Text>
              </TouchableOpacity>
              <View
                style={{width: 1, height: '50%', backgroundColor: '#ccc'}}
              />
              <TouchableOpacity
                style={{
                  borderRadius: 5,
                  width: '47%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                }}
                onPress={() => create()}>
                <Text style={{color: '#6b6b6b', fontSize: 17}}>create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  },
  input: {
    width: '90%',
    height: 40,
    borderRadius: 7,
    borderColor: '#eee',
    textAlign: 'center',
    borderWidth: 1,

    backgroundColor: '#fdfdfd',
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
    textTransform: 'capitalize',
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
