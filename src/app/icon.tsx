import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** App icon / favicon — document + dual carets */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #2563EB 0%, #4F46E5 100%)",
          borderRadius: 16,
        }}
      >
        {/* Document */}
        <div
          style={{
            display: "flex",
            width: 30,
            height: 36,
            background: "white",
            borderRadius: 4,
            position: "relative",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              padding: "10px 6px 0 6px",
              width: "100%",
            }}
          >
            <div style={{ height: 3, width: "85%", background: "#93C5FD", borderRadius: 2 }} />
            <div style={{ height: 3, width: "65%", background: "#BFDBFE", borderRadius: 2 }} />
            <div style={{ height: 3, width: "75%", background: "#BFDBFE", borderRadius: 2 }} />
          </div>
        </div>
        {/* Caret dots */}
        <div
          style={{
            position: "absolute",
            right: 12,
            top: 18,
            width: 8,
            height: 8,
            borderRadius: 2,
            background: "#38BDF8",
            transform: "rotate(45deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 10,
            bottom: 16,
            width: 8,
            height: 8,
            borderRadius: 2,
            background: "#A78BFA",
            transform: "rotate(45deg)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
