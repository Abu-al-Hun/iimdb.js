const fs = require('fs');
const path = require('path');

class IIMDB {
  constructor() {
    this.databasePath = path.resolve(__dirname, 'iimdb.json');
    this.sentLogPath = path.resolve(__dirname, 'sentLog.json');
    this.data = this.loadDatabase();
    this.sentLog = this.loadSentLog();
  }

  loadDatabase() {
    try {
      if (fs.existsSync(this.databasePath)) {
        const data = JSON.parse(fs.readFileSync(this.databasePath, 'utf8'));
        return data.prayers ? data : { prayers: [] };
      } else {
        console.error('Database file not found');
        return { prayers: [] };
      }
    } catch (error) {
      console.error('Error loading the database:', error);
      return { prayers: [] };
    }
  }

  loadSentLog() {
    try {
      if (fs.existsSync(this.sentLogPath)) {
        return JSON.parse(fs.readFileSync(this.sentLogPath, 'utf8'));
      } else {
        return {};
      }
    } catch (error) {
      console.error('Error loading the sent log:', error);
      return {};
    }
  }

  saveSentLog() {
    try {
      fs.writeFileSync(this.sentLogPath, JSON.stringify(this.sentLog, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving the sent log:', error);
    }
  }

  sendPrayer(senderId, count) {
    if (!Array.isArray(this.data.prayers) || this.data.prayers.length === 0) {
      console.error('No prayers available in the database');
      return { prayers: [] };
    }

    if (!this.sentLog[senderId]) {
      this.sentLog[senderId] = [];
    }

    const today = new Date().toISOString().slice(0, 10);

    const availablePrayers = this.data.prayers.filter(
      (prayer) => !this.sentLog[senderId].includes(`${today}:${prayer}`)
    );

    const selectedPrayers = availablePrayers.slice(0, count);

    this.sentLog[senderId].push(
      ...selectedPrayers.map((prayer) => `${today}:${prayer}`)
    );

    this.saveSentLog();

    return { prayers: selectedPrayers };
  }
}

module.exports = IIMDB;
