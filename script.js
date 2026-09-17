document.addEventListener("DOMContentLoaded", () => {

  const $ = (selector) =>
    document.querySelector(selector);

  const $$ = (selector) =>
    document.querySelectorAll(selector);

  const gamesGrid = $("#gamesGrid");
  const gameSearch = $("#gameSearch");
  const currencyFilter = $("#currencyFilter");
  const gamesCount = $("#gamesCount");
  const homeBalance = $("#homeBalance");

  const profileButton = $("#profileButton");
  const profileModal = $("#profileModal");
  const closeProfile = $("#closeProfile");
  const saveProfile = $("#saveProfile");
  const nicknameInput = $("#nicknameInput");

  const toast = $("#toast");

  function showToast(message) {

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  function escapeHtml(value) {

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function updateBalance() {

    if (!homeBalance) return;

    const balance =
      await TokenHubAPI.getBalance();

    homeBalance.textContent =
      balance.toLocaleString("ru-RU");
  }

  async function updateProfileButton() {

    if (!profileButton) return;

    const profile =
      await TokenHubAPI.getProfile();

    if (!profile) {
      profileButton.textContent = "Войти";
      return;
    }

    profileButton.textContent =
      profile.nickname;
  }

  function buildCurrencyFilter() {

    if (!currencyFilter) return;

    const currencies = new Set();

    TOKEN_HUB_DATA.games.forEach(game => {

      game.currencies.forEach(currency => {
        currencies.add(currency);
      });

    });

    [...currencies]
      .sort((a, b) =>
        a.localeCompare(b, "ru")
      )
      .forEach(currency => {

        const option =
          document.createElement("option");

        option.value = currency;
        option.textContent = currency;

        currencyFilter.appendChild(option);
      });
  }

  function getFilteredGames() {

    const query =
      (gameSearch?.value || "")
        .trim()
        .toLowerCase();

    const currency =
      currencyFilter?.value || "all";

    return TOKEN_HUB_DATA.games.filter(game => {

      const matchesSearch =
        !query ||
        game.name
          .toLowerCase()
          .includes(query) ||
        game.currencies.some(item =>
          item.toLowerCase().includes(query)
        );

      const matchesCurrency =
        currency === "all" ||
        game.currencies.includes(currency);

      return matchesSearch && matchesCurrency;
    });
  }

  function renderGames() {

    if (!gamesGrid) return;

    const games =
      getFilteredGames();

    gamesCount.textContent =
      `${games.length} игр`;

    if (!games.length) {

      gamesGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">⌕</div>
          <h3>Ничего не найдено</h3>
          <p>Попробуй изменить запрос или фильтр.</p>
        </div>
      `;

      return;
    }

    gamesGrid.innerHTML =
      games.map(game => `

        <article class="game-card">

          <div class="game-icon">
            ${escapeHtml(game.icon)}
          </div>

          <div class="game-content">

            <h3>
              ${escapeHtml(game.name)}
            </h3>

            <div class="currency-list">

              ${game.currencies.map(currency => `
                <span class="currency-tag">
                  ${escapeHtml(currency)}
                </span>
              `).join("")}

            </div>

          </div>

          <button
            class="game-button"
            data-game="${escapeHtml(game.id)}"
          >
            Открыть
          </button>

        </article>

      `).join("");
  }

  async function createProfile() {

    const nickname =
      nicknameInput.value.trim();

    if (!nickname) {
      showToast("Введи никнейм.");
      return;
    }

    if (nickname.length < 2) {
      showToast("Никнейм должен содержать минимум 2 символа.");
      return;
    }

    const oldProfile =
      await TokenHubAPI.getProfile();

    const isNew =
      !oldProfile;

    const profile = {
      nickname,
      createdAt:
        oldProfile?.createdAt ||
        new Date().toISOString()
    };

    await TokenHubAPI.saveProfile(profile);

    if (isNew) {

      const balance =
        await TokenHubAPI.getBalance();

      if (balance === 0) {

        await TokenHubAPI.addCoins(
          TOKEN_HUB_CONFIG.rewards.welcomeBonus,
          "Приветственный бонус"
        );

      }

    }

    profileModal.classList.add("hidden");

    await updateProfileButton();
    await updateBalance();

    showToast(
      isNew
        ? "Профиль создан. Начислено 100 THC."
        : "Профиль обновлён."
    );
  }

  function openProfile() {

    profileModal.classList.remove("hidden");

    TokenHubAPI.getProfile()
      .then(profile => {

        nicknameInput.value =
          profile?.nickname || "";

        saveProfile.textContent =
          profile
            ? "Сохранить"
            : "Создать профиль";
      });
  }

  profileButton?.addEventListener(
    "click",
    openProfile
  );

  closeProfile?.addEventListener(
    "click",
    () => profileModal.classList.add("hidden")
  );

  profileModal?.addEventListener(
    "click",
    event => {

      if (event.target === profileModal) {
        profileModal.classList.add("hidden");
      }

    }
  );

  saveProfile?.addEventListener(
    "click",
    createProfile
  );

  nicknameInput?.addEventListener(
    "keydown",
    event => {

      if (event.key === "Enter") {
        createProfile();
      }

    }
  );

  gameSearch?.addEventListener(
    "input",
    renderGames
  );

  currencyFilter?.addEventListener(
    "change",
    renderGames
  );

  gamesGrid?.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest("[data-game]");

      if (!button) return;

      const game =
        TOKEN_HUB_DATA.games.find(
          item => item.id === button.dataset.game
        );

      if (!game) return;

      showToast(
        `${game.name}: валюты ${game.currencies.join(", ")}`
      );
    }
  );

  buildCurrencyFilter();
  renderGames();
  updateBalance();
  updateProfileButton();

});