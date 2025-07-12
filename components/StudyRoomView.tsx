
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';

interface ParticipantTileProps {
  name: string;
  stream?: MediaStream | null;
  isMuted?: boolean;
  isYou?: boolean;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

const ParticipantTile: React.FC<ParticipantTileProps> = ({ name, stream, isMuted, isYou = false, videoRef: passedRef }) => {
  const internalRef = useRef<HTMLVideoElement>(null);
  const videoRef = passedRef || internalRef;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream || null;
    }
  }, [stream, videoRef]);

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 aspect-video relative">
        <video ref={videoRef} autoPlay playsInline muted={isYou} className="w-full h-full object-cover bg-slate-900"></video>
        {!stream && (
            <div className="absolute inset-0 flex items-center justify-center">
                 <svg className="w-10 h-10 text-slate-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
            </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent flex justify-between items-center">
            <p className="text-white text-xs font-medium truncate">{name} {isYou && '(You)'}</p>
            {isMuted && (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            )}
        </div>
    </div>
  );
};

interface RoomProps {
    user: User | null;
    roomName: string;
    localStream: MediaStream | null;
    screenStream: MediaStream | null;
    localVideoRef: React.RefObject<HTMLVideoElement>;
    screenVideoRef: React.RefObject<HTMLVideoElement>;
    isMicMuted: boolean;
    onToggleMic: () => void;
    isCameraOff: boolean;
    onToggleCamera: () => void;
    onToggleScreenShare: () => void;
    onLeaveRoom: () => void;
}

const Room: React.FC<RoomProps> = ({ user, roomName, localStream, screenStream, localVideoRef, screenVideoRef, isMicMuted, onToggleMic, isCameraOff, onToggleCamera, onToggleScreenShare, onLeaveRoom }) => (
    <div className="flex h-full w-full animate-fade-in">
        {/* Main Content: Screen Share or Placeholder */}
        <main className="flex-grow flex flex-col bg-slate-900 rounded-lg overflow-hidden mr-4">
             <div className="flex-grow bg-black flex items-center justify-center relative">
                {screenStream ? (
                    <video ref={screenVideoRef} autoPlay playsInline className="w-full h-full object-contain"></video>
                ) : (
                    <div className="text-center text-slate-500 p-4 flex flex-col items-center">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <h3 className="text-xl font-semibold text-slate-300">Welcome to "{roomName}"</h3>
                        <p className="mt-1">The stage is ready. Share your screen to begin.</p>
                    </div>
                )}
            </div>

            {/* Controls */}
            <footer className="flex-shrink-0 bg-slate-800/50 p-3 flex items-center justify-between border-t border-slate-700">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-300 hidden md:block">{roomName}</span>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={onToggleMic} title={isMicMuted ? 'Unmute' : 'Mute'} className={`p-3 rounded-full ${isMicMuted ? 'bg-red-500' : 'bg-slate-700'} hover:bg-slate-600 text-white transition-colors`}>
                        {isMicMuted 
                            ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zm-1 3a3 3 0 102.83 4H10a1 1 0 01-1-1V6zm3.23.24a3.5 3.5 0 01-1.23 6.08V14.5a1 1 0 11-2 0v-2.18a3.5 3.5 0 01-1.23-6.08 1.5 1.5 0 012.46 0z" /></svg>
                        }
                    </button>
                    <button onClick={onToggleCamera} title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'} className={`p-3 rounded-full ${isCameraOff ? 'bg-red-500' : 'bg-slate-700'} hover:bg-slate-600 text-white transition-colors`}>
                         {isCameraOff 
                            ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                            : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                        }
                    </button>
                    <button onClick={onToggleScreenShare} title={screenStream ? 'Stop Sharing' : 'Share Screen'} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg ${screenStream ? 'bg-red-500' : 'bg-sky-500'} hover:opacity-90 text-white font-semibold transition-colors`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm3 1a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                        <span>{screenStream ? 'Stop' : 'Share'}</span>
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={onLeaveRoom} className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold">
                        Leave
                    </button>
                </div>
            </footer>
        </main>

        {/* Participants Sidebar */}
        <aside className="w-64 flex-shrink-0 flex flex-col bg-slate-900/50 rounded-lg p-3">
             <h3 className="text-lg font-semibold text-slate-200 mb-3 px-1">Participants</h3>
             <div className="space-y-3 overflow-y-auto">
                 <ParticipantTile name={user?.email || 'You'} stream={localStream} isMuted={isMicMuted} isYou={true} videoRef={localVideoRef} />
                 {[1, 2, 3].map(i => (
                    <ParticipantTile key={i} name={`Friend ${i}`} isMuted={i % 2 === 0} />
                 ))}
             </div>
        </aside>
    </div>
);

interface LobbyProps {
    roomName: string;
    onRoomNameChange: (name: string) => void;
    onJoinRoom: () => void;
}

const Lobby: React.FC<LobbyProps> = ({ roomName, onRoomNameChange, onJoinRoom }) => (
  <div className="w-full max-w-md mx-auto text-center animate-fade-in">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Study Room</h2>
      <p className="text-slate-400 mb-8">Create or join a room to learn with friends.</p>
      <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700">
          <input
              type="text"
              value={roomName}
              onChange={(e) => onRoomNameChange(e.target.value)}
              placeholder="Enter a room name"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
          />
          <button
              onClick={onJoinRoom}
              disabled={!roomName.trim()}
              className="mt-4 w-full px-8 py-3 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
              Join Room
          </button>
      </div>
  </div>
);


interface StudyRoomViewProps {
  user: User | null;
  onBack: () => void;
}

const StudyRoomView: React.FC<StudyRoomViewProps> = ({ user, onBack }) => {
  const [roomName, setRoomName] = useState('');
  const [isInRoom, setIsInRoom] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (screenStream && screenVideoRef.current) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      screenStream?.getTracks().forEach(track => track.stop());
    };
  }, [localStream, screenStream]);

  const handleJoinRoom = async () => {
    if (!roomName.trim()) {
      alert('Please enter a room name.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      setIsInRoom(true);
    } catch (error) {
      console.error("Error accessing media devices.", error);
      alert("Could not access camera and microphone. Please check permissions and try again.");
    }
  };

  const handleLeaveRoom = () => {
    localStream?.getTracks().forEach(track => track.stop());
    screenStream?.getTracks().forEach(track => track.stop());
    setLocalStream(null);
    setScreenStream(null);
    setIsInRoom(false);
    onBack();
  };

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setIsCameraOff(!videoTrack.enabled);
        }
    }
  };

  const toggleScreenShare = async () => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        stream.getVideoTracks()[0].onended = () => setScreenStream(null);
        setScreenStream(stream);
      } catch (error) {
        console.error("Error starting screen share.", error);
      }
    }
  };
  
  return (
    <div className="w-full h-full flex items-center justify-center">
        {isInRoom 
            ? <Room 
                user={user}
                roomName={roomName}
                localStream={localStream}
                screenStream={screenStream}
                localVideoRef={localVideoRef}
                screenVideoRef={screenVideoRef}
                isMicMuted={isMicMuted}
                onToggleMic={toggleMic}
                isCameraOff={isCameraOff}
                onToggleCamera={toggleCamera}
                onToggleScreenShare={toggleScreenShare}
                onLeaveRoom={handleLeaveRoom}
              />
            : <Lobby 
                roomName={roomName}
                onRoomNameChange={setRoomName}
                onJoinRoom={handleJoinRoom}
              />
        }
    </div>
  );
};

export default StudyRoomView;
