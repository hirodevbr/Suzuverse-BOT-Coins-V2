const fs = require('fs');
const databasePath = '/database.json';

// Função para carregar o banco de dados
function loadDatabase() {
    if (!fs.existsSync(databasePath)) {
        return {};
    }
    const data = fs.readFileSync(databasePath, 'utf-8');
    return JSON.parse(data);
}

// Função para salvar o banco de dados
function saveDatabase(database) {
    fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));
}

// Função para obter saldo
function getSaldo(userId) {
    const database = loadDatabase();
    return database[userId] || 0;
}

// Função para definir saldo
function setSaldo(userId, saldo) {
    const database = loadDatabase();
    database[userId] = saldo;
    saveDatabase(database);
}

module.exports = { loadDatabase, saveDatabase, getSaldo, setSaldo };
