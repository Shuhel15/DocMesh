(function () {
  const script = document.currentScript;

  if (!script) {
    console.error("Knowly: Embed script element not found.");
    return;
  }

  const botId = script.getAttribute("data-bot-id");

  if (!botId) {
    console.error("Knowly: data-bot-id is required on embed script.");
    return;
  }

  const origin = new URL(script.src).origin;
  const iframe = document.createElement("iframe");

  iframe.src = `${origin}/embed/${encodeURIComponent(botId)}`;
  iframe.title = "Knowly Chatbot Widget";
  iframe.allow = "clipboard-write";

  // Base styles for external widget container iframe
  Object.assign(iframe.style, {
    position: "fixed",
    bottom: "16px",
    right: "16px",
    width: "80px",
    height: "80px",
    border: "none",
    zIndex: "999999",
    background: "transparent",
    colorScheme: "light",
    transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s ease",
    overflow: "hidden",
  });

  document.body.appendChild(iframe);

  window.addEventListener("message", (event) => {
    if (event.origin !== origin) {
      return;
    }

    if (event.data?.type !== "KNOWLY_CHATBOT_RESIZE") {
      return;
    }

    if (event.data.isOpen) {
      iframe.style.width = "min(420px, calc(100vw - 24px))";
      iframe.style.height = "min(660px, calc(100vh - 32px))";
    } else {
      iframe.style.width = "80px";
      iframe.style.height = "80px";
    }
  });
})();
