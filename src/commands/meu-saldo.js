const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getSaldo } = require('../../src/utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meu-saldo')
        .setDescription('Veja o seu saldo de suzu pts.'),
    async execute(interaction) {
        const saldo = getSaldo(interaction.user.id);

        const embed = new EmbedBuilder()
            .setTitle('💳 Seu Saldo de Suzu Pts')
            .setDescription(`💼 Você tem **${saldo} suzu pts**.`)
            .setColor('Blue')
            .setFooter({ text: `Comando executado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });
    },
};
