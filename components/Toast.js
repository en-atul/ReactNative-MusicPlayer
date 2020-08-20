/**atul15r
 * React Native Music Player
 * https://github.com/atul15r
 *7 Aug 2020
 * @format
 * @flow
 */

import {ToastAndroid} from 'react-native';

export default function RenderToast(message) {
  ToastAndroid.showWithGravityAndOffset(
    message,
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM,
    0,
    300,
  );
}
