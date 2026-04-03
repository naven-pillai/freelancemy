import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FreelanceMY — Guides & Resources for Freelancers in Malaysia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          FreelanceMY
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#94a3b8",
            textAlign: "center",
            marginTop: 24,
            maxWidth: 800,
          }}
        >
          Guides & Resources for Freelancers in Malaysia
        </div>
        <div
          style={{
            width: 80,
            height: 4,
            backgroundColor: "#2563eb",
            borderRadius: 2,
            marginTop: 40,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
