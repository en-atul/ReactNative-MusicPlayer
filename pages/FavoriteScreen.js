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
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {connect} from 'react-redux';
import * as actions from '../redux/actions';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import BottomMenu from '../components/BottomMenu';
import Menu from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import {withTheme} from 'styled-components/native';

import {deleteFavorite} from '../redux/actions/favorite';
import {setCurrentTrack, setQueue} from '../redux/actions/playback';

function Item2({data, index, select, arr, bc, border, txtColor}) {
  return (
    <View
      key={index}
      style={[styles.item, {backgroundColor: bc, borderBottomColor: border}]}>
      <View style={styles.left}>
        <Image source={{uri: data.artwork}} style={styles.cover} />
      </View>
      <View style={styles.right}>
        <Text style={[styles.itemTxt, {color: txtColor}]} numberOfLines={1}>
          {data.title ? data.title : data.fileName.replace('.mp3', '')}
        </Text>
        <Text style={[styles.item2, {width: '90%'}]}>
          {data.album && data.album.trim()}
        </Text>
        <Text style={styles.item2} numberOfLines={1}>
          {data.artist}
        </Text>
      </View>
      <View style={styles.select}>
        {select ? (
          <View
            style={{
              backgroundColor: arr.includes(data.id) ? '#2EC7FC' : '#ecf1f7',
              width: 20,
              height: 20,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {arr.includes(data.id) && (
              <Menu name="check" color="#fff" size={15} />
            )}
          </View>
        ) : (
          <BottomMenu song={data} favoriteHide={true} />
        )}
      </View>
    </View>
  );
}

function FavoriteScreen(props) {
  const [select, setSelect] = React.useState(false);
  const [selectarr, setSelectArr] = React.useState([]);

  const dispatch = useDispatch();
  const {favorite} = useSelector((state) => state.favorite);

  const {bg, bg2, txt, border, header} = props.theme;

  const selectItem = (id) => {
    setSelect(false);
    setSelectArr('');
  };

  const selectId = (id) => {
    if (selectarr.includes(id)) {
      console.log('includes');
      let index = selectarr.findIndex((data) => data === id);
      selectarr.splice(index, 1);
      setSelectArr([...selectarr]);
      selectarr.length === 0 && setSelect(false);
    } else {
      setSelect(true);
      setSelectArr([...selectarr, id]);
    }
  };

  const push = (song) => {
    dispatch(setCurrentTrack(song));
  };

  const playAll = async () => {
    dispatch(setQueue(favorite));
  };

  const deleteAll = () => {
    selectarr.map((data) => {
      dispatch(deleteFavorite(data));
    });
    selectItem();
  };
  const RightActions = ({progress, dragX, id}) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0.7, 0],
    });
    return (
      <>
        <TouchableOpacity
          onPress={() => dispatch(deleteFavorite(id))}
          style={{height: 70}}>
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
  return (
    <View style={[styles.container, {backgroundColor: bg2}]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: header,
            borderColor: 'transparent',
            borderBottomColor: border,
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
            Favorite
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
      </View>

      <View
        style={{
          marginTop: 64,
          width: '100%',
          height: '100%',
          alignItems: 'center',
        }}>
        {favorite.length > 0 ? (
          <>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                width: '40%',
                height: 40,
                borderRadius: 20,
                backgroundColor: '#2EC7FC',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 20,
                elevation: 15,
              }}
              onPress={playAll}>
              <Text style={{color: '#fff'}}> Play All</Text>
            </TouchableOpacity>
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              legacyImplementation={false}
              data={favorite}
              renderItem={({item, index}) =>
                item.id !== '' && (
                  <Swipeable
                    friction={1}
                    rightThreshold={40}
                    renderRightActions={(progress, dragX) => (
                      <RightActions
                        progress={progress}
                        dragX={dragX}
                        id={item.id}
                      />
                    )}
                    onSwipeableRightOpen={() =>
                      console.log('hello world', item.id)
                    }
                    useNativeAnimations>
                    <TouchableOpacity
                      onPress={() => (select ? selectId(item.id) : push(item))}
                      onLongPress={() => selectId(item.id)}
                      key={index + 'j'}
                      activeOpacity={1}
                      style={{
                        marginBottom: favorite.length - 1 === index ? 220 : 0,
                      }}>
                      <Item2
                        data={item}
                        index={index}
                        select={select}
                        arr={selectarr}
                        bc={bg2}
                        border={border}
                        txtColor={txt}
                      />
                    </TouchableOpacity>
                  </Swipeable>
                )
              }
              keyExtractor={(item) => item.id}
            />
          </>
        ) : (
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#999'}}>No Favorite Song</Text>
          </View>
        )}
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

  item: {
    flexDirection: 'row',
    height: 70,
    width: '100%',
    overflow: 'hidden',
    borderWidth: 0.7,
    borderColor: 'transparent',
    backgroundColor: '#fff',
    borderBottomColor: '#ecf1f7',
  },

  itemTxt: {
    marginLeft: 10,
    fontSize: 12,
    width: '90%',
    borderRadius: 10,
    fontFamily: 'sans-serif-medium',
  },

  item2: {
    marginLeft: 10,
    fontSize: 10,
    fontFamily: 'sans-serif-medium',
    color: '#6b6b6b',
    width: '70%',
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
    width: '15%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    flexDirection: 'column',
    width: '75%',
    height: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  select: {
    width: '10%',
    height: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
export default connect('', actions)(withTheme(FavoriteScreen));
