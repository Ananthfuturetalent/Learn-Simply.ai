
import React from 'react';

interface VideoPlayerModalProps {
  videoId: string;
  title: string;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ videoId, title, onClose }) => {
  const videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl h-auto border border-slate-700 flex flex-col">
        <header className="p-4 flex justify-between items-center border-b border-slate-700">
          <h2 className="text-xl font-bold text-sky-400 truncate" title={title}>{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white flex-shrink-0 ml-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={videoSrc}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;