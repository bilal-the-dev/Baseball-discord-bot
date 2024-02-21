const {
	ActionRowBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	EmbedBuilder,
} = require("discord.js");

const generateEmbed = function (teamName, user) {
	const embed = new EmbedBuilder()
		.setColor(0x0099ff)
		.setTitle("Team Selection")

		.setDescription(`${user} has claimed the team \`${teamName}\`.`)
		.setThumbnail(user.displayAvatarURL());

	return embed;
};

const generateDropDown = function (teams, type) {
	const options = teams.map((team) => {
		return new StringSelectMenuOptionBuilder()
			.setLabel(team)
			.setDescription("Click to select your team!")
			.setValue(team);
	});

	const select = new StringSelectMenuBuilder()
		.setCustomId(`team_${type}`)
		.setPlaceholder("Make a selection!")
		.addOptions(...options);

	const row = new ActionRowBuilder().addComponents(select);

	return row;
};

const sendDropDown = async (thread, content, menu) => {
	const message = await thread.send({
		content,
		components: [menu],
	});

	await message.pin();
	return message;
};

module.exports = { generateEmbed, generateDropDown, sendDropDown };
