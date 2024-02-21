const { CommandType } = require("wokcommands");
const { ActionRowBuilder, PermissionFlagsBits } = require("discord.js");
const interactionErrHandler = require("../utils/interactionErrHandler");

const Thread = require("../models/Thread");
const { generateDropDown } = require("../utils/teamFunctions");
const { americanTeams, nationalTeams } = require("../config.json");

module.exports = {
	// Required for slash commands
	description: "Should run in the relative thread",
	permissions: [PermissionFlagsBits.Administrator],

	// Create a legacy and slash command
	guildOnly: true,
	type: CommandType.SLASH,
	options: [
		{
			name: "user",
			description: "member whom team to revert",
			type: 6,
			required: true,
		},
		{
			name: "american_teams",
			description: "team to revert",
			type: 3,
			choices: americanTeams.map((team) => ({ name: team, value: team })),
		},
		{
			name: "national_teams",
			description: "team to revert",
			type: 3,
			choices: nationalTeams.map((team) => ({ name: team, value: team })),
		},
	],
	//  nvoked when a user runs the ping command
	callback: async ({ interaction }) => {
		try {
			const { options, channel } = interaction;

			const {
				user: { id: userId },
			} = options.getMember("user");

			let teamName = options.getString("american_teams");

			if (!teamName) teamName = options.getString("national_teams");

			if (!teamName) throw new Error("Please select a team");

			const teamType = americanTeams.includes(teamName)
				? "american"
				: "national";

			const doc = await Thread.findOne({ threadId: channel.id });

			if (!doc) throw new Error("Command should be ran only in break threads");

			const teams = doc[`${teamType}Teams`];

			const userSelectedTeams = teams.data[userId] ?? [];

			const index = userSelectedTeams.indexOf(teamName);

			if (!userSelectedTeams || userSelectedTeams.length === 0 || index === -1)
				throw new Error(`User has not selected the team ${teamName} yet`);

			const message = await channel.messages.fetch(teams.messageId);

			await interaction.reply({
				content: "Success! reverted the team on the menu.",
				ephemeral: true,
			});

			let updatedComponent;
			if (message.components.length === 0)
				updatedComponent = generateDropDown([teamName], teamType);

			if (message.components.length !== 0) {
				const component = message.components[0].components[0];
				component.data.options.push({
					label: teamName,
					value: teamName,
					description: "Click to select your team!",
				});

				updatedComponent = new ActionRowBuilder().addComponents(component);
			}

			userSelectedTeams.splice(index, 1);

			await message.edit({
				content: `${teamType[0].toUpperCase()}${teamType.slice(1)} Teams !`,
				components: [updatedComponent],
			});

			await doc.updateOne({
				[`${teamType}Teams.data.${userId}`]: userSelectedTeams,
			});
		} catch (error) {
			console.log(error);
			interactionErrHandler(error.message, interaction);
		}
	},
};
