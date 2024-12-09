import { AudioLines } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import ScrollingText from "../ui/scroll-text";
import { Badge } from "../ui/badge";

export const MusicCard: React.FC<{ dataItem: any, playGeneratedSong?: Function, currentSong?: any }> = ({ dataItem, playGeneratedSong, currentSong }) => (
  <Card key={dataItem._id} className="border-0 shadow-none h-80 ">
    <CardContent className="bg-[#0f0f0f] w-fit/ h-fit min-h-80 w-full p-0 flex flex-col justify-between pb-4 rounded-xl relative">
      <Badge className='absolute top-2 left-2 z-10'>{dataItem.contentType}</Badge>
      <div className='w-full bg-neutral-900 max-h-60 relative flex flex-row justify-around items-center px-8 py-12 rounded-xl'>
        <div className={`relative h-full/ size-36 /w-full flex justify-center items-center group cursor-pointer`}>
          <div
            style={{
              backgroundImage: (dataItem.imageUrl || dataItem.thumbnail_alt) ? `url('${dataItem.imageUrl || dataItem.thumbnail_alt}')` : 'https://images.pexels.com/photos/1955134/pexels-photo-1955134.jpeg',
              filter: "blur(14px)",
              opacity: 0.5,
            }}
            className='top-2 left-1 z-10 group-hover:scale-105 duration-300 absolute size-36 bg-cover rounded-full'>
          </div>
          <div
            style={{
              backgroundImage: (dataItem.imageUrl || dataItem.thumbnail_alt) ? `url('${dataItem.imageUrl || dataItem.thumbnail_alt}')` : 'https://images.pexels.com/photos/1955134/pexels-photo-1955134.jpeg',
              animation: currentSong?.id === dataItem._id ? 'slowRotate 15s linear infinite' : '',
            }}
            className='group-hover:scale-105 relative z-20 opacity-90 duration-300 group-hover:opacity-100 size-36 flex flex-col bg-cover justify-center items-center rounded-full'>
            <div className='size-8 bg-neutral-900/60 flex justify-center items-center rounded-full backdrop-blur'>
              {currentSong?.id === dataItem._id && <AudioLines />}
            </div>
          </div>
        </div>
        <div className="w-full items-center justify-center text-center text-nowrap bg-neutral-/800 rounded-xl p-4 max-w-48 overflow-hidden whitespace-nowrap flex flex-col gap-2">
          <ScrollingText text={dataItem.musicTitle || "Jukebox Music"} />
          <p className="text-gray-200 text-xs">Vibe Vision Music.</p>
          <div onClick={() => playGeneratedSong && playGeneratedSong(dataItem)} className='p-2 cursor-pointer hover:scale-105 duration-300'>
            {currentSong?.id !== dataItem._id ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-play-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
              </svg>
            ) : (
              <div className='flex flex-col justify-center items-center'>
                <div className="now-playing">
                  <div className="now-playing-inner">
                    <div className="now-playing-block"></div>
                    <div className="now-playing-block"></div>
                  </div>
                </div>
                Now Playing
              </div>
            )}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
