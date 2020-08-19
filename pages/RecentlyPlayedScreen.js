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
  BackHandler,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {setCurrentTrack, setQueue} from '../redux/actions/playback';
import Menu from 'react-native-vector-icons/Feather';
import BottomMenu from '../components/BottomMenu';
import {withTheme} from 'styled-components/native';

function Item2({data, index, bc, border, txtColor}) {
  return (
    <View
      key={index}
      style={[styles.item, {backgroundColor: bc, borderBottomColor: border}]}>
      <View style={styles.left}>
        <Image source={{uri: data.artwork}} style={styles.cover} />
      </View>
      <View style={styles.mid}>
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
      <View style={styles.right}>
        <BottomMenu song={data} />
      </View>
    </View>
  );
}

function RecentlyPlayed(props) {
  const dispatch = useDispatch();

  const {recentlyPlayed} = useSelector((state) => state.history);
  const {theme} = useSelector((state) => state.settings);

  const {txt, header, bg, bg2, border1} = props.theme;

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, [handleBackButtonClick]);

  const handleBackButtonClick = () => {
    props.navigation.goBack();
    return true;
  };

  const push = (song) => {
    dispatch(setCurrentTrack(song));
  };
  const playAll = async () => {
    dispatch(setQueue(recentlyPlayed));
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
            Recently Played
          </Text>
        </View>
      </View>

      <View
        style={{
          marginTop: 64,
          width: '100%',
          height: '100%',
          alignItems: 'center',
        }}>
        {recentlyPlayed.length > 0 ? (
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
              data={recentlyPlayed}
              renderItem={({item, index}) =>
                item.id !== '' && (
                  <TouchableOpacity
                    onPress={() => push(item)}
                    key={index + 'j'}
                    activeOpacity={1}
                    style={{
                      marginBottom:
                        recentlyPlayed.length - 1 === index ? 220 : 0,
                    }}>
                    <Item2
                      data={item}
                      index={index}
                      bc={bg2}
                      border={border1}
                      txtColor={txt}
                    />
                  </TouchableOpacity>
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
            <Text style={{color: '#999'}}>No Song</Text>
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
  mid: {
    flexDirection: 'column',
    width: '75%',
    height: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  right: {
    width: '10%',
    height: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
export default React.memo(RecentlyPlayed);
