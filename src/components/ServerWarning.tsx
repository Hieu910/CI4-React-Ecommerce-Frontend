import { useState, useEffect } from "react";

const ServerWarning = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenNotice = localStorage.getItem("hasSeenServerNotice");

    if (!hasSeenNotice) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("hasSeenServerNotice", "true");
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#fff4e5",
        color: "#663c00",
        padding: "16px 24px",
        borderRadius: "12px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        zIndex: 9999,
        width: "90%",
        maxWidth: "500px",
        borderLeft: "6px solid #ffa117",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span>⏳</span> Server is waking up...
      </div>

      <div style={{ fontSize: "14px", lineHeight: "1.5" }}>
        Our free hosting puts the server to sleep after inactivity. It may take
        <strong> 50s or more</strong> to spin up.
        <br />
        <span style={{ color: "#d32f2f", fontWeight: "bold" }}>
          Please reload the page if you encounter a timeout error.
        </span>
      </div>

      <button
        onClick={handleClose}
        style={{
          alignSelf: "flex-end",
          padding: "6px 16px",
          backgroundColor: "#ffa117",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "13px",
        }}
      >
        GOT IT
      </button>
    </div>
  );
};

export default ServerWarning;
