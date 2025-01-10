const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config.json'); // Certifique-se de ter um arquivo config.json com token e clientId

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Carregar comandos dos arquivos
for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (command.data) {
        commands.push(command.data.toJSON());
    } else {
        console.warn(`⚠️ Comando inválido encontrado em ${file}.`);
    }
}

// Criar instância do REST
const rest = new REST({ version: '10' }).setToken(config.token);

// Registrar comandos
(async () => {
    try {
        console.log('🔄 Atualizando (ou registrando) comandos de aplicação...');

        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands }
        );

        console.log('✅ Comandos registrados com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao registrar comandos:', error);
    }
})();
