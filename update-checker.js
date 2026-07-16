(() => {
  const CURRENT_VERSION = '1.0.0';
  const REPO = 'tewiqpy-ai/tictactoe-game';

  async function checkForUpdate() {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${REPO}/releases/latest`
      );
      if (!res.ok) return null;
      const data = await res.json();
      const latestVersion = data.tag_name?.replace(/^v/, '');
      if (!latestVersion || latestVersion === CURRENT_VERSION) return null;

      const apkAsset = data.assets?.find(a => a.name.endsWith('.apk'));
      if (!apkAsset) return null;

      return {
        version: latestVersion,
        downloadUrl: apkAsset.browser_download_url,
        releaseUrl: data.html_url,
        notes: data.body || ''
      };
    } catch {
      return null;
    }
  }

  function showModal(update) {
    const existing = document.getElementById('update-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'update-overlay';
    overlay.innerHTML = `
      <style>
        #update-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(10, 14, 26, 0.85);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: fadeIn 0.3s ease;
        }
        #update-modal {
          background: var(--surface, #141929);
          border: 1px solid var(--border, #1e2540);
          border-radius: 20px;
          padding: 32px 28px;
          max-width: 340px;
          width: 100%;
          text-align: center;
          animation: slideUp 0.35s ease;
        }
        #update-modal h2 {
          font-size: 1.25rem;
          font-weight: 800;
          margin-bottom: 8px;
          color: #fff;
        }
        #update-modal .update-version {
          font-size: 0.82rem;
          color: var(--x-color, #00d4ff);
          font-weight: 700;
          margin-bottom: 16px;
        }
        #update-modal .update-notes {
          font-size: 0.82rem;
          color: var(--text-dim, #5a6480);
          margin-bottom: 20px;
          line-height: 1.5;
          max-height: 80px;
          overflow-y: auto;
          text-align: left;
          white-space: pre-wrap;
        }
        #update-modal .update-btn {
          display: block;
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        #update-modal .update-btn.primary {
          background: var(--x-color, #00d4ff);
          color: #0a0e1a;
          margin-bottom: 10px;
        }
        #update-modal .update-btn.primary:active {
          transform: scale(0.97);
        }
        #update-modal .update-btn.secondary {
          background: transparent;
          color: var(--text-dim, #5a6480);
          border: 1px solid var(--border, #1e2540);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
      <div id="update-modal">
        <h2>Доступно обновление!</h2>
        <div class="update-version">v${update.version}</div>
        ${update.notes ? `<div class="update-notes">${update.notes}</div>` : ''}
        <button class="update-btn primary" id="update-apply">Скачать обновление</button>
        <button class="update-btn secondary" id="update-dismiss">Позже</button>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('update-apply').addEventListener('click', () => {
      window.open(update.downloadUrl, '_system');
      overlay.remove();
    });

    document.getElementById('update-dismiss').addEventListener('click', () => {
      overlay.remove();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
  }

  function showBanner(update) {
    const banner = document.getElementById('update-banner');
    const text = document.getElementById('update-banner-text');
    if (!banner) return;
    if (text) text.textContent = `Обновление до v${update.version}`;
    banner.style.display = 'flex';
    banner.addEventListener('click', () => showModal(update));
  }

  checkForUpdate().then(update => {
    if (update) {
      showBanner(update);
      setTimeout(() => showModal(update), 1500);
    }
  });
})();
