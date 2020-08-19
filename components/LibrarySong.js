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
  FlatList,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomMenu from './BottomMenu';
import {setCurrentTrack, setQueue} from '../redux/actions/playback';
import Menu from 'react-native-vector-icons/Feather';
import {withTheme} from 'styled-components/native';
import * as actions from '../redux/actions';
import {connect} from 'react-redux';

function Item({item, bc, border, txtColor}) {
  return (
    <View
      style={[styles.item, {backgroundColor: bc, borderBottomColor: border}]}>
      <View style={styles.left}>
        {item.artwork ? (
          <Image source={{uri: item.artwork}} style={styles.cover} />
        ) : (
          <View style={[styles.cover, {borderColor: border}]}>
            <Icon name="ios-musical-notes-outline" size={30} color={txtColor} />
          </View>
        )}
      </View>

      <View style={styles.mid}>
        <Text
          numberOfLines={1}
          style={{
            width: '90%',
            color: txtColor,
            fontWeight: '700',
            fontFamily: 'sans-serif-light',
            fontSize: 12,
          }}>
          {item.title ? item.title : item.fileName.replace('.mp3', '')}
        </Text>
        <Text numberOfLines={1} style={styles.txt}>
          {item.album ? item.album : 'unknown'}
        </Text>
      </View>

      <View style={styles.right}>
        <BottomMenu song={item} />
      </View>
    </View>
  );
}

function LibrarySong(props) {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data);

  const {songs} = data;
  const {txt, header, bg, bg2, border1, nativeColor} = props.theme;

  const push = (song) => {
    dispatch(setCurrentTrack(song));
  };
  const playAll = async () => {
    dispatch(setQueue(props.route.params.data));
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
            width: '80%',

            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              width: '100%',
              fontWeight: '700',
              fontFamily: 'sans-serif-light',
              fontSize: 18,
              color: bg,
              width: '80%',
            }}
            numberOfLines={1}>
            {props.route.params.title}
          </Text>
        </View>

        <View
          style={{
            width: '10%',
            height: '100%',

            justifyContent: 'center',
            alignItems: 'center',
          }}></View>
      </View>

      <View
        style={{
          marginTop: 64,
          width: '100%',
          height: '100%',
          alignItems: 'center',
        }}>
        {props.route.params.data.length > 0 && (
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
              <Text style={{color: '#fff'}}>
                {props.route.params.data.length === 1 ? 'Play' : 'Play All'}
              </Text>
            </TouchableOpacity>
            <FlatList
              data={props.route.params.data}
              showsHorizontalScrollIndicator={false}
              legacyImplementation={false}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  activeOpacity={1}
                  key={index + 'l'}
                  onPress={() => push(item)}
                  style={{
                    marginBottom:
                      props.route.params.data.length - 1 === index ? 220 : 0,
                  }}>
                  <View>
                    <Item
                      item={item}
                      bc={bg2}
                      border={border1}
                      txtColor={txt}
                    />
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          </>
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
    height: 60,
    backgroundColor: '#fff',
    borderWidth: 0.7,
    borderColor: 'transparent',
    borderBottomColor: '#E1E9EE',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
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
    width: '70%',
    height: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  right: {
    width: '10%',
    height: '100%',
  },
  txt: {
    width: '90%',
    color: '#6b6b6b',
    fontWeight: '700',
    fontFamily: 'sans-serif-light',
    fontSize: 10,
  },
});

export default connect('', actions)(withTheme(React.memo(LibrarySong)));
