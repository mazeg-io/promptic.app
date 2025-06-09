import React from "react";

export default function DemoSection() {
  return (
    <div className="w-full">
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%", // 16:9 aspect ratio
          height: 0,
          borderRadius: "0.75rem",
          overflow: "hidden",
          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        }}
      >
        <iframe
          src="https://www.loom.com/embed/e3682fdf53424837a62c17dd08854b4c?sid=c36e521a-0b81-4b68-8913-0334d69dc68b"
          frameBorder="0"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        ></iframe>
      </div>
    </div>
  );
}
