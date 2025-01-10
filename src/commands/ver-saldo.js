const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { getSaldo } = require('../../src/utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ver-saldo')
        .setDescription('Verifica o saldo de pts de outro usuário (administradores).')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('O usuário cujo saldo será verificado.')
                .setRequired(true)),
    async execute(interaction) {
        const allowedRoleId = '1306604618255700060'; // Substitua pelo ID do cargo permitido

        // Verificar se o usuário tem permissões de administrador ou possui o cargo permitido
        if (
            !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
            !interaction.member.roles.cache.has(allowedRoleId)
        ) {
            return interaction.reply({
                content: '❌ Você não tem permissão para usar este comando.',
                ephemeral: true,
            });
        }

        const user = interaction.options.getUser('usuario');
        const saldo = getSaldo(user.id);

        await interaction.reply({
            content: `💳 O saldo de ${user} é de **${saldo} pts**.`,
            ephemeral: false, // Você pode ajustar para true se preferir uma resposta privada
        });
    },
};
