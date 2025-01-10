const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getSaldo, setSaldo } = require('../../src/utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jogardado')
        .setDescription('Jogue o dado e ganhe ou perca pontos aleatoriamente!'),

    async execute(interaction) {
        const userId = interaction.user.id;

        // Gerar um valor aleatório de -50 a 200 pontos
        const randomPoints = Math.floor(Math.random() * 200) - 50;
        const userSaldo = getSaldo(userId);
        const newSaldo = userSaldo + randomPoints;

        // Atualizar o saldo do usuário
        setSaldo(userId, newSaldo);

        // Criar embed de resultado
        const resultEmbed = new EmbedBuilder()
            .setTitle('🎲 Resultado do Jogo de Dados!')
            .setColor(randomPoints >= 0 ? 'Green' : 'Red')
            .setThumbnail("https://media.discordapp.net/attachments/1312015562100052038/1327297642681733120/vecteezy_casino-dice-clipart-design-illustration_9385437.png?ex=67828dc2&is=67813c42&hm=670075bc99c1e46312d73d1e70becd2f26bc6c7bb37fe8d2292e202e74991d5f&=&format=webp&quality=lossless&width=442&height=468")
            .setDescription(randomPoints >= 0
                ? `✨ Você jogou o dado e **ganhou** ${randomPoints} pontos! Seu saldo agora é **${newSaldo}**.`
                : `💥 Você jogou o dado e **perdeu** ${Math.abs(randomPoints)} pontos. Seu saldo agora é **${newSaldo}**.`)
            .setFooter({ text: `Comando utilizado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        // Adicionar emojis decorativos ao título
        const emoji = randomPoints >= 0 ? '🎉' : '😢';
        resultEmbed.setTitle(`${emoji} Resultado do Jogo de Dados! ${emoji}`);

        await interaction.reply({ embeds: [resultEmbed] });
    },
};
