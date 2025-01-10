// const { EmbedBuilder } = require('discord.js');

// /**
//  * Envia logs para um canal específico
//  * @param {Object} client - O cliente do bot
//  * @param {string} guildId - O ID do servidor onde o log será enviado
//  * @param {string} channelId - O ID do canal de logs
//  * @param {string} title - O título do log
//  * @param {string} description - A descrição do log
//  * @param {string} color - A cor do embed do log (padrão: dourado)
//  */
// const sendLog = async (client, guildId, channelId, title, description, color = '#FFD700') => {
//     try {
//         const guild = client.guilds.cache.get(guildId);
//         if (!guild) return console.error(`Servidor com ID ${guildId} não encontrado.`);

//         const channel = guild.channels.cache.get(channelId);
//         if (!channel) return console.error(`Canal com ID ${channelId} não encontrado no servidor ${guildId}.`);

//         const embed = new EmbedBuilder()
//             .setColor(color)
//             .setTitle(title)
//             .setDescription(description)
//             .setTimestamp()
//             .setFooter({ text: 'Sistema de Logs', iconURL: client.user.displayAvatarURL() });

//         await channel.send({ embeds: [embed] });
//     } catch (error) {
//         console.error('Erro ao enviar log:', error);
//     }
// };

// module.exports = { sendLog };
