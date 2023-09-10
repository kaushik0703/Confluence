import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({ //In mongoose s is capitalized in String
    text: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }, 
    parentId: {
        type: String,
    },
    children: [ //It means 1 thread can have many children
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Thread",
        },
    ],

});

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema); //If the model already exists, use that model, otherwise create a new one

export default Thread;