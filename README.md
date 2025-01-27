## iimdb.js

iimdb.js is an Islamic library designed to store Hadiths, supplications, and more, with easy management through structured data and daily prayer tracking. The library integrates with wick.db and better-sqlite3 for database management and ensures that prayers are sent only once per day for each user.

## Library Features

- Storing Hadiths: Manages and stores Hadiths in an easy-to-use format
- Managing Supplications: Organizes and sends supplications randomly from the available list
- Daily Prayer Tracking: Ensures prayers are sent only once per day per user
- Radio Integration: Allows playing of radio stations (Islamic broadcasts)
- Question Handling: Fetches Islamic questions for users to engage with
- Database Management: Utilizes wick.db and better-sqlite3 to handle all data storage and management

## Supported Node.js Versions

This library supports the following versions of Node.js:

- 14.x
- 16.x
- 18.x and above

## Installation

```js
npm install iimdb.js
npm install wick.db better-sqlite3
```

- iimdb.js: The core library.
- wick.db: A key-value store for handling data.
- better-sqlite3: A fast and efficient SQLite library for database queries.

## How to Use

API Keys
This library uses the following API keys for different services:

- Prayers: iimdb_1
- Radios: iimdb_2
- Questions: iimdb_3

Each API key provides access to a specific service, ensuring proper data usage and managementYou'll need to include these API keys in the requests to interact with the database.

Basic Example
Here is an example of how you can integrate this library into a Discord bot to send prayers and handle radio requests:

- Sending Prayers: You can use the getPrayers method to fetch and send daily prayers to users.
- Radio Integration: The getRadios method allows users to fetch available radio stations and \*play them in a voice channel.
- Question Management: The getQuestions method enables fetching and sending Islamic questions to users.

## Warning

This library is currently in beta. Use with caution as future updates may introduce breaking changes

## Author

Developed by passionate developers from Skoda Studio to spread Islamic knowledge in the digital world.

## GitHub Repository

For more details, visit the [iimdb.js GitHub Repository](https://github.com/Abu-al-Hun/iimdb.git)

## Git Commands

```js
git clone https://github.com/Abu-al-Hun/iimdb.git
```
