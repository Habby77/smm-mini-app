// logger.js
const fs = require('fs');
const path = require('path');

function log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        level,
        message,
        data
    };
    
    console.log(`[${timestamp}] ${level}: ${message}`, data || '');
    
    // В продакшене можно добавить запись в файл
    // fs.appendFileSync('app.log', JSON.stringify(logEntry) + '\n');
}

module.exports = {
    info: (message, data) => log('INFO', message, data),
    error: (message, data) => log('ERROR', message, data),
    warn: (message, data) => log('WARN', message, data)
};
