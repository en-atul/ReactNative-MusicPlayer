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
<<<<<<< HEAD
import Menu from 'react-native-vector-icons/Feather';
import {withTheme} from 'styled-components/native';
import * as actions from '../redux/actions';
import {connect} from 'react-redux';
import _ from 'underscore';

=======
import {addPlaylist, deletePlaylist} from '../redux/actions/playlist';
import Menu from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';

import Modal from 'react-native-modal';
import _ from 'underscore';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import {ScrollView} from 'react-native-gesture-handler';

>>>>>>> e0c0a82c551a5a291a3236d8014f4705c922282f
const arr = [
  {id: 'album', nav: 'Album'},
  {id: 'artist', nav: 'Artist'},
  {id: 'folder', nav: 'Folder'},
  {id: 'most played', nav: 'MostPlayed'},
  {id: 'recently played', nav: 'RecentlyPlayed'},
];

<<<<<<< HEAD
function LibraryScreen(props) {
=======
export default function PlayistScreen(props) {
>>>>>>> e0c0a82c551a5a291a3236d8014f4705c922282f
  const [select, setSelect] = React.useState(false);

  const dispatch = useDispatch();
  const {songs} = useSelector((state) => state.data);
  const {theme} = useSelector((state) => state.settings);
  const {albums, artists} = useSelector((state) => state.data);
  const {recentlyPlayed, mostPlayed} = useSelector((state) => state.history);

<<<<<<< HEAD
  const {txt, header, bg, bg2, border1} = props.theme;
=======
  const bg = theme !== 'light' ? '#fff' : '#24292e';
  const bg2 = theme !== 'light' ? '#000' : '#fff';
  const txt = theme !== 'light' ? '#fff' : '#212121';
  const txt2 = theme !== 'light' ? '#6b6b6b' : '#212121';
  const border1 = theme !== 'light' ? '#121212' : '#eee';
  const bc = theme !== 'light' ? '#0e0e0e' : '#fafafa';
  const header = theme !== 'light' ? '#000' : '#fff';
  const modal = theme !== 'light' ? '#121212' : '#fff';
>>>>>>> e0c0a82c551a5a291a3236d8014f4705c922282f

  let data = _.groupBy(songs, 'folder');
  let folder = Object.keys(data);

  function Item2({data, index, arr, bc, border, txtColor}) {
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
              {data === 'most played'
                ? arr.filter((data) => data.count > 4).length
                : arr.length}{' '}
              {arr.length <= 1
                ? data === 'recently played' || data === 'most played'
                  ? 'song'
                  : data
                : data === 'recently played' || data === 'most played'
                ? 'songs'
                : data}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const navigate = (item) => {
    props.navigation.navigate(item);
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
            Library
          </Text>
        </View>
      </View>

      <View style={{marginTop: 64, width: '100%', height: '100%'}}>
        {arr.length > 0 ? (
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            legacyImplementation={false}
            data={arr}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => navigate(item.nav)}
                key={item}
                activeOpacity={1}
                style={{
                  marginBottom: arr.length - 1 === index ? 220 : 0,
                }}>
                <Item2
                  data={item.id}
                  index={index}
                  arr={
                    item.id === 'album'
                      ? albums
                      : item.id === 'artist'
                      ? artists
                      : item.id === 'folder'
                      ? folder
                      : item.id === 'recently played'
                      ? recentlyPlayed
                      : mostPlayed
                  }
                  bc={bg2}
                  border={border1}
                  txtColor={txt}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
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
<<<<<<< HEAD
export default connect('', actions)(withTheme(LibraryScreen));
=======
>>>>>>> e0c0a82c551a5a291a3236d8014f4705c922282f
