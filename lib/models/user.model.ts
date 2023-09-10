import mongoose from "mongoose";

const userSchema = new mongoose.Schema({ //In mongoose s is capitalized in String
    id: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    image: String,
    bio: String,
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId, //This is the type of the _id field in the Thread model
            ref: "Thread"
        }
    ],
    onboarded: {
        type: Boolean,
        default: false
    },
    communities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community" //This is the name of the model
        }
    ]
});

const User = mongoose.models.User || mongoose.model("User", userSchema); //If the model already exists, use that model, otherwise create a new one

export default User;