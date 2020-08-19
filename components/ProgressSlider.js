import React from 'react';
import {Dimensions} from 'react-native';
import styled, {withTheme} from 'styled-components/native';
import {connect} from 'react-redux';
import * as actions from '../redux/actions';
import TrackPlayer, {ProgressComponent} from 'react-native-track-player';
import Slider from 'react-native-slider';
import {contrastTransColor} from '../themes/styles';
import * as Animatable from 'react-native-animatable';

const ScreenWidth = Dimensions.get('window').width;
const SliderWidth = ScreenWidth;

class ProgressSlider extends ProgressComponent {
  txt = React.createRef();

  msToSec(ms) {
    return parseInt(ms / 1000, 10);
  }

  secToTime(secs) {
    if (secs < 0) {
      return '0:00';
    }
    let minutes = Math.floor(secs / 60);
    let seconds = Math.floor(secs % 60);
    return seconds <= 9 ? `${minutes}:0${seconds}` : `${minutes}:${seconds}`;
  }

  timePassed(duration) {
    return this.secToTime(this.getProgress() * this.msToSec(duration));
  }

  secToTimeDuration(duration) {
    let timeInSeconds = this.msToSec(duration);
    return this.secToTime(timeInSeconds);
  }

  seekTo = (value) => {
    let seekPosition = value * this.msToSec(this.props.currentTrack.duration);
    TrackPlayer.seekTo(seekPosition);
  };

  onSlidingStart = async () => {
    console.log('sliding started');
    this.txt.fadeIn();
    this.txt.setNativeProps({
      style: {
        display: 'flex',
      },
    });
  };
  onSlidingFinish = async () => {
    this.txt.fadeOut();
    this.txt.setNativeProps({
      style: {
        display: 'none',
      },
    });
  };

  render() {
    const {currentTrack, theme} = this.props;
    return (
      <Wrapper>
        <Animatable.View ref={(c) => (this.txt = c)} style={styles.timer}>
          <Time
            style={{
              marginLeft: 4,
              fontWeight: '700',
              fontStyle: 'italic',
              backgroundColor: '#fafafa',
              borderWidth: 1,
              borderColor: '#eee',
              borderRadius: 50,
              padding: 8,
              paddingTop: 2,
              paddingBottom: 2,
            }}>
            {this.timePassed(currentTrack.duration)}
          </Time>
          <Time
            style={{
              marginRight: 4,
              fontWeight: '700',
              fontStyle: 'italic',
              backgroundColor: '#fafafa',
              borderWidth: 1,
              borderColor: '#eee',
              borderRadius: 50,
              padding: 8,
              paddingTop: 2,
              paddingBottom: 2,
            }}>
            {this.secToTimeDuration(currentTrack.duration)}
          </Time>
        </Animatable.View>
        <Slider
          value={this.getProgress()}
          style={styles.sliderStyle}
          minimumTrackTintColor={theme.contrast}
          maximumTrackTintColor={`${theme.contrastTrans}0.3)`}
          thumbTouchSize={styles.thumbSize}
          trackStyle={styles.barStyle}
          thumbStyle={styles.thumbStyle}
          onValueChange={this.seekTo}
          onSlidingStart={this.onSlidingStart}
          onSlidingComplete={this.onSlidingFinish}
        />
      </Wrapper>
    );
  }
}

function mapStateToProps({playback}) {
  return {currentTrack: playback.currentTrack};
}

export default connect(mapStateToProps, actions)(withTheme(ProgressSlider));

const Wrapper = styled.View`
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 45.6px;
`;

const Time = styled.Text`
  font-family: 'ProductSans';
  font-size: 12px;
  color: #616161;
  margin-top: -5px;
`;

const styles = {
  sliderStyle: {
    width: SliderWidth,
  },
  timer: {
    display: 'none',
    width: SliderWidth,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  thumbSize: {
    width: ScreenWidth * 1.5,
    height: 40,
  },
  barStyle: {
    height: 1,
    borderRadius: 0,
  },
  thumbStyle: {
    height: 0,
    width: 0,
  },
};
