"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
    userId: string,
    username: string, //In typescript s is lowercase in string
    name: string,
    bio: string,
    image: string,
    path: string

}
export async function updateUser({
    userId,
    username, //In typescript s is lowercase in string
    name,
    bio,
    image,
    path
    }: Params): Promise<void> {
    connectToDB();

    try {
        await User.findOneAndUpdate(
            { id: userId },
            { 
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true, //If the user has updated their profile, they have completed onboarding
            },
            { upsert: true } //If the value doesn't exist, create a new one else update the existing one
            );

            if(path === '/profile/edit') {
                revalidatePath(path); //update your cached data without revalidating to expire
            }
    } catch (error: any) {
        console.log(`Failed to create/update user : ${error.message}`);
    }

}

export async function fetchUser(userId: string) {
    try {
        connectToDB();

        return await User
            .findOne({ id: userId })
            // .populate({
            //     path: 'communities',
            //     model: Community
            // })
    } catch (error: any) {
        throw new Error(`Failed to fetch user : ${error.message}`)
    }
}

export async function fetchUserPosts(userId: string) {
    try {
        connectToDB();

        //Find all threads authored by the user with the given userId

        // TODO: Populate commuity

        return await User
            .findOne({ id: userId })
            .populate({
                path: 'threads',
                model: Thread,
                populate: {
                    path:'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: 'name image id'
                    }
                }
            })
            
    } catch (error: any) {
        throw new Error(`Failed to fetch user posts : ${error.message}`)
    }
}

export async function fetchUsers({
    userId,
    searchString="",
    pageNumber=1,
    pageSize=20,
    sortBy="desc"
}: {
    userId: string,
    searchString?: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: SortOrder

}) {
    try {
        connectToDB();

        //calculate the number of users to skip
        const skipAmount = (pageNumber - 1) * pageSize;

        const regex = new RegExp(searchString, 'i'); //i means case insensitive

        const query: FilterQuery<typeof User> = { //Filter query of type User
            id: { $ne: userId }, //Don't return the current user
        }

        //searching by username or name
        if(searchString.trim() !== "") { //If the search string is not empty
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ]
        }

        //sorting by name or username
        const sortOptions = { createdAt: sortBy };

        const usersQuery = User.find(query)
                                .sort(sortOptions)
                                .skip(skipAmount)
                                .limit(pageSize);

        const totalUsersCount = await User.countDocuments(query);
        
        const users = await usersQuery.exec();

        const isNext = totalUsersCount > skipAmount + users.length;

        return { users, isNext };
    } catch (error: any) {
        throw new Error(`Failed to fetch users : ${error.message}`)
    }
}

export async function getActivity(userId: string) {
    try {
        connectToDB();

        //Find all threads authored by the user with the given userId
        const userThreads = await Thread.find({ author: userId });
        
        // Collect all the child threads (replies) ids from 'children' field of the parent threads
        const childThreadIds = userThreads.reduce((acc, thread) => {
            return acc.concat(thread.children);
        }, []) //default accumulator value is an empty array

        //To see who else commented on the threads created by the user
        //get access to all replies excluding the ones created by the user 
        const replies = await Thread.find({ 
            author: { $ne: userId }, //exclude the threads(comments) created by the user who is logged in
            _id: { $in: childThreadIds } 
        }).populate({
            path: 'author',
            model: User,
            select: 'name image _id'
        })

        return replies;
        
    } catch (error: any) {
        throw new Error(`Failed to fetch user activity : ${error.message}`)
    }
}