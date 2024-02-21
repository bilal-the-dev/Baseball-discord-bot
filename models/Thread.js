const { model, Schema } = require("mongoose");

const reqString = {
	type: String,
	required: true,
};

const threadSchema = new Schema(
	{
		parentId: reqString,
		threadId: reqString,
		americanTeams: Object,
		nationalTeams: Object,
	},
	{ minimize: false }
);

const Thread = model("Thread", threadSchema);
module.exports = Thread;
