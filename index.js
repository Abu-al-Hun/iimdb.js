const { WickDB } = require("wick.db");
const fs = require("fs");
const path = require("path");

class IIMDB {
  constructor() {
    this.databasePath = path.resolve(__dirname, "src/data/iimdb.json");
    this.radioDatabasePath = path.resolve(__dirname, "src/data/radios.json");
    this.questionsDatabasePath = path.resolve(
      __dirname,
      "src/data/questions.json"
    );
    this.sentLogKey = "sentLog";
    this.db = new WickDB();

    this.data = this.loadDatabase();
    this.radioData = this.loadRadioDatabase();
    this.questionsData = this.loadQuestionsDatabase();
    this.sentLog = this.loadSentLog();

    this.apiKeys = {
      prayers: "iimdb_1",
      radios: "iimdb_2",
      questions: "iimdb_3",
    };
  }

  loadDatabase() {
    try {
      const prayersData = fs.readFileSync(this.databasePath, "utf8");
      const prayers = JSON.parse(prayersData).prayers || [];
      return { prayers };
    } catch (error) {
      console.error("Error loading prayers from iimdb.json:", error);
      return { prayers: [] };
    }
  }

  loadRadioDatabase() {
    try {
      const radiosData = fs.readFileSync(this.radioDatabasePath, "utf8");
      const radios = JSON.parse(radiosData).radios || {};
      return { radios };
    } catch (error) {
      console.error("Error loading radios from radios.json:", error);
      return { radios: {} };
    }
  }

  loadQuestionsDatabase() {
    try {
      const questionsData = fs.readFileSync(this.questionsDatabasePath, "utf8");
      const questions = JSON.parse(questionsData).questions || [];
      return { questions };
    } catch (error) {
      console.error("Error loading questions from questions.json:", error);
      return { questions: [] };
    }
  }

  loadSentLog() {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const sentLog = this.db.get(this.sentLogKey) || {};

      if (sentLog.date !== today) {
        this.db.set(this.sentLogKey, { date: today, log: {} });
        return { date: today, log: {} };
      }

      return sentLog;
    } catch (error) {
      console.error("Error loading the sent log:", error);
      return { date: new Date().toISOString().slice(0, 10), log: {} };
    }
  }

  saveSentLog() {
    try {
      this.db.set(this.sentLogKey, this.sentLog);
    } catch (error) {
      console.error("Error saving the sent log:", error);
    }
  }

  validateApiUsage(apiKey, type) {
    if (this.apiKeys[type] !== apiKey) {
      throw new Error(`Invalid API key for ${type}. Access denied`);
    }
  }

  sendPrayer(apiKey, senderId, count) {
    this.validateApiUsage(apiKey, "prayers");

    if (!IIMDB.hasDisplayedWarning) {
      console.log(
        "\x1b[33m[Warning]\x1b[0m: \x1b[36mIIMDB Library is in beta. Please use with caution.\x1b[0m"
      );
      IIMDB.hasDisplayedWarning = true;
    }

    if (!Array.isArray(this.data.prayers) || this.data.prayers.length === 0) {
      console.error("No prayers available in the database");
      return { prayers: [] };
    }

    if (!this.sentLog.log[senderId]) {
      this.sentLog.log[senderId] = [];
    }

    const today = new Date().toISOString().slice(0, 10);

    const availablePrayers = this.data.prayers.filter(
      (prayer) => !this.sentLog.log[senderId].includes(`${today}:${prayer}`)
    );

    const shuffledPrayers = availablePrayers.sort(() => Math.random() - 0.5);

    const selectedPrayers = shuffledPrayers.slice(0, count);

    this.sentLog.log[senderId].push(
      ...selectedPrayers.map((prayer) => `${today}:${prayer}`)
    );

    this.saveSentLog();

    return { prayers: selectedPrayers };
  }

  getPrayers(apiKey, senderId, count) {
    this.validateApiUsage(apiKey, "prayers");
    return this.sendPrayer(apiKey, senderId, count);
  }

  getRadios(apiKey, senderId) {
    this.validateApiUsage(apiKey, "radios");

    if (
      !this.radioData.radios ||
      Object.keys(this.radioData.radios).length === 0
    ) {
      console.error("No radios available in the database");
      return { radios: {} };
    }

    return { radios: this.radioData.radios };
  }

  getQuestions(apiKey, senderId) {
    this.validateApiUsage(apiKey, "questions");

    if (
      !this.questionsData.questions ||
      this.questionsData.questions.length === 0
    ) {
      console.error("No questions available in the database");
      return { questions: [] };
    }

    return { questions: this.questionsData.questions };
  }
}

IIMDB.hasDisplayedWarning = false;

module.exports = IIMDB;
