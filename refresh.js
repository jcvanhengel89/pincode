(() => {
  const SETTINGS_KEY = "pincode_settings_v1";
  let wakeLock = null;

  function loadSettings() {
    try {
      return {
        theme: "midnight",
        keepAwake: true,
        ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}")
      };
    } catch {
      return { theme: "midnight", keepAwake: true };
    }
  }

  let settings = loadSettings();

  function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  function injectStyles() {
    if (document.getElementById("pincodeEnhancementStyles")) return;

    const style = document.createElement("style");
    style.id = "pincodeEnhancementStyles";
    style.textContent = `
      body[data-pincode-theme="midnight"] {
        --px-bg:#0f1f3a; --px-text:#f7fbff; --px-muted:#b9c8dd; --px-accent:#74e6c2;
        --px-accent2:#8fc9ff; --px-danger:#ff6b7a; --px-warning:#ffd166; --px-ok:#72e096;
        --px-line:rgba(255,255,255,.12); --px-input:#0f2341; --px-pill:#122747; --px-secondary:#2a4774;
        --px-card-a:rgba(255,255,255,.04); --px-card-b:rgba(255,255,255,.015); --px-soft:rgba(255,255,255,.025);
        --px-primary-text:#08261e; --px-glow-a:rgba(116,230,194,.12); --px-glow-b:rgba(143,201,255,.10);
      }
      body[data-pincode-theme="light"] {
        --px-bg:#eef4f9; --px-text:#132238; --px-muted:#5f7086; --px-accent:#147d6f;
        --px-accent2:#245fa8; --px-danger:#c83d4c; --px-warning:#9a6810; --px-ok:#227a46;
        --px-line:rgba(19,34,56,.15); --px-input:#ffffff; --px-pill:#e5edf6; --px-secondary:#dbe7f3;
        --px-card-a:rgba(255,255,255,.96); --px-card-b:rgba(245,249,253,.98); --px-soft:rgba(19,34,56,.035);
        --px-primary-text:#ffffff; --px-glow-a:rgba(20,125,111,.09); --px-glow-b:rgba(36,95,168,.08);
      }
      body[data-pincode-theme="forest"] {
        --px-bg:#10251f; --px-text:#f4fbf7; --px-muted:#b9d0c5; --px-accent:#89e6b0;
        --px-accent2:#a8d8c3; --px-danger:#ff7c7c; --px-warning:#f0d678; --px-ok:#8ce7aa;
        --px-line:rgba(232,255,243,.13); --px-input:#15352b; --px-pill:#17382e; --px-secondary:#2c5849;
        --px-card-a:rgba(255,255,255,.04); --px-card-b:rgba(255,255,255,.015); --px-soft:rgba(255,255,255,.025);
        --px-primary-text:#0c2d21; --px-glow-a:rgba(137,230,176,.11); --px-glow-b:rgba(168,216,195,.08);
      }
      body[data-pincode-theme="purple"] {
        --px-bg:#221832; --px-text:#fbf7ff; --px-muted:#d0c2dc; --px-accent:#d8a6ff;
        --px-accent2:#9ec8ff; --px-danger:#ff7890; --px-warning:#ffd279; --px-ok:#92e6b3;
        --px-line:rgba(250,240,255,.13); --px-input:#2c1f41; --px-pill:#33234b; --px-secondary:#50396f;
        --px-card-a:rgba(255,255,255,.04); --px-card-b:rgba(255,255,255,.015); --px-soft:rgba(255,255,255,.025);
        --px-primary-text:#261236; --px-glow-a:rgba(216,166,255,.12); --px-glow-b:rgba(158,200,255,.09);
      }

      body[data-pincode-theme] {
        background:
          radial-gradient(circle at 10% 10%, var(--px-glow-a), transparent 28rem),
          radial-gradient(circle at 90% 20%, var(--px-glow-b), transparent 30rem),
          var(--px-bg) !important;
        color:var(--px-text) !important;
      }
      body[data-pincode-theme] .card {
        background:linear-gradient(180deg,var(--px-card-a),var(--px-card-b)) !important;
        border-color:var(--px-line) !important;
      }
      body[data-pincode-theme] .muted,
      body[data-pincode-theme] label,
      body[data-pincode-theme] th,
      body[data-pincode-theme] .tiny,
      body[data-pincode-theme] .footer-note,
      body[data-pincode-theme] .turn-card span { color:var(--px-muted) !important; }
      body[data-pincode-theme] input:not([type="checkbox"]),
      body[data-pincode-theme] select {
        background:var(--px-input) !important;
        color:var(--px-text) !important;
        border-color:var(--px-line) !important;
      }
      body[data-pincode-theme] .primary { background:var(--px-accent) !important; color:var(--px-primary-text) !important; }
      body[data-pincode-theme] .secondary { background:var(--px-secondary) !important; color:var(--px-text) !important; }
      body[data-pincode-theme] .danger { background:var(--px-danger) !important; }
      body[data-pincode-theme] .ghost { color:var(--px-muted) !important; border-color:var(--px-line) !important; }
      body[data-pincode-theme] .pill { background:var(--px-pill) !important; border-color:var(--px-line) !important; color:var(--px-muted) !important; }
      body[data-pincode-theme] .pill strong { color:var(--px-text) !important; }
      body[data-pincode-theme] .check { color:var(--px-ok) !important; }
      body[data-pincode-theme] .question { color:var(--px-warning) !important; }
      body[data-pincode-theme] .player-card,
      body[data-pincode-theme] .secret-row,
      body[data-pincode-theme] .history-item {
        background:var(--px-soft) !important;
        border-color:var(--px-line) !important;
      }
      body[data-pincode-theme] .turn-card {
        background:color-mix(in srgb, var(--px-accent) 10%, transparent) !important;
        border-color:color-mix(in srgb, var(--px-accent) 35%, transparent) !important;
      }
      body[data-pincode-theme] .turn-card strong,
      body[data-pincode-theme] .secret-code,
      body[data-pincode-theme] .badge { color:var(--px-accent) !important; }
      body[data-pincode-theme] details.debug-panel { border-color:var(--px-line) !important; background:var(--px-soft) !important; }

      .pincode-header-actions {
        display:flex; align-items:center; gap:8px; flex-wrap:wrap; justify-content:flex-end;
      }
      .pincode-small-btn {
        appearance:none; border:1px solid var(--px-line, rgba(255,255,255,.12)); border-radius:999px;
        padding:8px 12px; font-size:13px; font-weight:700; cursor:pointer; white-space:nowrap;
        background:var(--px-secondary,#2a4774); color:var(--px-text,#f7fbff);
      }
      .pincode-small-btn.secondary-action { background:transparent; }
      .pincode-small-btn:disabled { opacity:.65; cursor:wait; transform:none; }
      .pincode-settings-card { padding:18px 20px !important; }
      .pincode-settings-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; margin-top:14px; }
      .pincode-switch-row {
        display:flex; justify-content:space-between; gap:16px; align-items:center; min-height:52px;
        padding:10px 12px; border:1px solid var(--px-line,rgba(255,255,255,.12)); border-radius:14px;
        background:var(--px-soft,rgba(255,255,255,.025));
      }
      .pincode-switch-row label { margin:0 !important; color:var(--px-text,#f7fbff) !important; font-size:16px; }
      .pincode-switch-row small { display:block; color:var(--px-muted,#b9c8dd); margin-top:3px; }
      .pincode-switch-row input[type="checkbox"] { width:24px; height:24px; flex:0 0 auto; accent-color:var(--px-accent,#74e6c2); }
      .pincode-wake-status { margin-top:8px; font-size:12px; color:var(--px-muted,#b9c8dd); }

      @media (max-width:700px) {
        .pincode-header-actions { justify-content:flex-start; }
        .pincode-settings-grid { grid-template-columns:1fr; }
      }
    `;
    document.head.appendChild(style);
  }

  function applyTheme(theme) {
    const allowed = ["midnight", "light", "forest", "purple"];
    const chosen = allowed.includes(theme) ? theme : "midnight";
    settings.theme = chosen;
    document.body.dataset.pincodeTheme = chosen;

    const select = document.getElementById("pincodeThemeSelect");
    if (select) select.value = chosen;

    const themeColor = {
      midnight: "#14284a",
      light: "#eef4f9",
      forest: "#10251f",
      purple: "#221832"
    }[chosen];
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColor);
    saveSettings();
  }

  function createHeaderActions() {
    const header = document.querySelector("header");
    if (!header || document.getElementById("pincodeHeaderActions")) return;

    const actions = document.createElement("div");
    actions.id = "pincodeHeaderActions";
    actions.className = "pincode-header-actions";

    const settingsButton = document.createElement("button");
    settingsButton.id = "pincodeSettingsBtn";
    settingsButton.type = "button";
    settingsButton.className = "pincode-small-btn secondary-action";
    settingsButton.textContent = "⚙ Instellingen";

    const refreshButton = document.createElement("button");
    refreshButton.id = "refreshAppBtn";
    refreshButton.type = "button";
    refreshButton.className = "pincode-small-btn";
    refreshButton.textContent = "↻ Vernieuwen";
    refreshButton.title = "Controleer op een nieuwe versie";

    actions.append(settingsButton, refreshButton);

    const badge = header.querySelector(".badge");
    if (badge) header.insertBefore(actions, badge);
    else header.appendChild(actions);

    settingsButton.addEventListener("click", () => toggleSettings());
    refreshButton.addEventListener("click", refreshApp);
  }

  function createSettingsPanel() {
    if (document.getElementById("pincodeSettingsPanel")) return;

    const setup = document.getElementById("setup");
    const header = document.querySelector("header");
    if (!setup || !header) return;

    const panel = document.createElement("section");
    panel.id = "pincodeSettingsPanel";
    panel.className = "card pincode-settings-card hidden";
    panel.innerHTML = `
      <div class="row space">
        <h2 style="margin:0">Instellingen</h2>
        <button id="pincodeCloseSettingsBtn" class="ghost" type="button">Sluiten</button>
      </div>
      <div class="pincode-settings-grid">
        <div>
          <label for="pincodeThemeSelect">Kleurschema</label>
          <select id="pincodeThemeSelect">
            <option value="midnight">Nachtblauw</option>
            <option value="light">Licht</option>
            <option value="forest">Bosgroen</option>
            <option value="purple">Paars</option>
          </select>
        </div>
        <div>
          <div class="pincode-switch-row">
            <div>
              <label for="pincodeKeepAwake">Scherm wakker houden</label>
              <small>Voorkomt automatisch vergrendelen terwijl Pincode op de voorgrond staat.</small>
            </div>
            <input id="pincodeKeepAwake" type="checkbox" />
          </div>
          <div id="pincodeWakeStatus" class="pincode-wake-status"></div>
        </div>
      </div>
    `;

    header.insertAdjacentElement("afterend", panel);

    document.getElementById("pincodeCloseSettingsBtn").addEventListener("click", () => toggleSettings(false));
    document.getElementById("pincodeThemeSelect").addEventListener("change", event => applyTheme(event.target.value));

    const awakeToggle = document.getElementById("pincodeKeepAwake");
    awakeToggle.checked = settings.keepAwake;
    awakeToggle.addEventListener("change", async () => {
      settings.keepAwake = awakeToggle.checked;
      saveSettings();
      if (settings.keepAwake) await requestWakeLock();
      else await releaseWakeLock();
    });
  }

  function toggleSettings(force) {
    const panel = document.getElementById("pincodeSettingsPanel");
    if (!panel) return;

    const open = typeof force === "boolean" ? force : panel.classList.contains("hidden");
    panel.classList.toggle("hidden", !open);
    if (open) panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function setWakeStatus(message) {
    const status = document.getElementById("pincodeWakeStatus");
    if (status) status.textContent = message || "";
  }

  async function requestWakeLock() {
    if (!settings.keepAwake) return;

    if (!("wakeLock" in navigator)) {
      setWakeStatus("Niet ondersteund door deze iOS/Safari-versie.");
      return;
    }

    if (document.visibilityState !== "visible" || wakeLock) return;

    try {
      wakeLock = await navigator.wakeLock.request("screen");
      setWakeStatus("Actief zolang Pincode op de voorgrond staat.");

      wakeLock.addEventListener("release", () => {
        wakeLock = null;
        if (settings.keepAwake && document.visibilityState === "visible") {
          setWakeStatus("Wordt opnieuw geactiveerd zodra de app actief is.");
        }
      }, { once: true });
    } catch (error) {
      console.warn("Scherm wakker houden kon niet worden geactiveerd:", error);
      setWakeStatus("Kon niet activeren. Tik eenmaal in de app en probeer opnieuw.");
    }
  }

  async function releaseWakeLock() {
    if (wakeLock) {
      try { await wakeLock.release(); } catch {}
      wakeLock = null;
    }
    setWakeStatus("Uitgeschakeld.");
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

      window.setTimeout(reload, 700);
    } catch (error) {
      console.warn("Updatecontrole mislukt; pagina wordt normaal herladen.", error);
      reload();
    }
  }

  function init() {
    injectStyles();
    createHeaderActions();
    createSettingsPanel();
    applyTheme(settings.theme);

    const awakeToggle = document.getElementById("pincodeKeepAwake");
    if (awakeToggle) awakeToggle.checked = settings.keepAwake;

    if (settings.keepAwake) requestWakeLock();
    else setWakeStatus("Uitgeschakeld.");

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && settings.keepAwake) requestWakeLock();
    });

    document.addEventListener("pointerdown", () => {
      if (settings.keepAwake && !wakeLock) requestWakeLock();
    }, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
