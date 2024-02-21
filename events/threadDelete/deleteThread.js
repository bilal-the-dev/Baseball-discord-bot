const Thread = require("../../models/Thread");

module.exports = async (thread) => {
	try {
		const { id: threadId } = thread;

		const doc = await Thread.findOne({ threadId });

		if (!doc) return;

		await doc.deleteOne();
	} catch (error) {
		console.log(error);
	}
};
