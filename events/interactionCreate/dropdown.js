const { ActionRowBuilder } = require("discord.js");

const Thread = require("../../models/Thread");
const interactionErrHandler = require("../../utils/interactionErrHandler");
const { generateEmbed } = require("../../utils/teamFunctions");

module.exports = async (interaction) => {
	try {
		const {
			values,
			component,
			customId,
			channel: { id: threadId },
			user: { id: userId },
			user,
			message,
			channel,
		} = interaction;

		if (!customId) return;

		const [id, type] = customId.split("_");

		if (id !== "team") return;

		const [selectedTeam] = values;

		const doc = await Thread.findOne({ threadId });

		if (!doc) throw new Error("Something went wrong!");

		await interaction.reply({
			content: "Success!",
			ephemeral: true,
		});

		await doc.updateOne({
			$push: {
				[`${type}Teams.data.${userId}`]: selectedTeam,
			},
		});

		const index = component.data.options.findIndex(
			(item) => item.value === selectedTeam
		);

		component.data.options.splice(index, 1);

		let updatedComponent = [new ActionRowBuilder().addComponents(component)];

		let content = message.content;

		if (component.data.options.length === 0) {
			updatedComponent = [];
			content = `All ${type} teams have been claimed !`;
		}

		await message.edit({
			content,
			components: updatedComponent,
		});

		const embed = generateEmbed(selectedTeam, user);

		await channel.send({ embeds: [embed] });
	} catch (error) {
		console.log(error);
		await interactionErrHandler(error.message, interaction);
	}
};
