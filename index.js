import {
	Client,
	Events,
	GatewayIntentBits,
	SlashCommandBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	LabelBuilder,
} from 'discord.js';

import 'dotenv/config';

const token = process.env.BOT_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.MessageContent] });

client.once(Events.ClientReady, async (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);

	try {
		await client.application.commands.create(
			new SlashCommandBuilder()
				.setName('share')
				.setDescription('fake wordle. https://github.com/limesdotpink/totally-real-wordle')
				.setContexts([0, 1, 2]),
		);

		console.log('Commands registered');
	}
	catch (err) {
		console.error('Failed to register commands:', err);
	}
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (
		interaction.isChatInputCommand() &&
        interaction.commandName === 'share'
	) {
		const modal = new ModalBuilder()
			.setCustomId('totally-real-wordle')
			.setTitle('Totally real wordle');

		const headerInput = new TextInputBuilder()
			.setCustomId('header')
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('e.g.: Wordle 1984 4/6, Wordle 1 1/6*')
			.setRequired(true);

		const headerLabel = new LabelBuilder()
			.setLabel('Header')
			.setTextInputComponent(headerInput);

		modal.addLabelComponents(headerLabel);

		const gridInput = new TextInputBuilder()
			.setCustomId('grid')
			.setStyle(TextInputStyle.Paragraph)
			.setPlaceholder(
				'e.g.:\n🟨🟨🟨🟨🟨\n⬛🟩⬛🟩⬛\n🟩🟩🟩🟩🟩\n🟩🟩🟩🟩🟩\n⬛🟩🟩🟩⬛\n⬛⬛🟩⬛⬛',
			)
			.setRequired(true);

		const gridLabel = new LabelBuilder()
			.setLabel('Grid')
			.setDescription('⬛🟨🟩')
			.setTextInputComponent(gridInput);

		modal.addLabelComponents(gridLabel);

		// Show modal to the user
		return await interaction.showModal(modal);
	}

	if (
		interaction.isModalSubmit() &&
        interaction.customId === 'totally-real-wordle'
	) {
		const header = interaction.fields.getTextInputValue('header');
		const grid = interaction.fields.getTextInputValue('grid');

		if (!header || !grid) return;

		return await interaction.reply({
			components: [
				{
					type: 17,
					accent_color: null,
					spoiler: false,
					components: [
						{
							type: 10,
							content: `${header}\n\n${grid}`,
						},
					],
				},
			],
			flags: 32768,
		});
	}
});

if (!process.env.TOTALLYREALWORDLE_BUILDING) {
	client.login(token);
}
