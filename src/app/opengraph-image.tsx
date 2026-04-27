import { ImageResponse } from "next/og";

export const alt = "Platform Brand Architecture and Naming Assessment";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont(query: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?${query}&display=swap`;
  const css = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
    },
  }).then((r) => r.text());
  const match = css.match(/src:\s*url\(([^)]+)\)/);
  if (!match) throw new Error("font CSS parse failed");
  const fontUrl = match[1].replace(/['"]/g, "");
  return fetch(fontUrl).then((r) => r.arrayBuffer());
}

export default async function Image() {
  const [playfair, inter] = await Promise.all([
    loadFont("family=Playfair+Display:wght@400"),
    loadFont("family=Inter:wght@400"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#EEEEE1",
          display: "flex",
          flexDirection: "column",
          padding: "72px 88px",
          fontFamily: "Inter",
        }}
      >
        {/* Prequel dots + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                background: "#0287B8",
              }}
            />
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                background: "#0287B8",
              }}
            />
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#112444" }}>
            prequel
          </div>
        </div>

        <div style={{ flex: 1, display: "flex" }} />

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Playfair Display",
            fontSize: 80,
            color: "#112444",
            lineHeight: 1.1,
            marginBottom: 36,
          }}
        >
          <div style={{ display: "flex" }}>Platform Brand Architecture</div>
          <div style={{ display: "flex" }}>and Naming Assessment</div>
        </div>

        {/* Description */}
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "rgba(17, 36, 68, 0.65)",
            lineHeight: 1.4,
            maxWidth: 980,
          }}
        >
          A short assessment to help you decide how to organize platform brands
          and whether to keep, leverage, or replace your holdco name.
        </div>

        <div style={{ flex: 1, display: "flex" }} />

        {/* Bottom URL */}
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "rgba(17, 36, 68, 0.5)",
          }}
        >
          holdco.prequel.agency
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Playfair Display",
          data: playfair,
          style: "normal",
          weight: 400,
        },
        { name: "Inter", data: inter, style: "normal", weight: 400 },
      ],
    }
  );
}
