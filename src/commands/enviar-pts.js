const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getSaldo, setSaldo } = require('../../src/utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('enviar-suzu-pts')
        .setDescription('Envie suzu pts para outro usuário.')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('O usuário que receberá os suzu pts.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('quantidade')
                .setDescription('Quantidade de suzu pts a enviar.')
                .setRequired(true)),
    async execute(interaction) {
        const sender = interaction.user;
        const receiver = interaction.options.getUser('usuario');
        const quantidade = interaction.options.getInteger('quantidade');
        const logChannelId = '1315487329585987654'; // Substitua pelo ID do canal de log

        if (sender.id === receiver.id) {
            return interaction.reply({
                content: '❌ Você não pode enviar suzu pts para si mesmo!',
                ephemeral: true,
            });
        }

        const senderSaldo = getSaldo(sender.id);
        if (senderSaldo < quantidade) {
            return interaction.reply({
                content: '❌ Você não tem suzu pts suficientes!',
                ephemeral: true,
            });
        }

        setSaldo(sender.id, senderSaldo - quantidade);
        const receiverSaldo = getSaldo(receiver.id);
        setSaldo(receiver.id, receiverSaldo + quantidade);

        const embed = new EmbedBuilder()
            .setTitle('💸 Transferência de Suzu pts')
            .setDescription(`🎉 ${sender} enviou **${quantidade} suzu pts** para ${receiver}!`)
            .setColor('Green')
            .setFooter({ text: `Comando executado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });

        // Enviar log para o canal especificado
        const logChannel = interaction.guild.channels.cache.get(logChannelId);
        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setTitle('📜 Log: Transferência de Suzu pts')
                .setColor('Blue')
                .addFields(
                    { name: 'Remetente:', value: `<@${sender.id}> (${sender.id})`, inline: true },
                    { name: 'Destinatário:', value: `<@${receiver.id}> (${receiver.id})`, inline: true },
                    { name: 'Quantidade Transferida:', value: `${quantidade}`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: `Transferência registrada`, iconURL: interaction.guild.iconURL() });

            await logChannel.send({ embeds: [logEmbed] });
        } else {
            console.error(`Canal de log com ID ${logChannelId} não encontrado.`);
        }
    },
};
