(() => {
  function addRefreshButton() {
    const header = document.querySelector("header");
    if (!header || document.getElementById("refreshAppBtn")) return;

    const button = document.createElement("button");
    button.id = "refreshAppBtn";
    button.type = "button";
    button.textContent = "↻ Vernieuwen";
    button.title = "Controleer op een nieuwe versie";

    Object.assign(button.style, {
      appearance: "none",
      border: "1px solid rgba(255,255,255,.12)",
      borderRadius: "999px",
      padding: "8px 12px",
      fontSize: "13px",
      fontWeight: "700",
      cursor: "pointer",
      background: "#2a4774",
      color: "#f7fbff",
      whiteSpace: "nowrap"
    });

    const badge = header.querySelector(".badge");
    if (badge) header.insertBefore(button, badge);
    else header.appendChild(button);

    button.addEventListener("click", refreshApp);
  }

  async function refreshApp() {
    const button = document.getElementById("refreshAppBtn");
    if (!button) return;

    button.disabled = true;
    button.textContent = "Controleren…";

    let reloading = false;
    const reload = () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    };

    try {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        navigator.serviceWorker.addEventListener("controllerchange", reload, { once: true });

        if (registration) {
          await registration.update();
          if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }
        }
      }

      window.setTimeout(reload, 900);
    } catch (error) {
      console.warn("Updatecontrole mislukt; pagina wordt normaal herladen.", error);
      reload();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addRefreshButton, { once: true });
  } else {
    addRefreshButton();
  }
})();
