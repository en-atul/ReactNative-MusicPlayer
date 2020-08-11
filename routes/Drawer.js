/**atul15r
 * React Native Music Player
 * https://github.com/atul15r
 *7 Aug 2020
 * @format
 * @flow
 */

import * as React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {ThemeProvider} from 'styled-components/native';
import * as themes from '../themes';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {EventRegister} from 'react-native-event-listeners';

import MainScreen from '../pages/MainScreen';
import SettingScreen from '../pages/SettingScreen';
import FavoriteScreen from '../pages/FavoriteScreen';
import PlaylistScreen from '../pages/PlaylistScreen';
import SearchScreen from '../pages/SearchScreen';
import RecentlyPlayedScreen from '../pages/RecentlyPlayedScreen';
import MostPlayedScreen from '../pages/MostPlayedScreen';
import LibraryScreen from '../pages/LibraryScreen';
import Album from '../pages/AlbumScreen';
import Artist from '../pages/ArtistScreen';
import Folder from '../pages/FolderScreen';

import PlaylistSong from '../components/PlaylistSong';
import AddSongToPlaylist from '../components/AddSongToPlaylist';
import LibrarySong from '../components/LibrarySong';

import Ion from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/AntDesign';
import Custom from './custom';
import Iconn from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeIcon from '../icon';

import {useSelector} from 'react-redux';
import {useIsDrawerOpen} from '@react-navigation/drawer';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createMaterialBottomTabNavigator();

function MyDrawer() {
  const {theme} = useSelector((state) => state.settings);

  const bg = theme !== 'light' ? '#000' : '#fdfdfd';
  const drawerbg = theme !== 'light' ? '#000' : '#fff';
  const color = theme !== 'light' ? '#29292a' : '#6b6b6b';
  const active = theme !== 'light' ? '#6b6b6b' : '#000';
  const fullBack = theme !== 'light' ? '#000000' : '#00000000';
  const bg2 = theme !== 'light' ? '#6b6b6b' : '#6b6b6b';
  const border = theme !== 'light' ? '#0e0e0e' : '#f0f0f3';
  const inactive = theme !== 'light' ? '#191818' : '#b9b9b9';

  function libStack() {
    return (
      <Stack.Navigator headerMode="none">
        <>
          <Stack.Screen name="Lib" component={LibraryScreen} />
          <Stack.Screen
            name="Album"
            component={Album}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />

          <Stack.Screen
            name="Artist"
            component={Artist}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />
          <Stack.Screen
            name="Folder"
            component={Folder}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />

          <Stack.Screen
            name="MostPlayed"
            component={MostPlayedScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />
          <Stack.Screen
            name="RecentlyPlayed"
            component={RecentlyPlayedScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />

          <Stack.Screen
            name="LibrarySong"
            component={LibrarySong}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />
        </>
      </Stack.Navigator>
    );
  }

  createTab = () => (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor={bg2}
      inactiveColor={inactive}
      shifting={false}
      backBehavior="history"
      barStyle={{
        backgroundColor: bg,
        fontSize: 7,
        borderColor: 'transparent',
        borderTopColor: border,
        borderWidth: 0.5,
        height: 60,
      }}>
      <Tab.Screen
        name="Track"
        component={MainScreen}
        options={{
          tabBarLabel: 'Track',
          tabBarIcon: ({focused, tintColor}) => (
            <Iconn
              name="music-circle-outline"
              color={focused ? bg2 : inactive}
              size={23}
              style={{fontWeight: '100'}}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({focused, tintColor}) => (
            <Icon
              name="search1"
              color={focused ? bg2 : inactive}
              size={21}
              style={{fontWeight: '100'}}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Library"
        component={libStack}
        options={{
          tabBarLabel: 'Library',
          tabBarIcon: ({focused, tintColor}) => (
            <Icon
              name="minuscircleo"
              color={focused ? bg2 : inactive}
              size={21}
              style={{fontWeight: '100'}}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Playlist"
        component={PlaylistScreen}
        options={{
          tabBarLabel: 'Playlist',
          tabBarIcon: ({focused, tintColor}) => (
            <Iconn
              name="playlist-music-outline"
              color={focused ? bg2 : inactive}
              size={25}
              style={{fontWeight: '100'}}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{
          tabBarLabel: 'Favorite',
          tabBarIcon: ({focused, tintColor}) => (
            <Ion
              name="heart-outline"
              color={focused ? bg2 : inactive}
              size={23}
              style={{fontWeight: '100'}}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );

  function createStack() {
    const isDrawerOpen = useIsDrawerOpen();
    React.useEffect(() => {
      if (isDrawerOpen) {
        EventRegister.emit('hide', true);
      } else {
        EventRegister.emit('hide', false);
      }
    }, [isDrawerOpen]);
    return (
      <Stack.Navigator headerMode="none">
        <>
          <Stack.Screen name="Main" children={createTab} />

          <Stack.Screen
            name="PlaylistSong"
            component={PlaylistSong}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />
          <Stack.Screen
            name="AddSongToPlaylist"
            component={AddSongToPlaylist}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />
        </>
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <ThemeProvider theme={themes[theme]}>
        <Drawer.Navigator
          drawerStyle={{
            height: '100%',
            width: '60%',
            backgroundColor: drawerbg,
            zIndex: 9,
          }}
          drawerContentOptions={{
            activeTintColor: active,
            backgroundColor: fullBack,
            inactiveTintColor: color,
            labelStyle: {
              fontSize: 13,
              marginLeft: -17,
              fontFamily: 'sans-serif-medium',
            },
            activeBackgroundColor: '#00000000',
          }}
          drawerContent={(props) => <Custom {...props} />}
          initialRouteName="Home"
          // drawerType="slide"
          overlayColor="#0000004a"
          edgeWidth={0}
          backBehavior="initialRoute">
          <Drawer.Screen
            name="Home"
            children={createStack}
            options={{
              drawerIcon: ({focused, color}) => (
                <HomeIcon
                  name="home"
                  size={13}
                  color={color}
                  style={{marginLeft: 12}}
                />
              ),
            }}
          />

          <Drawer.Screen
            name="Setting"
            component={SettingScreen}
            options={{
              drawerIcon: ({focused, color}) => (
                <Icon
                  name="setting"
                  size={15}
                  color={color}
                  style={{marginLeft: 10}}
                />
              ),
            }}
          />
        </Drawer.Navigator>
      </ThemeProvider>
    </NavigationContainer>
  );
}

export default MyDrawer;
