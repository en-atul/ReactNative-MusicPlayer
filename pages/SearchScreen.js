/**atul15r
 * React Native Music Player
 * https://github.com/atul15r
 *7 Aug 2020
 * @format
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Animated,
  Keyboard,
} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Menu from 'react-native-vector-icons/Feather';
import {debounce} from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import Iconn from 'react-native-vector-icons/MaterialIcons';
import Voice from '@react-native-community/voice';
import {insertSearchedFile, deleteSearchedFile} from '../redux/actions/search';
import {setCurrentTrack} from '../redux/actions/playback';
import * as Animatable from 'react-native-animatable';
import BottomMenu from '../components/BottomMenu';

function Item2({data, index, l, color, arr, select, bc, border, txtColor}) {
  return (
    <View
      key={index}
      style={[styles.item, {backgroundColor: bc, borderBottomColor: border}]}>
      <View style={styles.left}>
        <Image source={{uri: data.artwork}} style={styles.cover} />
      </View>
      <View style={styles.right}>
        <Text style={[styles.itemTxt, {color: txtColor}]} numberOfLines={1}>
          {data.title}
        </Text>
        <Text style={[styles.item2, {width: '90%'}]}>
          {data.album ? data.album.trim() : 'unknown'}
        </Text>
        <Text style={styles.item2} numberOfLines={1}>
          {data.artist ? data.artist : 'unknown'}
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
          <BottomMenu song={data} />
        )}
      </View>
    </View>
  );
}

class SearchScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      arr: [],
      movies: [],
      artist: [],
      input: '',
      recognized: false,
      started: false,
      results: [],
      select: false,
      selectarr: [],
    };

    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
  }

  search = React.createRef();

  onSpeechStart(e) {
    this.setState({
      started: true,
    });

    setTimeout(() => {
      this.setState({
        started: false,
      });
      Voice.destroy().then(Voice.removeAllListeners);
    }, 7000);
  }
  onSpeechRecognized(e) {
    this.setState({
      recognized: true,
      started: false,
    });
  }
  onSpeechResults(e) {
    const {results} = this.state;
    this.setState({
      results: e.value,
      started: false,
    });

    console.log(e.value);
    this.handleChange1(String(this.state.results[0]));
    console.log('e.value', this.state.results[0]);
    Voice.destroy().then(Voice.removeAllListeners);
  }
  async _startRecognition(e) {
    this.setState({
      recognized: '',
      started: '',
      results: [],
    });
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
    Keyboard.addListener('keyboardDidHide', () => {
      EventRegister.emit('shift', false);
    });
  }

  componentDidMount() {
    this.focus();
    Keyboard.addListener('keyboardDidShow', () => {
      EventRegister.emit('shift', true);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      EventRegister.emit('shift', false);
    });
  }
  focus = () => {
    this.search.focus();
  };
  handleChange1 = debounce((input) => {
    this.setState({input});
    if (this.state.input.length > 0) {
      const pattern = `[A-Za-z.\s]*${this.state.input.toLowerCase()}[A-Za-z.\s]*`;
      const matchRegEx = new RegExp(pattern);
      const movies = this.props.data.songs.filter((data) =>
        matchRegEx.test(data.title.toLowerCase()),
      );

      this.setState({movies: movies});

      const artist = this.props.data.songs.filter((data) =>
        matchRegEx.test(data.artist !== null && data.artist.toLowerCase()),
      );

      this.setState({artist: artist});
    } else {
      this.setState({movies: '', artist: ''});
    }
  }, 100);

  push = (data) => {
    console.log(data.title);
    this.props.setCurrentTrack(data);
  };

  navigate = (item) => {
    console.log('search saved', item.title);
    this.props.insertSearchedFile(item);
    this.push(item);
  };

  _recentSearchNavigate = (item) => {
    this.push(item);
  };

  cancel = () => {
    this.setState({input: '', movies: '', artist: ''});
    this.search.clear();
  };

  selectItem = () => {
    this.setState({select: false, selectarr: ''});
  };

  selectId = (id) => {
    const {selectarr} = this.state;
    if (selectarr.includes(id)) {
      console.log('includes');
      let index = selectarr.findIndex((data) => data === id);
      selectarr.splice(index, 1);
      this.setState({selectarr: [...selectarr]});
      selectarr.length === 0 && this.setState({select: false});
    } else {
      this.setState({select: true});
      this.setState({selectarr: [...selectarr, id]});
    }
  };
  deleteAll = () => {
    this.state.selectarr.map((data) => {
      this.props.deleteSearchedFile(data);
    });
    this.selectItem();
  };
  render() {
    const RightActions = ({progress, dragX, id}) => {
      const scale = dragX.interpolate({
        inputRange: [-100, 0],
        outputRange: [0.7, 0],
      });

      return (
        <>
          <TouchableOpacity
            onPress={() => this.props.deleteSearchedFile(id)}
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

    const {movies, artist, started, selectarr, select} = this.state;

    const {searched} = this.props.search;
    const {theme} = this.props.settings;

    const bg = theme !== 'light' ? '#fff' : '#24292e';
    const bg2 = theme !== 'light' ? '#000' : '#fff';
    const txt = theme !== 'light' ? '#fff' : '#121212';
    const txt2 = theme !== 'light' ? '#6b6b6b' : '#212121';
    const border1 = theme !== 'light' ? '#121212' : '#eee';
    const bc = theme !== 'light' ? '#0e0e0e' : '#fafafa';
    const header = theme !== 'light' ? '#000' : '#fff';
    const ph = theme !== 'light' ? '#999' : '#BCBABA';
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
            onPress={() => this.props.navigation.openDrawer()}
            style={{
              width: '10%',

              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Menu name="menu" size={27} color={bg} />
          </TouchableOpacity>
          {!select && (
            <View
              style={{
                width: '80%',

                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TextInput
                ref={(input) => {
                  this.search = input;
                }}
                selectionColor="#6b6b6b"
                placeholder="Search songs , artists"
                placeholderTextColor={ph}
                style={[
                  styles.input,
                  {
                    color: bg,
                    backgroundColor: bc,
                    letterSpacing: 1,
                    borderColor: border1,
                  },
                ]}
                onChangeText={(e) => this.handleChange1(e)}
              />
              <Icon
                name="ios-search"
                color={ph}
                size={24}
                style={{fontWeight: '100', position: 'absolute', left: '10%'}}
              />
            </View>
          )}

          {select ? (
            <>
              {selectarr.length > 0 && (
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    height: 64,
                    width: '15%',
                    position: 'absolute',
                    right: '15%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => this.deleteAll()}>
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
                onPress={() => this.selectItem()}>
                <Icon
                  name="ios-close"
                  color={bg}
                  size={30}
                  style={{fontWeight: '100'}}
                />
              </TouchableOpacity>
            </>
          ) : movies.length > 0 || artist.length > 0 ? (
            <TouchableOpacity
              activeOpacity={1}
              style={{
                width: '10%',

                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={this.cancel}>
              <Icon
                name="ios-close"
                color={bg}
                size={30}
                style={{fontWeight: '100'}}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={1}
              style={{
                width: '10%',

                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={this._startRecognition.bind(this)}>
              <Iconn
                name="mic-none"
                color={bg}
                size={23}
                style={{fontWeight: '100'}}
              />
            </TouchableOpacity>
          )}
        </View>

        <View
          style={{
            marginTop: 64,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {!started ? (
            <View
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
              }}>
              {movies.length > 0 || artist.length > 0 ? (
                <View
                  style={{
                    width: '100%',
                  }}>
                  <Text style={[styles.result, {color: bg, marginTop: 15}]}>
                    Results
                  </Text>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    legacyImplementation={false}
                    data={movies}
                    renderItem={({item, index}) =>
                      item.id !== '' && (
                        <TouchableOpacity
                          onPress={(e) => this.navigate(item, e)}
                          key={index + 'j'}
                          activeOpacity={0.7}
                          style={{
                            marginBottom:
                              artist.length > 0
                                ? 0
                                : movies.length - 1 === index
                                ? 220
                                : 0,
                          }}>
                          <Item2
                            data={item}
                            index={index}
                            id={item.id}
                            color={bg}
                            arr={selectarr}
                            select={select}
                            bc={bg2}
                            border={border1}
                            txtColor={txt}
                          />
                        </TouchableOpacity>
                      )
                    }
                    keyExtractor={(item) => item.id}
                    ListFooterComponent={
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        legacyImplementation={false}
                        data={artist}
                        renderItem={({item, index}) =>
                          item.id !== '' && (
                            <TouchableOpacity
                              onPress={(e) => this.navigate(item, e)}
                              key={index + 'p'}
                              activeOpacity={0.7}
                              style={{
                                marginBottom:
                                  artist.length - 1 === index ? 220 : 0,
                              }}>
                              <Item2
                                data={item}
                                index={index}
                                id={item.id}
                                color={bg}
                                arr={selectarr}
                                select={select}
                                bc={bg2}
                                border={border1}
                                txtColor={txt}
                              />
                            </TouchableOpacity>
                          )
                        }
                        keyExtractor={(item) => item.id}
                      />
                    }
                  />
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'column',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // top: 0,
                    // position: 'absolute',
                  }}>
                  {searched.length > 0 && (
                    <Text
                      style={{
                        fontFamily: 'sans-serif-medium',

                        fontStyle: 'italic',
                        color: txt2,
                        marginTop: 20,
                        marginBottom: 10,
                      }}>
                      Recent search
                    </Text>
                  )}
                  <View
                    style={{
                      width: '100%',

                      flexDirection: 'column',
                    }}>
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      legacyImplementation={false}
                      data={searched}
                      renderItem={({item, index}) =>
                        item.title && (
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
                              onPress={(e) =>
                                select
                                  ? this.selectId(item.id)
                                  : this._recentSearchNavigate(item, e)
                              }
                              onLongPress={() => this.selectId(item.id)}
                              key={index + 'l'}
                              activeOpacity={0.7}
                              style={{
                                marginBottom:
                                  searched.length - 1 === index ? 220 : 0,
                              }}>
                              <Item2
                                data={item}
                                index={index}
                                id={item.id}
                                color={bg}
                                arr={selectarr}
                                select={select}
                                bc={bg2}
                                border={border1}
                                txtColor={txt}
                              />
                            </TouchableOpacity>
                          </Swipeable>
                        )
                      }
                      keyExtractor={(item) => item.id}
                    />
                  </View>
                </View>
              )}
            </View>
          ) : (
            <Animatable.View
              style={{fontFamily: 'sans-serif-medium', fontSize: 22}}
              animation="pulse"
              iterationCount={'infinite'}>
              <Iconn name="fiber-smart-record" size={45} color="#ce5454" />
            </Animatable.View>
          )}
        </View>

        {movies.length === 0 && artist.length === 0 && searched.length === 0 && (
          <Text
            style={{
              color: '#6b6b6b',
              fontStyle: 'italic',
              width: '50%',
              lineHeight: 20,
              position: 'absolute',
              bottom: '50%',
              textAlign: 'center',
            }}>
            search song by specifying song name or artist name.
          </Text>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
    height: 70,
    width: '100%',
    overflow: 'hidden',

    borderWidth: 0.7,
    borderColor: 'transparent',
    borderBottomColor: '#ecf1f7',
    backgroundColor: '#fff',
  },

  itemTxt: {
    marginLeft: 10,
    fontSize: 12,

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
    // borderWidth: 0.7,
    // borderColor: '#eee',
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
SearchScreen.propTypes = {
  data: PropTypes.object.isRequired,
  insertSearchedFile: PropTypes.func.isRequired,
  deleteSearchedFile: PropTypes.func.isRequired,
  setCurrentTrack: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  search: state.search,
  data: state.data,
  settings: state.settings,
});

const mapActionsToProps = {
  insertSearchedFile,
  deleteSearchedFile,
  setCurrentTrack,
};
export default connect(mapStateToProps, mapActionsToProps)(SearchScreen);
