import React from "react";

const MessageToast = ({ txHash, closeToast, toastProps }) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", textAlign: "center" }}
    >
      Mira el seguimiento acá:
      <a
        href={`https://moonbase.moonscan.io/tx/${txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#ff5a3c" }}
      >
        {txHash.slice(0, 10)}...
      </a>
    </div>
  );
};

export default MessageToast;
