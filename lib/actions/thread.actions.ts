"use server" // Can't directly create a thread from the client side, so we use server side rendering

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}
export async function createThread({ text, author, communityId, path }: Params) {
    try {

        connectToDB();
    
        const createdThread = await Thread.create({
            text,
            author,
            community: null,
        });
    
        //update user model
        await User.findByIdAndUpdate(author, { //push the thread id to the user's threads array
            $push: { threads: createdThread._id },
        });
    
        revalidatePath(path); //To make sure changes happen immediately on nextjs website
    
    } catch (error: any) {
        console.log(`Failed to create thread : ${error.message}`);
    }
}

export async function fetchThreads(pageNumber = 1, pageSize = 20) { // set the default values for the parameters
    connectToDB();

    //calculate the number of threads to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    //Fetch the posts that have no parent (i.e. the root posts)
    const threadsQuery = Thread.find({parentId: { $in: [null, undefined]}})
                                .sort({createdAt: 'desc'})
                                .skip(skipAmount)
                                .limit(pageSize)
                                .populate({path: 'author', model: User })
                                .populate({
                                    path: 'children',
                                    populate: {
                                        path: 'author',
                                        model: User,
                                        select: "_id name parentId image"
                                    }
                                });

    const totalThreadsCount = await Thread.countDocuments({parentId: { $in: [null, undefined]}});

    const threads = await threadsQuery.exec();

    const isNext = totalThreadsCount > skipAmount + threads.length;

    return { threads, isNext };
}

export async function fetchThreadsById(id: string) {
    connectToDB();

    try {

        // TODO: Populate the Community
        const thread = await Thread.findById(id)
            .populate({path: 'author', model: User, select: "_id id name image" })
            .populate({ //Populate the children of the thread
                path: 'children',
                populate: [
                {
                    path: 'author',
                    model: User,
                    select: "_id id name parentId image"
                },
                { //Populate the children of the children of the thread
                    path: 'children',
                    populate: {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    }
                }
                ]
            }).exec();

        return thread;
    } catch (error: any) {
        throw new Error(`Failed to fetch thread : ${error.message}`);
    }
}

export async function addCommentToThread(
    threadId: string, 
    commentText: string,
    userId: string,
    path: string
    ) {
    connectToDB();

    try {
        //Find original Thread by its ID
        const originalThread = await Thread.findById(threadId);

        if(!originalThread) {
            throw new Error("Thread not found");
        }

        //Create a new Thread for the comment
        const commentThread = await Thread.create({
            text: commentText,
            author: userId,
            parentId: threadId,
        });

        //?? DO I NEED to save the commentThread ??
        // I am pushing the commentThread to the originalThread's children array

        //Add the commentThread to the originalThread's children array
        originalThread.children.push(commentThread._id);

        //Save the originalThread as await originalThread.save();
        await originalThread.save();

        revalidatePath(path); //To make sure changes happen immediately on nextjs website
    } catch (error: any) {
        throw new Error(`Failed to add comment to thread : ${error.message}`);
    }
}