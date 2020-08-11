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
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {addPlaylist, deletePlaylist} from '../redux/actions/playlist';
import Menu from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'underscore';

export default function PlayistScreen(props) {
  const dispatch = useDispatch();

  const {songs} = useSelector((state) => state.data);
  const {theme} = useSelector((state) => state.settings);

  let data = _.groupBy(songs, 'folder');
  let folder = Object.keys(data);

  const bg = theme !== 'light' ? '#fff' : '#24292e';
  const bg2 = theme !== 'light' ? '#000' : '#fff';
  const txt = theme !== 'light' ? '#fff' : '#212121';
  const txt2 = theme !== 'light' ? '#6b6b6b' : '#212121';
  const border1 = theme !== 'light' ? '#121212' : '#eee';
  const bc = theme !== 'light' ? '#0e0e0e' : '#fafafa';
  const header = theme !== 'light' ? '#000' : '#fff';
  const modal = theme !== 'light' ? '#121212' : '#fff';

  function Item2({data, index, arr, bc, border, txtColor}) {
    let bi = _.groupBy(songs, 'folder');
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
              width: '70%',
              height: 30,

              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff'}} numberOfLines={1}>
              {bi[data].length} {bi[data].length <= 1 ? 'song' : 'songs'}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const navigate = (title, data) => {
    props.navigation.navigate('LibrarySong', {
      title: title,
      data: data,
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
            Folder
          </Text>
        </View>
      </View>

      <View style={{marginTop: 64, width: '100%', height: '100%'}}>
        {folder.length > 0 ? (
          <FlatList
            showsHorizontalScrollIndicator={false}
            legacyImplementation={false}
            data={folder}
            renderItem={({item, index}) =>
              item !== '' && (
                <TouchableOpacity
                  onPress={() => navigate(item, data[item])}
                  key={item}
                  activeOpacity={1}
                  style={{
                    marginBottom: folder.length - 1 === index ? 220 : 0,
                  }}>
                  <Item2
                    data={item}
                    index={index}
                    arr={folder}
                    bc={bg2}
                    border={border1}
                    txtColor={txt}
                  />
                </TouchableOpacity>
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
            <Text style={{color: '#999'}}>No Folder's Found</Text>
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