var mongoose = require("mongoose");
// Schema set up
var commentSchema = new mongoose.Schema({
    text: String,
    // author used to be a string
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});
module.exports = mongoose.model("Comment", commentSchema);