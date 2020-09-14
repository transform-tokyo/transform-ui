import React, { useEffect, useRef, useState } from 'react';

import Slider from '../Slider/Slider';

interface VideoPlayerProps {
  src: string;
  title?: string;
}

function timeTranslate(t?: number) {
  // 时间转化
  if (!t) return '00:00';
  let m = Math.floor(t / 60);
  return `${m < 10 ? '0' + m : m}:${((t % 60) / 100).toFixed(2).slice(-2)}`;
}

const VideoPlayer: React.FC<VideoPlayerProps> = props => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(100);

  const play = () => {
    videoRef.current?.play();
    setPlaying(true);
  };

  const pause = () => {
    videoRef.current?.pause();
    setPlaying(false);
  };

  const handleCurrentTime = (value: number) => {
    const newCurrentTime = (value * duration) / 100;
    videoRef.current!.currentTime = newCurrentTime;
    setCurrentTime(newCurrentTime);
  };

  const handleVolume = (value: number) => {
    videoRef.current!.volume = value / 100;
    setVolume(value);
  };

  useEffect(() => {
    const durationListener = () => {
      // 获取视频总时长
      setDuration(videoRef.current?.duration || 0);
    };
    const currentTimeListener = () => {
      // 监听视频播放过程中的时间
      setCurrentTime(videoRef.current?.currentTime || 0);
    };
    videoRef.current?.addEventListener('loadedmetadata', durationListener);
    videoRef.current?.addEventListener('timeupdate', currentTimeListener);
    return () => {
      videoRef.current?.removeEventListener('loadedmetadata', durationListener);
      videoRef.current?.removeEventListener('timeupdate', currentTimeListener);
    };
  }, [videoRef.current, setDuration, setCurrentTime]);

  return (
    <div className="media-player">
      <video className="video-player" width="100%" height="100%" ref={videoRef}>
        <source src={props.src} />
        <p>您的浏览器不支持HTML5播放视频，推荐使用最新版本的chrome浏览器</p>
      </video>
      <div className="media-controls">
        {/* <!--播放或者暂停按钮--> */}
        <div className="control-btn">
          {!playing ? (
            <i className="icon-font" onClick={play}>
              &#xea49;
            </i>
          ) : (
            <i className="icon-font" onClick={pause}>
              &#xea5c;
            </i>
          )}
        </div>
        {/* <!-- 视频进度条 --> */}
        <div className="control-progress">
          <span>{timeTranslate(currentTime)}</span>
          <Slider
            value={(currentTime * 100) / duration}
            onDragEnd={handleCurrentTime}
            style={{ margin: '0px 16px' }}
          />
          <span>{timeTranslate(duration)}</span>
        </div>
        {/* <!-- 声音 --> */}
        <div className="control-voice">
          <i className="icon-font">&#xe770;</i>
          <Slider value={volume} onDragEnd={handleVolume} />
        </div>
        {/* <!-- 名称 --> */}
        <div className="control-filename">
          <span>{props.title}</span>
        </div>
        {/* <!-- 推送 --> */}
        <div className="control-push">{/* <button>开启同步</button> */}</div>
      </div>
    </div>
  );
};

export default VideoPlayer;
