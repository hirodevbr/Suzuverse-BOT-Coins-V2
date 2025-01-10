const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { getSaldo, setSaldo } = require('../../src/utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remover-suzu-pts')
        .setDescription('Remove suzu pts de um usuário (somente administradores).')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('O usuário de quem remover suzu pts.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('quantidade')
                .setDescription('Quantidade de suzu pts a remover.')
                .setRequired(true)),
    async execute(interaction) {
        const allowedRoleId = '1306604618255700060'; // Substitua pelo ID do cargo permitido
        const logChannelId = '1315487329585987654'; // Substitua pelo ID do canal de log

        // Verificar se o membro tem permissão de administrador ou possui o cargo permitido
        if (
            !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
            !interaction.member.roles.cache.has(allowedRoleId)
        ) {
            return interaction.reply({
                content: '❌ Apenas administradores ou membros com o cargo permitido podem usar este comando.',
                ephemeral: true,
            });
        }

        const user = interaction.options.getUser('usuario');
        const quantidade = interaction.options.getInteger('quantidade');

        const saldo = getSaldo(user.id);
        if (saldo < quantidade) {
            return interaction.reply({
                content: '❌ O usuário não tem suzu pts suficientes!',
                ephemeral: true,
            });
        }

        setSaldo(user.id, saldo - quantidade);

        const embed = new EmbedBuilder()
            .setTitle('❌ Remoção de Suzu Pts')
            .setDescription(`⚠️ **${quantidade} suzu pts** foram removidos do saldo de ${user}.`)
            .setColor('Red')
            .setFooter({ text: `Comando executado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });

        // Enviar log para o canal especificado
        const logChannel = interaction.guild.channels.cache.get(logChannelId);
        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setTitle('📜 Log: Remoção de Suzu pts')
                .setColor('Red')
                .addFields(
                    { name: 'Usuário Removido:', value: `<@${user.id}> (${user.id})`, inline: true },
                    { name: 'Removido por:', value: `<@${interaction.user.id}> (${interaction.user.id})`, inline: true },
                    { name: 'Quantidade Removida:', value: `${quantidade}`, inline: true },
                    { name: 'Novo Saldo:', value: `${saldo - quantidade}`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'Registro de atividade', iconURL: interaction.guild.iconURL() });

            await logChannel.send({ embeds: [logEmbed] });
        } else {
            console.error(`Canal de log com ID ${logChannelId} não encontrado.`);
        }
    },
};
