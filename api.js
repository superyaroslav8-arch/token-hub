const TokenHubAPI = {

  async getGames() {
    return TOKEN_HUB_DATA.games;
  },

  async getProfile() {
    const raw = localStorage.getItem(
      TOKEN_HUB_CONFIG.storage.profile
    );

    return raw ? JSON.parse(raw) : null;
  },

  async saveProfile(profile) {
    localStorage.setItem(
      TOKEN_HUB_CONFIG.storage.profile,
      JSON.stringify(profile)
    );

    return profile;
  },

  async getBalance() {
    return Number(
      localStorage.getItem(
        TOKEN_HUB_CONFIG.storage.balance
      ) || 0
    );
  },

  async setBalance(amount) {
    localStorage.setItem(
      TOKEN_HUB_CONFIG.storage.balance,
      String(Math.max(0, Math.floor(amount)))
    );

    return Math.max(0, Math.floor(amount));
  },

  async getTransactions() {
    const raw = localStorage.getItem(
      TOKEN_HUB_CONFIG.storage.transactions
    );

    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  async addTransaction(transaction) {

    const transactions =
      await this.getTransactions();

    transactions.unshift(transaction);

    const limited = transactions.slice(
      0,
      TOKEN_HUB_CONFIG.limits.transactions
    );

    localStorage.setItem(
      TOKEN_HUB_CONFIG.storage.transactions,
      JSON.stringify(limited)
    );

    return transaction;
  },

  async addCoins(amount, reason) {

    const current =
      await this.getBalance();

    const value =
      Math.max(0, Math.floor(amount));

    const next =
      current + value;

    await this.setBalance(next);

    await this.addTransaction({
      id: crypto.randomUUID(),
      type: "earn",
      amount: value,
      reason,
      date: new Date().toISOString(),
      balanceAfter: next
    });

    return next;
  },

  async claimReward(reward) {

    const current =
      await this.getBalance();

    const amount =
      Math.max(0, Math.floor(reward.amount));

    const next =
      current + amount;

    await this.setBalance(next);

    await this.addTransaction({
      id: crypto.randomUUID(),
      type: "reward",
      amount,
      reason: reward.title,
      date: new Date().toISOString(),
      balanceAfter: next
    });

    return next;
  }

};