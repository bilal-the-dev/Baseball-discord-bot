module.exports = async (errMsg, interaction) => {
	const reply = {
		content: `Err! \`${errMsg}\`.`,
		ephemeral: true,
	};

	if (!interaction.replied) return await interaction.reply(reply);

	await interaction.followUp(reply);
};
