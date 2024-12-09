import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VideoLayout from './VideoLayout';
import { VideoPlayerWithControls } from './watch';

const VideoLayoutWrapper: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<VideoLayout />} />
                <Route path="/watch/:videoId" element={<VideoPlayerWithControls 
                    videoDetails={{
                        id: '',
                        title: '',
                        description: '',
                        videoUrl: '',
                        thumbnail: '',
                        views: 0,
                        likes: 0,
                        dislikes: 0,
                        category: '',
                        userName: '',
                        userAvatar: '',
                        followers: 0
                    }}
                    selectedQuality="auto"
                    playbackSpeed={1}
                    onQualityChange={() => {}}
                    onPlaybackSpeedChange={() => {}}
                    onTimestampChange={() => {}}
                />} />
            </Routes>
        </Router>
    );
};

export default VideoLayoutWrapper;