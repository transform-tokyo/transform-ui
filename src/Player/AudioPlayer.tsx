import React, { useEffect, useRef, useState } from 'react';

import Slider from '../Slider/Slider';

interface AudioPlayerProps {
  src: string;
  title?: string;
}

function timeTranslate(t?: number) {
  // 时间转化
  if (!t) return '00:00';
  let m = Math.floor(t / 60);
  return `${m < 10 ? '0' + m : m}:${((t % 60) / 100).toFixed(2).slice(-2)}`;
}

const AudioPlayer: React.FC<AudioPlayerProps> = props => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasBgRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(100);

  const play = () => {
    audioRef.current?.play();
    setPlaying(true);
  };

  const pause = () => {
    audioRef.current?.pause();
    setPlaying(false);
  };

  const handleCurrentTime = (value: number) => {
    const newCurrentTime = (value * duration) / 100;
    audioRef.current!.currentTime = newCurrentTime;
    setCurrentTime(newCurrentTime);
  };

  const handleVolume = (value: number) => {
    audioRef.current!.volume = value / 100;
    setVolume(value);
  };

  useEffect(() => {
    const durationListener = () => {
      // 获取视频总时长
      setDuration(audioRef.current?.duration || 0);
      // 音频示波器
      // H5 Audio API 载入音频文件
      const audioCtx = new window.AudioContext();
      const audioSrc = audioCtx.createMediaElementSource(audioRef.current!);
      const analyser = audioCtx.createAnalyser();
      const ctx = canvasRef.current!.getContext('2d')!;
      audioSrc.connect(analyser);
      audioSrc.connect(audioCtx.destination);
      analyser.fftSize = 256;
      // canvas自适应容器大小
      canvasRef.current!.width = canvasBgRef.current!.clientWidth;
      canvasRef.current!.height = canvasBgRef.current!.clientHeight;
      // 使用canvas绘制波形效果
      const bufferLength = analyser.frequencyBinCount; // 读取波形
      const dataArray = new Uint8Array(bufferLength);

      function renderFrame() {
        requestAnimationFrame(renderFrame);
        const WIDTH = canvasBgRef.current?.clientWidth || 0;
        const HEIGHT = canvasBgRef.current?.clientHeight || 0;
        let barWidth = (WIDTH / bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        analyser.getByteFrequencyData(dataArray);
        ctx.fillStyle = '#000';
        ctx?.fillRect(0, 0, WIDTH, (HEIGHT * 2) / 3);
        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];
          const r = barHeight + 25 * (i / bufferLength);
          const g = 250 * (i / bufferLength);
          const b = 50;
          ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
          ctx.fillRect(x, (HEIGHT * 2) / 3 - barHeight, barWidth, barHeight);
          x += barWidth + 1;
        }
      }
      renderFrame();
    };
    const currentTimeListener = () => {
      // 监听视频播放过程中的时间
      setCurrentTime(audioRef.current?.currentTime || 0);
    };
    audioRef.current?.addEventListener('loadedmetadata', durationListener);
    audioRef.current?.addEventListener('timeupdate', currentTimeListener);
    return () => {
      audioRef.current?.removeEventListener('loadedmetadata', durationListener);
      audioRef.current?.removeEventListener('timeupdate', currentTimeListener);
    };
  }, [audioRef.current, canvasRef.current, setDuration, setCurrentTime]);

  useEffect(() => {
    const handleCanvasSize = () => {
      canvasRef.current!.width = canvasBgRef.current!.clientWidth;
      canvasRef.current!.height = canvasBgRef.current!.clientHeight;
    };
    window.addEventListener('resize', handleCanvasSize);
    return () => {
      window.removeEventListener('resize', handleCanvasSize);
    };
  }, []);

  return (
    <div className="media-player">
      <div className="audio-player" ref={canvasBgRef}>
        <canvas width="1000" height="600" ref={canvasRef}>
          您的浏览器不支持canvas标签，推荐使用最新版本的chrome浏览器
        </canvas>
        <audio src={props.src} ref={audioRef} crossOrigin="anonymous" />
      </div>
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

export default AudioPlayer;
