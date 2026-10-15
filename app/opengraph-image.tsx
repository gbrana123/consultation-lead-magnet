import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config";

export const alt = siteConfig.seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(145deg, #ffffff 10%, #e8fff5 100%)",
          color: "#0b1f1a",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ position: "absolute", width: 520, height: 520, borderRadius: 999, top: -220, right: -100, background: "rgba(24,237,138,.2)" }} />
        <div style={{ position: "absolute", width: 380, height: 380, borderRadius: 999, bottom: -220, left: -80, background: "rgba(8,122,87,.14)" }} />
        <div style={{ width: 980, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 34 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 62, height: 62, borderRadius: 18, background: "#18ed8a", color: "#063c2d", fontSize: 34, fontWeight: 900 }}>G</div>
            <div style={{ fontSize: 38, fontWeight: 800, color: "#063c2d" }}>{siteConfig.brand.name}</div>
          </div>
          <div style={{ fontSize: 70, lineHeight: 1.08, letterSpacing: "-3px", fontWeight: 900 }}>
            {siteConfig.hero.beforeHighlight}
          </div>
          <div style={{ marginTop: 6, fontSize: 70, lineHeight: 1.08, letterSpacing: "-3px", fontWeight: 900, color: "#087a57" }}>
            {siteConfig.hero.highlight}
          </div>
          <div style={{ marginTop: 28, fontSize: 30, lineHeight: 1.3, color: "#4b635b", fontWeight: 700 }}>
            {siteConfig.hero.subheadline}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
