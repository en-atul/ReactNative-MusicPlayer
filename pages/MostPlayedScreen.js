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
import BottomMenu from '../components/BottomMenu';
import Menu from 'react-native-vector-icons/Feather';
import {setCurrentTrack, setQueue} from '../redux/actions/playback';
import {withTheme} from 'styled-components/native';
import * as actions from '../redux/actions';
import {connect} from 'react-redux';

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

function MostPlayed(props) {
  const dispatch = useDispatch();
  const {mostPlayed} = useSelector((state) => state.history);
  const {theme} = useSelector((state) => state.settings);

  const {txt, header, bg, bg2, border} = props.theme;

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

  const playAll = () => {
    const arr = mostPlayed
      .filter((data) => data.count > 4)
      .map((data) => data.currentTrack);
    dispatch(setQueue(arr));
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
            Most Played
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
        {mostPlayed.length > 0 ? (
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
              data={mostPlayed}
              renderItem={({item, index}) =>
                item.count > 4 && (
                  <TouchableOpacity
                    onPress={() => push(item.currentTrack)}
                    key={index + 'j'}
                    activeOpacity={1}
                    style={{
                      marginBottom: mostPlayed.length - 1 === index ? 220 : 0,
                    }}>
                    <Item2
                      data={item.currentTrack}
                      index={index}
                      bc={bg2}
                      border={border}
                      txtColor={txt}
                    />
                  </TouchableOpacity>
                )
              }
              keyExtractor={(item) => item.currentTrack.title}
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
export default connect('', actions)(withTheme(React.memo(MostPlayed)));
