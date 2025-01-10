const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { getSaldo, setSaldo } = require('../../src/utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adicionar-suzu-pts')
        .setDescription('Adiciona suzu pts ao saldo de um usuário (somente administradores).')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('O usuário que receberá os suzu pts.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('quantidade')
                .setDescription('Quantidade de suzu pts a adicionar.')
                .setRequired(true)),
    async execute(interaction) {
        const allowedRoleId = '1306604618255700060'; // Substitua pelo ID do cargo permitido
        const logChannelId = '1315487329585987654'; // Canal de log
        const user = interaction.options.getUser('usuario');
        const quantidade = interaction.options.getInteger('quantidade');

        // Verificar se o usuário tem permissões de administrador, é o ID permitido, ou possui o cargo específico
        if (
            !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
            interaction.user.id !== '380475076174282753' &&
            !interaction.member.roles.cache.has(allowedRoleId)
        ) {
            return interaction.reply({
                content: '❌ Você não tem permissão para usar este comando.',
                ephemeral: true
            });
        }

        if (quantidade <= 0) {
            return interaction.reply({
                content: '⚠️ A quantidade deve ser maior que zero.',
                ephemeral: true
            });
        }

        const userSaldo = getSaldo(user.id);
        setSaldo(user.id, userSaldo + quantidade);

        const embed = new EmbedBuilder()
            .setTitle('✨ Suzu Pts Adicionados')
            .setDescription(`✅ **${quantidade} suzu pts** foram adicionados ao saldo de ${user}.`)
            .setColor('Green')
            .setFooter({ text: `Comando executado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });

        // Enviar log para o canal especificado
        const logChannel = interaction.guild.channels.cache.get(logChannelId);
        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setTitle('📜 Log: Suzu Pts Adicionados')
                .setColor('Blue')
                .addFields(
                    { name: 'Usuário Alterado:', value: `<@${user.id}> (${user.id})`, inline: true },
                    { name: 'Quantidade Adicionada:', value: `${quantidade}`, inline: true },
                    { name: 'Alterado Por:', value: `<@${interaction.user.id}> (${interaction.user.id})`, inline: true }
                )
                .setTimestamp();

            await logChannel.send({ embeds: [logEmbed] });
        } else {
            console.error(`Canal de log com ID ${logChannelId} não encontrado.`);
        }
    },
};
