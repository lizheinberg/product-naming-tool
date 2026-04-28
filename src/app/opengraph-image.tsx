import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Platform Brand Architecture and Naming Assessment";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoBuffer = await readFile(
    join(process.cwd(), "public/prequel-logo.svg")
  );
  const logoDataUri = `data:image/svg+xml;base64,${logoBuffer.toString("base64")}`;

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
        }}
      >
        {/* Prequel logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoDataUri} width={280} height={76} alt="Prequel" />

        <div style={{ flex: 1, display: "flex" }} />

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 76,
            fontWeight: 600,
            color: "#112444",
            lineHeight: 1.1,
            marginBottom: 36,
            letterSpacing: "-0.02em",
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
    size
  );
}
