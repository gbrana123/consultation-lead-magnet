import { publicConfig, siteConfig } from "@/lib/config";

function getVimeoEmbedUrl(value: string): string | null {
  if (!value.trim()) return null;
  try {
    const url = new URL(value);
    const segments = url.pathname.split("/").filter(Boolean).reverse();
    const videoId = segments.find((segment) => /^\d+$/.test(segment));
    if (!videoId) return null;
    return `https://player.vimeo.com/video/${videoId}?autoplay=0&title=0&byline=0&portrait=0`;
  } catch {
    return null;
  }
}

export function VimeoEmbed() {
  const embedUrl = getVimeoEmbedUrl(publicConfig.vimeoUrl);

  return (
    <div className="mt-5 aspect-video overflow-hidden rounded-2xl border border-border bg-deep-green shadow-[0_18px_45px_rgba(6,60,45,.16)]">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={siteConfig.thankYou.videoTitle}
          className="h-full w-full"
          allow="fullscreen; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          controls
          playsInline
          preload="metadata"
          aria-label={siteConfig.thankYou.videoTitle}
          className="h-full w-full bg-black object-cover"
        >
          <source src={siteConfig.thankYou.welcomeVideoMp4} type="video/mp4" />
          Your browser does not support HTML video playback.
        </video>
      )}
    </div>
  );
}
