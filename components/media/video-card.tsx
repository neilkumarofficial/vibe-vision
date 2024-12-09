import { TriangleAlert, UserCircleIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

interface VideoCardProps {
  dataItem: any;
  openVideoModal?: Function;
  isProfile?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({ dataItem, openVideoModal, isProfile = false }) => {
  const renderProfileContent = () => {
    switch (dataItem.status) {
      case "waiting":
        return (
          <CardContent className="bg-blue-900/30/ border-2 border-purple-600 min-h-80 w-full p-0 flex flex-col justify-center pb-4 rounded-xl relative">
            <Badge className="absolute top-2 left-2 z-10">{dataItem.contentType}</Badge>
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div
                className="p-2 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 md:w-20 md:h-20 h-16 w-16 aspect-square rounded-full"
              >
                <div
                  className="rounded-full h-full w-full bg-slate-100 dark:bg-zinc-900 background-blur-md"
                ></div>
              </div>

              <div className="loader">
                <p>Generating</p>
                <div className="words">
                  <span className="word">Content</span>
                  <span className="word">Video</span>
                  <span className="word">Audio</span>
                  <span className="word">Video</span>
                  <span className="word">Content</span>
                </div>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                Your {dataItem.contentType} is being generated...
              </p>
              <div className="pt-1 text-xs opacity-40">{dataItem.userPrompt}</div>
            </div>
          </CardContent>
        );

      case "failure":
        return (
          <CardContent className="bg-red-900/30 border-2 border-red-600 min-h-80 w-full p-0 flex flex-col justify-center pb-4 rounded-xl relative">
            <Badge className="absolute top-2 left-2 z-10">{dataItem.contentType}</Badge>
            <div className="text-center">
              <TriangleAlert className="size-16 text-red-500 mx-auto" />
              <h2 className="text-zinc-900 dark:text-white mt-4">Error Generating Content!</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                The server wasn't able to generate your {dataItem.contentType}!
              </p>
              <div className="pt-1 text-sm opacity-60">Please Try Again!</div>
              <div className="pt-1 text-xs opacity-40">{dataItem.userPrompt}</div>
            </div>
          </CardContent>
        );

      case "success":
      default:
        return renderSuccessContent();
    }
  };

  const renderSuccessContent = () => (
    <CardContent
      onClick={() => openVideoModal && openVideoModal(dataItem)}
      className="bg-[#0f0f0f] w-full p-0 min-h-80 flex flex-col justify-between pb-4 rounded-xl relative"
    >
      <Badge className="absolute top-2 left-2 z-10">{dataItem.contentType}</Badge>
      {/* Thumbnail Container */}
      <div className="relative">
        <img
          src={
            dataItem.imageUrl || dataItem.thumbnail_alt || "https://images.pexels.com/photos/1955134/pexels-photo-1955134.jpeg"
          }
          alt={dataItem.displayName || dataItem.musicTitle || ""}
          className={`w-full h-60 rounded-xl ${dataItem.contentType === "roast-my-pic" ? "object-contain bg-black" : "object-cover"}`}
        />
      </div>
      {/* Video Info */}
      <div className="mt-3 flex items-center gap-3 mx-4 overflow-y-visible overflow-x-hidden">
        <div className="size-8">
          <UserCircleIcon className="size-full" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold line-clamp-2 text-nowrap">
            {dataItem.contentType === "story-time"
              ? dataItem.userPrompt || dataItem.displayName
              : dataItem.displayName || "AI Generated Video"}
          </h3>
          <h3 className="font-semibold text-sm text-neutral-400 line-clamp-2 text-nowrap">
            {dataItem.userName || "AI Generated Video"}
          </h3>
        </div>
      </div>
    </CardContent>
  );

  return (
    <Card key={dataItem._id} className={`border-0 shadow-none ${isProfile ? "" : "h-80"}`}>
      {isProfile ? renderProfileContent() : renderSuccessContent()}
    </Card>
  );
};
