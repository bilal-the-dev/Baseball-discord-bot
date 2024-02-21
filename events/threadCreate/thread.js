const { channels, americanTeams, nationalTeams } = require("../../config.json");
const Thread = require("../../models/Thread");
const { generateDropDown, sendDropDown } = require("../../utils/teamFunctions");

module.exports = async (thread) => {
	try {
		const { parentId, id: threadId } = thread;

		if (!channels.includes(parentId)) return;

		const americanTeamRow = generateDropDown(americanTeams, "american");
		const nationalTeamRow = generateDropDown(nationalTeams, "national");

		const americanMessage = await sendDropDown(
			thread,
			"American Teams!",
			americanTeamRow
		);

		const nationalMessage = await sendDropDown(
			thread,
			"National Teams!",
			nationalTeamRow
		);

		await Thread.create({
			parentId,
			threadId,
			americanTeams: { messageId: americanMessage.id, data: {} },
			nationalTeams: { messageId: nationalMessage.id, data: {} },
		});
	} catch (error) {
		console.log(error);
	}
};
