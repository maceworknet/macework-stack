"use client";

import { useState, useEffect } from "react";
import { Link2 } from "lucide-react";
import { SocialIcon } from 'react-social-icons';

export function ShareButtons() {
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Bağlantı kopyalandı!');
  };

  if (!shareUrl) return null;

  return (
    <div className="pt-8 space-y-6 flex flex-col items-center border-t border-border/40">
       <p className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase">Projeyi Paylaş</p>
       <div className="flex items-center justify-between w-full max-w-[240px]">
          <SocialIcon url={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} network="linkedin" className="!w-10 !h-10 hover:bg-muted rounded-full border border-border transform hover:scale-110 transition-all icon-gray-filter" bgColor="transparent" fgColor="currentColor" />
          <SocialIcon url={`https://twitter.com/intent/tweet?url=${shareUrl}`} network="x" className="!w-10 !h-10 hover:bg-muted rounded-full border border-border transform hover:scale-110 transition-all icon-gray-filter" bgColor="transparent" fgColor="currentColor" />
          <SocialIcon url={`https://www.instagram.com/`} network="instagram" className="!w-10 !h-10 hover:bg-muted rounded-full border border-border transform hover:scale-110 transition-all icon-gray-filter" bgColor="transparent" fgColor="currentColor" />
          <SocialIcon url={`https://wa.me/?text=${shareUrl}`} network="whatsapp" className="!w-10 !h-10 hover:bg-muted rounded-full border border-border transform hover:scale-110 transition-all icon-gray-filter" bgColor="transparent" fgColor="currentColor" />
          <button 
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-all active:scale-90 text-foreground" 
              title="Bağlantıyı Kopyala"
              onClick={copyToClipboard}
          >
             <Link2 className="w-5 h-5" />
          </button>
       </div>
    </div>
  );
}
