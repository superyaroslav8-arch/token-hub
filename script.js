const games = {
  roblox: {
    name: "Roblox",
    officialUrl: "https://www.roblox.com/redeem",

    rewards: [
      {
        title: "Roblox — игровые коды",
        description:
          "Коды для отдельных Roblox-игр могут давать предметы, XP, внутриигровую валюту или другие награды.",
        code: null,
        source:
          "https://claimcodes.gg/"
      }
    ]
  },

  fortnite: {
    name: "Fortnite",
    officialUrl:
      "https://www.epicgames.com/site/en-US/vbuckscard",

    rewards: [
      {
        title: "Fortnite — доступные коды и награды",
        description:
          "Проверяй доступные официальные предложения и коды. Не вводи данные Epic Games на сторонних сайтах.",
        code: null,
        source:
          "https://claimcodes.gg/"
      }
    ]
  },

  brawlstars: {
    name: "Brawl Stars",
    officialUrl:
      "https://supercell.com/en/games/brawlstars/",

    rewards: [
      {
        title: "Brawl Stars — игровые коды",
        description:
          "Доступные коды и способы получения наград можно проверить в каталоге игровых кодов.",
        code: null,
        source:
          "https://claimcodes.gg/"
      }
    ]
  },

  minecraft: {
    name: "Minecraft",
    officialUrl:
      "https://www.minecraft.net/",

    rewards: [
      {
        title: "Minecraft — официальные предложения",
        description:
          "Переход к официальному сайту Minecraft для проверки доступных предложений.",
        code: null,
        source:
          "https://www.minecraft.net/"
      }
    ]
  }
};

const gameSelect = document.getElementById("game");
const searchInput = document.getElementById("search");
const findButton = document.getElementById("findButton");
const refreshButton = document.getElementById("refreshButton");

const results = document.getElementById("results");
const resultsInfo = document.getElementById("resultsInfo");

const historyContainer = document.getElementById("history");
const clearHistoryButton = document.getElementById("clearHistory");

const toast = document.getElementById("toast");

const helpButton = document.getElementById("helpButton");
const helpModal = document.getElementById("helpModal");
const closeHelp = document.getElementById("closeHelp");

const HISTORY_KEY = "tokenHub.history";

function getHistory() {
  try {
    return JSON.parse(
      localStorage.getItem(HISTORY_KEY) || "[]"
    );
  } catch {
    return [];
  }
}

function saveHistory(item) {
  const history = getHistory();

  history.unshift(item);

  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(history.slice(0, 20))
  );

  renderHistory();
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function renderHistory() {
  const history = getHistory();

  if (!history.length) {
    historyContainer.innerHTML = `
      <div class="empty">
        Здесь появятся недавно открытые награды.
      </div>
    `;

    return;
  }

  historyContainer.innerHTML = history
    .map(item => `
      <div class="history-item">
        <div>
          <div class="history-name">
            ${escapeHTML(item.title)}
          </div>

          <div class="history-date">
            ${escapeHTML(item.game)}
          </div>
        </div>

        <div class="history-date">
          ${escapeHTML(item.date)}
        </div>
      </div>
    `)
    .join("");
}

function getCurrentGame() {
  return games[gameSelect.value];
}

function renderRewards() {
  const game = getCurrentGame();

  const query = searchInput.value
    .trim()
    .toLowerCase();

  let rewards = game.rewards;

  if (query) {
    rewards = rewards.filter(reward => {
      const text = `
        ${reward.title}
        ${reward.description}
      `.toLowerCase();

      return text.includes(query);
    });
  }

  resultsInfo.textContent =
    `${game.name} · найдено: ${rewards.length}`;

  if (!rewards.length) {
    results.innerHTML = `
      <div class="empty">
        По вашему запросу ничего не найдено.
      </div>
    `;

    return;
  }

  results.innerHTML = rewards
    .map((reward, index) => {

      const codeHTML = reward.code
        ? `
          <div class="reward-code">
            ${escapeHTML(reward.code)}
          </div>
        `
        : "";

      const copyButton = reward.code
        ? `
          <button
            class="copy-button"
            data-copy="${escapeHTML(reward.code)}"
          >
            Копировать
          </button>
        `
        : "";

      return `
        <article class="reward-card">

          <div>

            <div class="reward-game">
              ${escapeHTML(game.name)}
            </div>

            <div class="reward-title">
              ${escapeHTML(reward.title)}
            </div>

            <div class="reward-description">
              ${escapeHTML(reward.description)}
            </div>

            ${codeHTML}

          </div>

          <div class="reward-actions">

            ${copyButton}

            <button
              class="open-button"
              data-open="${index}"
            >
              Открыть
            </button>

          </div>

        </article>
      `;
    })
    .join("");

  document
    .querySelectorAll("[data-copy]")
    .forEach(button => {

      button.addEventListener("click", async () => {

        const code = button.dataset.copy;

        try {
          await navigator.clipboard.writeText(code);

          showToast("Код скопирован");

        } catch {
          showToast("Не удалось скопировать код");
        }
      });

    });

  document
    .querySelectorAll("[data-open]")
    .forEach(button => {

      button.addEventListener("click", () => {

        const reward =
          rewards[Number(button.dataset.open)];

        saveHistory({
          title: reward.title,
          game: game.name,
          date: new Date().toLocaleString("ru-RU")
        });

        window.open(
          reward.source || game.officialUrl,
          "_blank",
          "noopener,noreferrer"
        );
      });

    });
}

findButton.addEventListener("click", renderRewards);

refreshButton.addEventListener("click", () => {
  renderRewards();
  showToast("Список обновлён");
});

gameSelect.addEventListener("change", renderRewards);

searchInput.addEventListener("input", renderRewards);

clearHistoryButton.addEventListener("click", () => {

  localStorage.removeItem(HISTORY_KEY);

  renderHistory();

  showToast("История очищена");
});

helpButton.addEventListener("click", () => {
  helpModal.classList.remove("hidden");
});

closeHelp.addEventListener("click", () => {
  helpModal.classList.add("hidden");
});

helpModal.addEventListener("click", event => {

  if (event.target === helpModal) {
    helpModal.classList.add("hidden");
  }

});

renderRewards();
renderHistory();