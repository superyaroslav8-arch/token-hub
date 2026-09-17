/*
 * Token Hub — база игр и наград
 *
 * ВАЖНО:
 * - code = реальный проверенный код, если он существует.
 * - null = конкретного кода сейчас нет.
 * - source = источник информации о награде.
 * - officialUrl = официальный сайт игры/активации.
 *
 * Этот файл можно обновлять отдельно от основной логики сайта.
 */

const TOKEN_HUB_DATA = {

  version: 1,

  updatedAt: "2026-09-17",

  games: {

    roblox: {
      id: "roblox",
      name: "Roblox",
      shortName: "Roblox",
      icon: "🎮",

      currencies: [
        "Robux"
      ],

      officialUrl:
        "https://www.roblox.com/",

      redeemUrl:
        "https://www.roblox.com/redeem",

      description:
        "Игровая платформа Roblox.",

      rewards: [

        {
          id: "roblox-codes",
          title: "Коды Roblox-игр",
          description:
            "Проверяй доступные коды отдельных игр внутри Roblox.",

          category: "codes",

          code: null,

          rewardType: "in-game",

          reward: "Предметы и игровые награды",

          status: "available",

          source:
            "https://claimcodes.gg/",

          officialUrl:
            "https://www.roblox.com/",

          requiresAccount: true,

          verified: false,

          lastChecked:
            "2026-09-17"
        },

        {
          id: "roblox-redeem",
          title: "Официальная активация Roblox",

          description:
            "Официальная страница Roblox для активации поддерживаемых кодов.",

          category: "official",

          code: null,

          rewardType: "redeem",

          reward: "Зависит от кода",

          status: "available",

          source:
            "https://www.roblox.com/redeem",

          officialUrl:
            "https://www.roblox.com/redeem",

          requiresAccount: true,

          verified: true,

          lastChecked:
            "2026-09-17"
        }

      ]
    },


    fortnite: {

      id: "fortnite",
      name: "Fortnite",
      shortName: "Fortnite",
      icon: "🪂",

      currencies: [
        "V-Bucks"
      ],

      officialUrl:
        "https://www.fortnite.com/",

      redeemUrl:
        "https://www.epicgames.com/redeem",

      description:
        "Fortnite от Epic Games.",

      rewards: [

        {
          id: "fortnite-official",
          title: "Официальные предложения Fortnite",

          description:
            "Проверяй официальные предложения, события и поддерживаемые коды Fortnite.",

          category: "official",

          code: null,

          rewardType: "redeem",

          reward: "Зависит от предложения или кода",

          status: "available",

          source:
            "https://www.fortnite.com/",

          officialUrl:
            "https://www.fortnite.com/",

          requiresAccount: true,

          verified: true,

          lastChecked:
            "2026-09-17"
        },

        {
          id: "fortnite-codes",
          title: "Коды Fortnite",

          description:
            "Каталог информации о доступных игровых кодах и предложениях.",

          category: "codes",

          code: null,

          rewardType: "redeem",

          reward: "Зависит от кода",

          status: "available",

          source:
            "https://claimcodes.gg/",

          officialUrl:
            "https://www.epicgames.com/redeem",

          requiresAccount: true,

          verified: false,

          lastChecked:
            "2026-09-17"
        }

      ]
    },


    brawlstars: {

      id: "brawlstars",
      name: "Brawl Stars",
      shortName: "Brawl Stars",
      icon: "⭐",

      currencies: [
        "Gems",
        "Coins"
      ],

      officialUrl:
        "https://supercell.com/en/games/brawlstars/",

      description:
        "Мобильная игра Brawl Stars от Supercell.",

      rewards: [

        {
          id: "brawlstars-codes",
          title: "Коды Brawl Stars",

          description:
            "Проверяй доступные коды и игровые предложения.",

          category: "codes",

          code: null,

          rewardType: "in-game",

          reward: "Игровые предметы и награды",

          status: "available",

          source:
            "https://claimcodes.gg/",

          officialUrl:
            "https://supercell.com/en/games/brawlstars/",

          requiresAccount: true,

          verified: false,

          lastChecked:
            "2026-09-17"
        }

      ]
    },


    minecraft: {

      id: "minecraft",
      name: "Minecraft",
      shortName: "Minecraft",
      icon: "⛏️",

      currencies: [
        "Minecoins"
      ],

      officialUrl:
        "https://www.minecraft.net/",

      description:
        "Minecraft от Mojang Studios.",

      rewards: [

        {
          id: "minecraft-official",
          title: "Официальные предложения Minecraft",

          description:
            "Переход к официальному сайту Minecraft для проверки доступных предложений.",

          category: "official",

          code: null,

          rewardType: "official",

          reward: "Зависит от предложения",

          status: "available",

          source:
            "https://www.minecraft.net/",

          officialUrl:
            "https://www.minecraft.net/",

          requiresAccount: true,

          verified: true,

          lastChecked:
            "2026-09-17"
        }

      ]
    }

  },


  categories: {

    all: {
      id: "all",
      name: "Все"
    },

    codes: {
      id: "codes",
      name: "Коды"
    },

    official: {
      id: "official",
      name: "Официальные"
    },

    "in-game": {
      id: "in-game",
      name: "Игровые награды"
    }

  },


  settings: {

    showUnverified: true,

    showExpired: false,

    showUnavailable: false,

    requireVerificationForCopy: true,

    requireOfficialUrlForRedeem: true

  }

};


