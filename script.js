"use strict";

/*
 * Token Hub
 * Основная логика приложения.
 *
 * Все игровые данные находятся в data.js.
 */

const HISTORY_KEY = "tokenHub.history";

const gameSelect =
  document.getElementById("game");

const categorySelect =
  document.getElementById("category");

const searchInput =
  document.getElementById("search");

const findButton =
  document.getElementById("findButton");

const refreshButton =
  document.getElementById("refreshButton");

const results =
  document.getElementById("results");

const resultsInfo =
  document.getElementById("resultsInfo");

const historyContainer =
  document.getElementById("history");

const clearHistoryButton =
  document.getElementById("clearHistory");

const gamesCount =
  document.getElementById("gamesCount");

const rewardsCount =
  document.getElementById("rewardsCount");

const verifiedCount =
  document.getElementById("verifiedCount");

const helpButton =
  document.getElementById("helpButton");

const helpModal =
  document.getElementById("helpModal");

const closeHelp =
  document.getElementById("closeHelp");

const toast =
  document.getElementById("toast");


/* -------------------------------- */
/* HELPERS */
/* -------------------------------- */

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function getHistory() {

  try {

    const value =
      localStorage.getItem(
        HISTORY_KEY
      );

    const parsed =
      JSON.parse(value || "[]");

    return Array.isArray(parsed)
      ? parsed
      : [];

  } catch {

    return [];

  }

}


function saveHistory(item) {

  const history =
    getHistory();

  history.unshift(item);

  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(
      history.slice(0, 30)
    )
  );

  renderHistory();

}


function showToast(message) {

  toast.textContent =
    message;

  toast.classList.add(
    "show"
  );

  clearTimeout(
    showToast.timeout
  );

  showToast.timeout =
    setTimeout(() => {

      toast.classList.remove(
        "show"
      );

    }, 2200);

}


function getCurrentGameId() {

  return gameSelect.value;

}


function getCurrentGame() {

  return getGame(
    getCurrentGameId()
  );

}


/* -------------------------------- */
/* GAMES */
/* -------------------------------- */

function renderGameSelect() {

  const games =
    getGames();

  gameSelect.innerHTML = "";

  games.forEach(game => {

    const option =
      document.createElement(
        "option"
      );

    option.value =
      game.id;

    option.textContent =
      `${game.icon} ${game.name}`;

    gameSelect.appendChild(
      option
    );

  });

}


/* -------------------------------- */
/* STATISTICS */
/* -------------------------------- */

function renderStats() {

  const stats =
    getDatabaseStats();

  gamesCount.textContent =
    stats.games;

  rewardsCount.textContent =
    stats.rewards;

  verifiedCount.textContent =
    stats.verified;

}


/* -------------------------------- */
/* REWARDS */
/* -------------------------------- */

function renderRewards() {

  const gameId =
    getCurrentGameId();

  const game =
    getCurrentGame();

  if (!game) {

    results.innerHTML = `
      <div class="empty">
        Игра не найдена.
      </div>
    `;

    return;

  }


  const query =
    searchInput.value.trim();

  const category =
    categorySelect.value;


  const rewards =
    searchRewards({

      gameId,
      query,
      category

    });


  resultsInfo.textContent =
    `${game.name} · найдено: ${rewards.length}`;


  if (!rewards.length) {

    results.innerHTML = `
      <div class="empty">
        По вашему запросу
        ничего не найдено.
      </div>
    `;

    return;

  }


  results.innerHTML =
    rewards
      .map(
        reward =>
          createRewardCard(
            reward,
            game
          )
      )
      .join("");


  attachRewardEvents();

}


/* -------------------------------- */
/* CARD */
/* -------------------------------- */

function createRewardCard(
  reward,
  game
) {

  const hasRealCode =
    hasCode(reward);


  const code =
    hasRealCode
      ? `
        <div class="reward-code">
          ${escapeHTML(
            reward.code
          )}
        </div>
      `
      : "";


  const copyButton =
    hasRealCode
      ? `
        <button
          class="copy-button"
          type="button"
          data-copy-code="${escapeHTML(
            reward.code
          )}"
        >
          Копировать
        </button>
      `
      : "";


  const verifiedBadge =
    reward.verified
      ? `
        <span class="meta verified">
          ✓ Проверено
        </span>
      `
      : `
        <span class="meta">
          Источник
        </span>
      `;


  const statusBadge =
    reward.status === "available"
      ? `
        <span class="meta">
          Доступно
        </span>
      `
      : `
        <span class="meta">
          ${escapeHTML(
            reward.status
          )}
        </span>
      `;


  return `
    <article
      class="reward-card"
      data-reward-id="${escapeHTML(
        reward.id
      )}"
    >

      <div>

        <div class="reward-game">
          ${escapeHTML(
            game.name
          )}
        </div>

        <div class="reward-title">
          ${escapeHTML(
            reward.title
          )}
        </div>

        <div class="reward-description">
          ${escapeHTML(
            reward.description
          )}
        </div>

        <div class="reward-meta">

          ${verifiedBadge}

          ${statusBadge}

          <span class="meta">
            ${escapeHTML(
              reward.category
            )}
          </span>

        </div>

        ${code}

      </div>


      <div class="reward-actions">

        ${copyButton}

        <button
          class="open-button"
          type="button"
          data-open-reward="${escapeHTML(
            reward.id
          )}"
        >
          Открыть
        </button>

      </div>

    </article>
  `;

}


