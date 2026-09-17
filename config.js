const TOKEN_HUB_CONFIG = {
  name: "Token Hub",
  version: "2.0.0",

  currency: {
    id: "THC",
    name: "Token Hub Coin",
    shortName: "THC"
  },

  storage: {
    profile: "tokenHub.profile",
    balance: "tokenHub.balance",
    transactions: "tokenHub.transactions",
    rewards: "tokenHub.claimedRewards"
  },

  limits: {
    nickname: 24,
    transactions: 100
  },

  rewards: {
    dailyLogin: 10,
    welcomeBonus: 100
  }
};