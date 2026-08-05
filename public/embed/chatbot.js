(function () {
  const script =
    document.currentScript ||
    document.querySelector("script[data-bot-id]");

  if (!script) {
    console.error("Knowly: Embed script element not found.");
    return;
  }

  const botId = script.getAttribute("data-bot-id");

  if (!botId) {
    console.error("Knowly: data-bot-id is required.");
    return;
  }

  let origin = window.location.origin;

  try {
    origin = new URL(script.src, document.baseURI).origin;
  } catch {}

  const iframe = document.createElement("iframe");

  iframe.src = `${origin}/embed/${encodeURIComponent(botId)}`;
  iframe.title = "Knowly Chatbot Widget";
  iframe.allow = "clipboard-write";

  Object.assign(iframe.style, {
    position: "fixed",
    bottom: "16px",
    right: "16px",
    width: "80px",
    height: "80px",
    border: "none",
    borderRadius: "32px",
    background: "transparent",
    overflow: "hidden",
    zIndex: "999999",
    colorScheme: "light",
    transition:
      "width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s cubic-bezier(0.16,1,0.3,1), transform 0.2s ease",
  });

  document.body.appendChild(iframe);

  window.addEventListener("message", ({ origin: eventOrigin, source, data }) => {
    if (
      eventOrigin !== origin ||
      source !== iframe.contentWindow ||
      data?.type !== "KNOWLY_CHATBOT_RESIZE"
    ) {
      return;
    }

    Object.assign(iframe.style, {
      width: data.isOpen
        ? "min(420px, calc(100vw - 24px))"
        : "80px",
      height: data.isOpen
        ? "min(660px, calc(100vh - 32px))"
        : "80px",
    });
  });
})();