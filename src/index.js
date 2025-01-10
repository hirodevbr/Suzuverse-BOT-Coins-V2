const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const config = require('../config.json');

// Inicializar o cliente do bot
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Carregar comandos dinamicamente
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (command.data && command.data.name) {
        client.commands.set(command.data.name, command);
    } else {
        console.warn(`⚠️ Comando inválido encontrado em ${file}: 'data.name' está ausente.`);
    }
}

// Evento "ready"
client.once('ready', () => {
    const guildCount = client.guilds.cache.size; // Número de servidores
    const botTag = client.user.tag; // Tag do bot

    console.log(`🤖 Bot iniciado com sucesso!`);
    console.log(`📌 Nome: ${botTag}`);
    console.log(`🌐 Servidores conectados: ${guildCount}`);
    console.log(`🚀 Bot está online e pronto para uso!`);

    // Configuração de presença
    client.user.setPresence({
        activities: [
            {
                name: `/comandos | 🌟 Em ${guildCount} servidores!`,
                type: 'PLAYING', // Pode ser: PLAYING, WATCHING, LISTENING, COMPETING
            },
        ],
        status: 'idle', // Pode ser: online, idle, dnd, invisible
    });
});


// Listener para comandos
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('❌ Erro ao executar o comando:', error);
        await interaction.reply({
            content: '❌ Ocorreu um erro ao executar este comando!',
            ephemeral: true,
        });
    }
});

// Logar no bot
client.login(config.token).catch(error => {
    console.error('❌ Erro ao autenticar o bot:', error);
});
