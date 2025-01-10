const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isSelectMenu()) return;

		if (interaction.customId === 'channel_tutorial_menu') {
			const tutorials = {
				'general-channel': 'Bem-vindo ao canal **geral**! Aqui você pode conversar com outros membros, compartilhar ideias e se divertir.',
				'rules-channel': 'Este é o canal de **regras**. Leia e siga todas as regras para manter a harmonia no servidor.',
				'faq-channel': 'No canal de **FAQ**, você encontrará respostas para perguntas frequentes sobre o servidor e como ele funciona.',
				'support-channel': 'Precisa de ajuda? No canal de **suporte**, você pode abrir tickets e receber assistência da equipe.',
			};

			const tutorial = tutorials[interaction.values[0]];

			if (!tutorial) {
				await interaction.reply({
					content: '❌ Não foi possível encontrar um tutorial para o canal selecionado.',
					ephemeral: true,
				});
				return;
			}

			const embed = new EmbedBuilder()
				.setTitle('📚 Tutorial do Canal')
				.setDescription(tutorial)
				.setColor(0x5a9ec9);

			await interaction.reply({
				embeds: [embed],
				ephemeral: true,
			});
		}
	},
};
