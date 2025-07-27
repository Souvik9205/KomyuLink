import React from "react";

function BackgroundLayout() {
  return (
    <div
      className="fixed inset-0 z-[-1] opacity-20 overflow-hidden bg-cover bg-no-repeat bg-center "
      style={{
        backgroundImage: "url(./bg.png)",
        backgroundSize: "cover",
      }}
    />
  );
}

export default BackgroundLayout;
