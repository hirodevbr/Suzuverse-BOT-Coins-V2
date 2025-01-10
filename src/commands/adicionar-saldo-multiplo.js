const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { getSaldo, setSaldo } = require('../../src/utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adicionar-saldo-multiplo')
        .setDescription('Adiciona saldo a vários usuários ao mesmo tempo (somente administradores).')
        .addStringOption(option =>
            option.setName('ids')
                .setDescription('Lista de IDs dos usuários separados por vírgula.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('quantidade')
                .setDescription('Quantidade de saldo a adicionar a cada usuário.')
                .setRequired(true)),
    async execute(interaction) {
        const allowedRoleId = '1306604618255700060'; // Substitua pelo ID do cargo permitido
        const logChannelId = '1315487329585987654'; // Canal de log

        // Verificar se o membro tem permissão de administrador ou o cargo específico
        if (
            !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
            !interaction.member.roles.cache.has(allowedRoleId)
        ) {
            return interaction.reply({
                content: '❌ Apenas administradores ou membros com o cargo permitido podem usar este comando.',
                ephemeral: true,
            });
        }

        const ids = interaction.options.getString('ids').split(',').map(id => id.trim());
        const quantidade = interaction.options.getInteger('quantidade');
        const resultados = [];
        const logDetalhes = [];
        let erroIds = [];

        ids.forEach(userId => {
            try {
                const saldoAtual = getSaldo(userId);
                const novoSaldo = saldoAtual + quantidade;
                setSaldo(userId, novoSaldo);

                resultados.push(
                    `✅ Saldo atualizado para o User <@${userId}>. Saldo Atual: **${saldoAtual}** | Novo Saldo: **${novoSaldo}**.`
                );
                logDetalhes.push(
                    `ID: <@${userId}> | Saldo Atual: **${saldoAtual}** | Saldo Adicionado: **${quantidade}** | Novo Saldo: **${novoSaldo}**`
                );
            } catch (error) {
                erroIds.push(userId); // Coletar IDs com erro
            }
        });

        // Mensagem principal de resposta
        const embed = new EmbedBuilder()
            .setTitle('💰 Saldo Adicionado (Múltiplos)')
            .setDescription(resultados.length > 0 ? resultados.join('\n') : 'Nenhum saldo foi atualizado.')
            .setColor(resultados.length > 0 ? 'Green' : 'Red')
            .setFooter({ text: `Comando executado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });

        // Registrar erros (se houver)
        if (erroIds.length > 0) {
            console.error(`Falha ao processar os IDs: ${erroIds.join(', ')}`);
        }

        // Enviar log para o canal especificado
        const logChannel = interaction.guild.channels.cache.get(logChannelId);
        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setTitle('📜 Log: Adição de Saldo Múltiplo')
                .setColor('Blue')
                .addFields(
                    { name: 'Detalhes dos IDs Atualizados:', value: logDetalhes.length > 0 ? logDetalhes.join('\n') : 'Nenhum', inline: false },
                    { name: 'IDs com Erro:', value: erroIds.length > 0 ? erroIds.join(', ') : 'Nenhum', inline: false },
                    { name: 'Adicionado por:', value: `<@${interaction.user.id}> (${interaction.user.id})`, inline: false },
                    { name: 'Quantidade Adicionada por Usuário:', value: `${quantidade}`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'Registro de atividade', iconURL: interaction.guild.iconURL() });

            await logChannel.send({ embeds: [logEmbed] });
        } else {
            console.error(`Canal de log com ID ${logChannelId} não encontrado.`);
        }
    },
};
