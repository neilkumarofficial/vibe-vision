import { MusicCard } from "./music-card";
import { VideoCard } from "./video-card";

export const CardRenderer: React.FC<{ dataItem: any, openVideoModal?: Function, playGeneratedSong?: Function, currentSong?: any, isProfile?: boolean }> = ({ dataItem, openVideoModal, playGeneratedSong, currentSong, isProfile = false }) => {
    switch (dataItem.contentType) {
      case 'roast-my-pic':
      case 'story-time':
        return (
          <VideoCard
            dataItem={dataItem}
            openVideoModal={openVideoModal}
            isProfile={isProfile}
          />
        );
      case 'jukebox':
      case 'kids-music':
        return (
          <MusicCard
            dataItem={dataItem}
            playGeneratedSong={playGeneratedSong}
            currentSong={currentSong}
          />
        );
      default:
        return null; 
    }
  };
  