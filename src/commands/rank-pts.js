const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadDatabase } = require('../../src/utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank-suzu-pts')
        .setDescription('Mostra o ranking dos 10 usuários com mais suzu pts (somente administradores).'),
    async execute(interaction) {
        const allowedRoleId = '1306604618255700060'; // Substitua pelo ID do cargo permitido

        // Verificar se o membro possui o cargo específico
        if (!interaction.member.roles.cache.has(allowedRoleId)) {
            return interaction.reply({
                content: '❌ Você não tem permissão para usar este comando.',
                ephemeral: true
            });
        }

        const database = loadDatabase();

        const sortedUsers = Object.entries(database)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10);

        if (sortedUsers.length === 0) {
            return interaction.reply({
                content: '📂 Não há dados suficientes para exibir o ranking.',
                ephemeral: true
            });
        }

        const rank = sortedUsers
            .map(([id, saldo], i) => `${i + 1}. <@${id}> - **${saldo} suzu pts**`)
            .join('\n');

        const embed = new EmbedBuilder()
            .setTitle('🏆 Ranking de Suzu Pts')
            .setDescription(rank)
            .setColor('Gold')
            .setFooter({ text: `Comando executado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });
    },
};
