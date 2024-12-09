"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

// Social platform icons as SVG components
const SocialIcons = {
  WhatsApp: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#25D366"
    >
      <path d="M17.472 14.382c-.297-.15-1.758-.867-2.03-.967-.272-.1-.47-.15-.669.15-.197.3-.767.967-.94 1.165-.172.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.608.134-.133.297-.347.446-.52.148-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.217 12.217 0 00-.57-.01c-.198 0-.52.075-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.005-1.413.247-.694.247-1.289.172-1.413-.075-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.861 9.861 0 01-1.511-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.898 6.99c-.001 5.448-4.437 9.884-9.887 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.946L0 24l6.335-1.662a11.896 11.896 0 005.656 1.438h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  X: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#1DA1F2"
    >
      <path d="M18.901 1.153h3.68l-8.04 9.557L24 22.846h-7.406l-5.8-7.584-6.638 7.584H1.128l9.16-10.436L0 1.154h7.594l5.243 6.932z" />
    </svg>
  ),
  Facebook: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#1877F2"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  ),
  Email: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#888888"
    >
      <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z" />
    </svg>
  ),
  KakaoTalk: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#FEE500"
    >
      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.517 14.991c-1.689 1.434-4.373 2.009-6.517 2.009v2l-4-3 4-3v2.001c2.143 0 4.843-.567 6.517-2.01 1.675-1.443 2.483-3.568 2.483-5.991 0-2.422-.808-4.547-2.483-5.991-1.674-1.443-4.374-2.01-6.517-2.01-2.143 0-4.843.567-6.517 2.01-1.675 1.444-2.483 3.569-2.483 5.991 0 1.335.321 2.603.963 3.733l-2.712 2.67 1.924 1.957 2.718-2.677c1.366.693 2.895 1.029 4.107 1.029v-2.001c-2.144 0-4.828-.575-6.517-2.009-1.689-1.443-2.483-3.569-2.483-5.991 0-2.423.794-4.548 2.483-5.992 1.689-1.443 4.373-2.009 6.517-2.009 2.143 0 4.843.566 6.517 2.009 1.675 1.444 2.483 3.569 2.483 5.992 0 2.423-.808 4.548-2.483 5.991z" />
    </svg>
  ),
  Reddit: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#FF4500"
    >
      <path d="M14.5 12a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zm-5 0a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zm7.19 4.385c.121-.099.248-.192.385-.28.187-.126.403-.198.628-.21a.906.906 0 01.548.165c.165.12.28.285.335.48.056.195.04.402-.045.588a1.39 1.39 0 01-.42.51 2.503 2.503 0 01-1.968.57c-.195-.03-.383-.105-.548-.22a1.189 1.189 0 01-.42-.48c-.1-.195-.116-.42-.045-.63.07-.21.225-.39.42-.495.15-.075.315-.105.48-.09.165.015.33.075.465.165.06.045.12.09.18.12zm-3.19-7.385c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm7.5 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm3.5 6a9.5 9.5 0 11-19 0 9.5 9.5 0 0119 0zm-2.085-1.596c.015-.225-.075-.45-.255-.585-.18-.135-.42-.18-.63-.105a.964.964 0 00-.42.315c-.105.15-.165.33-.165.51 0 .075.015.15.03.225.045.21.15.42.315.57.09.075.21.12.33.12h.03c.21-.015.42-.12.555-.285.135-.165.195-.39.165-.6zm-12.83-1.29c-.21-.075-.45-.03-.63.105-.18.135-.27.36-.255.585.03.21.03.435-.015.645-.045.21-.165.42-.345.555a.833.833 0 01-.57.195h-.03a.594.594 0 01-.33-.12c-.165-.15-.27-.36-.315-.57-.015-.075-.03-.15-.03-.225 0-.18.06-.36.165-.51.105-.165.27-.27.42-.315.21-.075.42-.03.63.105.18.135.27.36.255.585a.714.714 0 01-.255.585.752.752 0 01-1.005-.15z" />
    </svg>
  ),
  Telegram: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#229ED9"
    >
      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.708 8.205c-.126.604-.432.751-.873.465l-2.647-1.953-1.276 1.229c-.141.141-.259.259-.533.259v-.004l.192-2.709 4.918-4.426c.21-.19-.045-.295-.326-.105l-6.069 3.817-2.617-.813c-.562-.18-.574-.562.126-.843l10.209-3.938c.467-.178.878.115.73.835z" />
    </svg>
  ),
};

interface ShareDialogProps {
  videoUrl: string;
}

export function ShareDialog({ videoUrl }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(videoUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToSocial = (platform: string) => {
    const urls = {
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(videoUrl)}`,
      x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(videoUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`,
      email: `mailto:?body=${encodeURIComponent(videoUrl)}`,
      kakaotalk: `https://sharer.kakao.com/talk/friends?url=${encodeURIComponent(videoUrl)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(videoUrl)}`,
      telegram: `https://telegram.me/share/url?url=${encodeURIComponent(videoUrl)}`,
    };
    window.open(urls[platform as keyof typeof urls], "_blank");
  };

  const socialPlatforms = [
    { name: "WhatsApp", platform: "whatsapp" },
    { name: "X", platform: "x" },
    { name: "Facebook", platform: "facebook" },
    { name: "Email", platform: "email" },
    { name: "KakaoTalk", platform: "kakaotalk" },
    { name: "Reddit", platform: "reddit" },
    { name: "Telegram", platform: "telegram" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-current rounded-full">
          <Share2 className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this video</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <ScrollArea className="h-[250px] w-full pr-4">
            <div className="grid grid-cols-2 gap-3">
              {socialPlatforms.map(({ name, platform }) => (
                <Button
                  key={platform}
                  onClick={() => shareToSocial(platform)}
                  className=" flex items-center gap-2 justify-start"
                >
                  {SocialIcons[name as keyof typeof SocialIcons]()}
                  {name}
                </Button>
              ))}
            </div>
          </ScrollArea>

          <div className="flex gap-2 mt-4">
            <Input value={videoUrl} readOnly className="flex-grow" />
            <Button onClick={copyToClipboard}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}