/* -------------------------------- */
/* CARD EVENTS */
/* -------------------------------- */

function attachRewardEvents() {

  document
    .querySelectorAll(
      "[data-copy-code]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        async () => {

          const code =
            button.dataset.copyCode;

          if (!code) {
            return;
          }


          try {

            await navigator.clipboard
              .writeText(code);

            showToast(
              "Код скопирован"
            );

          } catch {

            showToast(
              "Не удалось скопировать код"
            );

          }

        }
      );

    });


  document
    .querySelectorAll(
      "[data-open-reward]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const rewardId =
            button.dataset.openReward;

          openReward(
            rewardId
          );

        }
      );

    });

}


/* -------------------------------- */
/* OPEN REWARD */
/* -------------------------------- */

function openReward(
  rewardId
) {

  const game =
    getCurrentGame();

  if (!game) {
    return;
  }


  const reward =
    game.rewards.find(
      item =>
        item.id === rewardId
    );


  if (!reward) {

    showToast(
      "Награда не найдена"
    );

    return;

  }


  saveHistory({

    id:
      reward.id,

    title:
      reward.title,

    game:
      game.name,

    date:
      new Date()
        .toLocaleString(
          "ru-RU"
        )

  });


  const target =
    reward.officialUrl ||
    reward.source ||
    game.redeemUrl ||
    game.officialUrl;


  if (!target) {

    showToast(
      "Для этой награды нет ссылки"
    );

    return;

  }


  window.open(
    target,
    "_blank",
    "noopener,noreferrer"
  );

}


/* -------------------------------- */
/* HISTORY */
/* -------------------------------- */

function renderHistory() {

  const history =
    getHistory();


  if (!history.length) {

    historyContainer.innerHTML = `
      <div class="empty">
        Здесь появятся
        недавно открытые награды.
      </div>
    `;

    return;

  }


  historyContainer.innerHTML =
    history
      .map(item => `
        <div class="history-item">

          <div>

            <div class="history-name">
              ${escapeHTML(
                item.title
              )}
            </div>

            <div class="history-date">
              ${escapeHTML(
                item.game
              )}
            </div>

          </div>

          <div class="history-date">
            ${escapeHTML(
              item.date
            )}
          </div>

        </div>
      `)
      .join("");

}


/* -------------------------------- */
/* MODAL */
/* -------------------------------- */

function openHelp() {

  helpModal.classList.remove(
    "hidden"
  );

  helpModal.setAttribute(
    "aria-hidden",
    "false"
  );

}


function closeHelpModal() {

  helpModal.classList.add(
    "hidden"
  );

  helpModal.setAttribute(
    "aria-hidden",
    "true"
  );

}


/* -------------------------------- */
/* EVENTS */
/* -------------------------------- */

gameSelect.addEventListener(
  "change",
  renderRewards
);


categorySelect.addEventListener(
  "change",
  renderRewards
);


searchInput.addEventListener(
  "input",
  renderRewards
);


findButton.addEventListener(
  "click",
  renderRewards
);


refreshButton.addEventListener(
  "click",
  () => {

    renderStats();
    renderRewards();

    showToast(
      "Данные обновлены"
    );

  }
);


clearHistoryButton.addEventListener(
  "click",
  () => {

    localStorage.removeItem(
      HISTORY_KEY
    );

    renderHistory();

    showToast(
      "История очищена"
    );

  }
);


helpButton.addEventListener(
  "click",
  openHelp
);


closeHelp.addEventListener(
  "click",
  closeHelpModal
);


helpModal.addEventListener(
  "click",
  event => {

    if (
      event.target ===
      helpModal
    ) {

      closeHelpModal();

    }

  }
);


document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape"
    ) {

      closeHelpModal();

    }

  }
);


/* -------------------------------- */
/* START */
/* -------------------------------- */

function init() {

  renderGameSelect();

  renderStats();

  renderRewards();

  renderHistory();

}


init();