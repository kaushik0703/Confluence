import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({ //In mongoose s is capitalized in String
    id: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    image: String,
    bio: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId, //This is the type of the _id field in the Thread model
            ref: "Thread"
        }
    ],
    members: [ //multiple users can be members of a community
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

const Community = mongoose.models.Community || mongoose.model("Community", communitySchema); //If the model already exists, use that model, otherwise create a new one

export default Community;