/*
 * Получить игру
 */

function getGame(gameId) {

  return TOKEN_HUB_DATA.games[gameId] || null;

}


/*
 * Получить все игры
 */

function getGames() {

  return Object.values(
    TOKEN_HUB_DATA.games
  );

}


/*
 * Получить награды конкретной игры
 */

function getGameRewards(gameId) {

  const game = getGame(gameId);

  if (!game) {
    return [];
  }

  return game.rewards || [];

}


/*
 * Найти награды
 */

function searchRewards({
  gameId = null,
  query = "",
  category = "all"
} = {}) {

  let rewards = [];

  if (gameId) {

    rewards = getGameRewards(gameId);

  } else {

    Object.values(TOKEN_HUB_DATA.games)
      .forEach(game => {

        rewards.push(
          ...game.rewards
        );

      });

  }


  const normalizedQuery =
    query
      .trim()
      .toLowerCase();


  return rewards.filter(reward => {

    const matchesCategory =
      category === "all" ||
      reward.category === category;


    if (!matchesCategory) {
      return false;
    }


    if (!normalizedQuery) {
      return true;
    }


    const searchableText = [

      reward.title,
      reward.description,
      reward.reward,
      reward.category

    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();


    return searchableText
      .includes(normalizedQuery);

  });

}


/*
 * Получить только проверенные записи
 */

function getVerifiedRewards(gameId = null) {

  return searchRewards({
    gameId
  })
    .filter(reward =>
      reward.verified === true
    );

}


/*
 * Получить только записи с кодами
 */

function getRewardsWithCodes(gameId = null) {

  return searchRewards({
    gameId
  })
    .filter(reward =>
      typeof reward.code === "string" &&
      reward.code.trim().length > 0
    );

}


/*
 * Проверка существования кода
 */

function hasCode(reward) {

  return Boolean(
    reward &&
    typeof reward.code === "string" &&
    reward.code.trim()
  );

}


/*
 * Получить статистику базы
 */

function getDatabaseStats() {

  const games =
    Object.values(
      TOKEN_HUB_DATA.games
    );

  const rewards =
    games.flatMap(
      game => game.rewards || []
    );

  return {

    version:
      TOKEN_HUB_DATA.version,

    updatedAt:
      TOKEN_HUB_DATA.updatedAt,

    games:
      games.length,

    rewards:
      rewards.length,

    verified:
      rewards.filter(
        reward => reward.verified
      ).length,

    withCodes:
      rewards.filter(
        reward => hasCode(reward)
      ).length

  };

}