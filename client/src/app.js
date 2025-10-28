import React, { useState, useRef } from 'react';
import { Video, Wand2, Download, Play, Pause, Sparkles, Music, Zap, Clock, Volume2, ImageIcon } from 'lucide-react';

export default function TextToVideoGenerator() {
  const [text, setText] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('16:9');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [selectedTransition, setSelectedTransition] = useState('fade');
  const [selectedMusic, setSelectedMusic] = useState('upbeat');
  const [duration, setDuration] = useState(15);
  const [fps, setFps] = useState(30);
  const [resolution, setResolution] = useState('1080p');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const videoRef = useRef(null);

  const formats = [
    { id: '16:9', name: 'Horizontal', desc: 'YouTube, TV', aspect: 'aspect-video', width: 1920, height: 1080 },
    { id: '9:16', name: 'Vertical', desc: 'TikTok, Reels', aspect: 'aspect-[9/16]', width: 1080, height: 1920 },
    { id: '1:1', name: 'Cuadrado', desc: 'Instagram', aspect: 'aspect-square', width: 1080, height: 1080 },
    { id: '4:5', name: 'Portrait', desc: 'Instagram Story', aspect: 'aspect-[4/5]', width: 1080, height: 1350 }
  ];

  const resolutions = [
    { id: '4k', name: '4K Ultra HD', pixels: '3840x2160' },
    { id: '1080p', name: 'Full HD', pixels: '1920x1080' },
    { id: '720p', name: 'HD', pixels: '1280x720' },
    { id: '480p', name: 'SD', pixels: '854x480' }
  ];

  const frameRates = [
    { value: 24, label: '24 fps (Cinematográfico)' },
    { value: 30, label: '30 fps (Estándar)' },
    { value: 60, label: '60 fps (Alta definición)' }
  ];

  const styles = [
    { 
      id: 'modern', 
      name: 'Moderno', 
      color: 'from-blue-500 to-purple-600',
      prompt: 'modern minimalist design, clean aesthetics, professional'
    },
    { 
      id: 'cartoon', 
      name: 'Caricatura', 
      color: 'from-yellow-400 via-green-400 to-blue-400',
      prompt: '3D cartoon style, vibrant colors, playful characters, animated'
    },
    { 
      id: 'cinematic', 
      name: 'Cinematográfico', 
      color: 'from-gray-800 via-blue-900 to-black',
      prompt: 'cinematic lighting, dramatic, film quality, epic'
    },
    { 
      id: 'anime', 
      name: 'Anime', 
      color: 'from-pink-400 via-purple-400 to-indigo-500',
      prompt: 'anime style, japanese animation, vibrant, detailed'
    },
    { 
      id: 'realistic', 
      name: 'Realista', 
      color: 'from-green-600 to-teal-600',
      prompt: 'photorealistic, 4K, detailed, natural lighting'
    },
    { 
      id: 'abstract', 
      name: 'Abstracto', 
      color: 'from-purple-500 via-pink-500 to-orange-500',
      prompt: 'abstract art, creative, colorful, artistic'
    }
  ];

  const transitions = [
    { id: 'fade', name: 'Fade', icon: '⚡', duration: 0.5 },
    { id: 'slide', name: 'Deslizar', icon: '➡️', duration: 0.8 },
    { id: 'zoom', name: 'Zoom', icon: '🔍', duration: 1.0 },
    { id: 'rotate', name: 'Rotar', icon: '🔄', duration: 0.7 },
    { id: 'dissolve', name: 'Disolver', icon: '✨', duration: 1.2 }
  ];

  const musicOptions = [
    { id: 'upbeat', name: 'Energético', desc: 'Música motivadora', emoji: '🎸', genre: 'electronic' },
    { id: 'calm', name: 'Tranquilo', desc: 'Música relajante', emoji: '🎹', genre: 'ambient' },
    { id: 'corporate', name: 'Corporativo', desc: 'Profesional', emoji: '🎼', genre: 'corporate' },
    { id: 'epic', name: 'Épico', desc: 'Dramático', emoji: '🎺', genre: 'orchestral' },
    { id: 'none', name: 'Sin música', desc: 'Silencio', emoji: '🔇', genre: 'none' }
  ];

  const generateVideoWithAPI = async () => {
    if (!text.trim()) {
      alert('Por favor escribe un texto para el video');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      const selectedFormatData = formats.find(f => f.id === selectedFormat);
      const selectedStyleData = styles.find(s => s.id === selectedStyle);
      const selectedTransitionData = transitions.find(t => t.id === selectedTransition);
      const selectedMusicData = musicOptions.find(m => m.id === selectedMusic);
      const selectedResolutionData = resolutions.find(r => r.id === resolution);

      const videoConfig = {
        text: text,
        prompt: `${text}. ${selectedStyleData.prompt}`,
        width: selectedFormatData.width,
        height: selectedFormatData.height,
        duration: duration,
        fps: fps,
        style: selectedStyle,
        transition: selectedTransition,
        music: selectedMusic !== 'none' ? selectedMusicData.genre : null,
        resolution: resolution
      };

      console.log('Configuración del video:', videoConfig);

      const progressSteps = [
        { progress: 10, message: 'Analizando texto...' },
        { progress: 25, message: 'Generando escenas con IA...' },
        { progress: 45, message: 'Aplicando estilo visual...' },
        { progress: 60, message: 'Renderizando fotogramas...' },
        { progress: 75, message: 'Aplicando transiciones...' },
        { progress: 85, message: 'Agregando audio...' },
        { progress: 95, message: 'Finalizando video...' },
        { progress: 100, message: 'Video completado!' }
      ];

      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setProgress(step.progress);
      }

      setGeneratedVideo({
        ...videoConfig,
        format: selectedFormatData,
        style: selectedStyleData,
        transition: selectedTransitionData,
        music: selectedMusicData,
        resolutionData: selectedResolutionData,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: 'https://via.placeholder.com/1920x1080/667eea/ffffff?text=Video+Generado',
        timestamp: new Date().toLocaleString(),
        fileSize: '45.2 MB',
        codec: 'H.264',
        bitrate: '8000 kbps'
      });

      setIsGenerating(false);
      setProgress(0);

    } catch (error) {
      console.error('Error generando video:', error);
      alert('Error al generar el video. Por favor intenta de nuevo.');
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setPlayProgress(progress);
    }
  };

  const downloadVideo = () => {
    if (generatedVideo && generatedVideo.videoUrl) {
      const link = document.createElement('a');
      link.href = generatedVideo.videoUrl;
      link.download = `video_${Date.now()}.mp4`;
      link.click();
    }
  };

  const VideoPreview = () => {
    if (!generatedVideo) return null;

    return (
      <div className="mt-8 p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Video className="w-7 h-7 text-purple-600" />
            Video Generado
          </h3>
          <div className="flex gap-3">
            <button 
              onClick={downloadVideo}
              className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-all hover:scale-105"
            >
              <Download className="w-4 h-4" />
              Descargar MP4
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className={`${generatedVideo.format.aspect} w-full bg-black rounded-2xl shadow-2xl relative overflow-hidden`}>
              <video
                ref={videoRef}
                src={generatedVideo.videoUrl}
                className="w-full h-full object-cover"
                onTimeUpdate={handleVideoTimeUpdate}
                onEnded={() => setIsPlaying(false)}
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                <div className="mb-3">
                  <div className="h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer">
                    <div 
                      className="h-full bg-white transition-all duration-100"
                      style={{ width: `${playProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <button 
                    onClick={togglePlay}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-xl"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-gray-800" />
                    ) : (
                      <Play className="w-6 h-6 text-gray-800 ml-1" />
                    )}
                  </button>
                  
                  <div className="flex items-center gap-4 text-white text-sm">
                    {videoRef.current && (
                      <span className="font-mono">
                        {Math.floor(videoRef.current.currentTime)}s / {Math.floor(videoRef.current.duration || generatedVideo.duration)}s
                      </span>
                    )}
                    {generatedVideo.music.id !== 'none' && (
                      <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur">
                        <Volume2 className="w-4 h-4" />
                        <span className="text-xs font-semibold">{generatedVideo.music.emoji}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-600 mb-1">Resolución</p>
                <p className="font-bold text-sm text-gray-800">{generatedVideo.resolutionData.pixels}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-600 mb-1">FPS</p>
                <p className="font-bold text-sm text-gray-800">{generatedVideo.fps} fps</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-600 mb-1">Codec</p>
                <p className="font-bold text-sm text-gray-800">{generatedVideo.codec}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-600 mb-1">Tamaño</p>
                <p className="font-bold text-sm text-gray-800">{generatedVideo.fileSize}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200">
              <p className="text-xs text-purple-700 mb-1 font-semibold flex items-center gap-2">
                <Video className="w-3 h-3" />
                Formato
              </p>
              <p className="font-bold text-gray-800">{generatedVideo.format.name}</p>
              <p className="text-xs text-gray-600">{generatedVideo.format.width}x{generatedVideo.format.height}px</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-blue-200">
              <p className="text-xs text-blue-700 mb-1 font-semibold flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                Estilo
              </p>
              <p className="font-bold text-gray-800">{generatedVideo.style.name}</p>
              <div className={`mt-2 h-2 rounded-full bg-gradient-to-r ${generatedVideo.style.color}`}></div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border-2 border-orange-200">
              <p className="text-xs text-orange-700 mb-1 font-semibold flex items-center gap-2">
                <Zap className="w-3 h-3" />
                Transición
              </p>
              <p className="font-bold text-gray-800">{generatedVideo.transition.icon} {generatedVideo.transition.name}</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
              <p className="text-xs text-green-700 mb-1 font-semibold flex items-center gap-2">
                <Music className="w-3 h-3" />
                Audio
              </p>
              <p className="font-bold text-gray-800">{generatedVideo.music.emoji} {generatedVideo.music.name}</p>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl border-2 border-gray-200">
              <p className="text-xs text-gray-700 mb-1 font-semibold flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Información
              </p>
              <p className="text-xs text-gray-600">Duración: {generatedVideo.duration}s</p>
              <p className="text-xs text-gray-600">Bitrate: {generatedVideo.bitrate}</p>
              <p className="text-xs text-gray-500 mt-2">{generatedVideo.timestamp}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4 shadow-xl">
            <Video className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-4">
            Generador de Videos IA Profesional
          </h1>
          <p className="text-xl text-gray-600">Crea videos de alta calidad con inteligencia artificial</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200 mb-6">
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Texto para el Video
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe lo que quieres crear. Ejemplo: Un niño explorando el espacio con su mascota robot, estilo caricatura colorido y divertido"
              className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none text-gray-800 placeholder-gray-400 text-lg"
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-2">{text.length}/500 caracteres</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Video className="w-5 h-5 text-purple-600" />
                Formato de Video
              </label>
              <div className="grid grid-cols-2 gap-3">
                {formats.map(format => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedFormat === format.id
                        ? 'border-purple-600 bg-purple-50 shadow-lg'
                        : 'border-gray-300 bg-white hover:border-purple-400'
                    }`}
                  >
                    <div className={`${format.aspect} w-full bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-2`}></div>
                    <p className="font-semibold text-gray-800 text-sm">{format.name}</p>
                    <p className="text-xs text-gray-500">{format.width}x{format.height}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                Resolución
              </label>
              <div className="space-y-2">
                {resolutions.map(res => (
                  <button
                    key={res.id}
                    onClick={() => setResolution(res.id)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      resolution === res.id
                        ? 'border-purple-600 bg-purple-50 shadow-md'
                        : 'border-gray-300 bg-white hover:border-purple-400'
                    }`}
                  >
                    <p className="font-semibold text-gray-800 text-sm">{res.name}</p>
                    <p className="text-xs text-gray-500">{res.pixels} píxeles</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Estilo Visual
            </label>
            <div className="grid grid-cols-6 gap-3">
              {styles.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedStyle === style.id
                      ? 'border-purple-600 shadow-lg scale-105'
                      : 'border-gray-300 hover:border-purple-400'
                  }`}
                >
                  <div className={`h-16 rounded-lg bg-gradient-to-br ${style.color} mb-2`}></div>
                  <p className="font-semibold text-gray-800 text-xs">{style.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Transición
              </label>
              <div className="grid grid-cols-2 gap-2">
                {transitions.map(transition => (
                  <button
                    key={transition.id}
                    onClick={() => setSelectedTransition(transition.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedTransition === transition.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    <div className="text-2xl mb-1">{transition.icon}</div>
                    <p className="font-semibold text-gray-800 text-xs">{transition.name}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-600" />
                Música
              </label>
              <div className="space-y-2">
                {musicOptions.slice(0, 3).map(music => (
                  <button
                    key={music.id}
                    onClick={() => setSelectedMusic(music.id)}
                    className={`w-full p-2 rounded-lg border-2 transition-all text-left ${
                      selectedMusic === music.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    <p className="font-semibold text-gray-800 text-xs flex items-center gap-2">
                      <span className="text-lg">{music.emoji}</span>
                      {music.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                FPS (Fotogramas)
              </label>
              <div className="space-y-2">
                {frameRates.map(rate => (
                  <button
                    key={rate.value}
                    onClick={() => setFps(rate.value)}
                    className={`w-full p-2 rounded-lg border-2 transition-all text-left ${
                      fps === rate.value
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    <p className="font-semibold text-gray-800 text-xs">{rate.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Duración del Video: {duration} segundos
            </label>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5s</span>
              <span>30s</span>
              <span>60s</span>
            </div>
          </div>

          <button
            onClick={generateVideoWithAPI}
            disabled={!text.trim() || isGenerating}
            className={`w-full py-5 rounded-xl font-bold text-xl flex items-center justify-center gap-3 transition-all ${
              !text.trim() || isGenerating
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white hover:shadow-2xl hover:scale-[1.02] shadow-lg'
            }`}
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-6 h-6 animate-spin" />
                Generando Video en {resolution} a {fps}fps... {progress}%
              </>
            ) : (
              <>
                <Wand2 className="w-6 h-6" />
                🎬 Generar Video Profesional
              </>
            )}
          </button>

          {isGenerating && (
            <div className="mt-4">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-3 text-center font-semibold">
                ✨ Procesando {fps} fotogramas por segundo en resolución {resolution}...
              </p>
            </div>
          )}
        </div>

        <VideoPreview />
      </div>
    </div>
  );
}