import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    // TODO: create tweet
    // get the content from req body
    // insert the content and owner (userid) into db
    try {
        const { content } = req.body;
        if (content?.trim() === "") {
            throw new ApiError(400, "Content is required");
        }
        const owner = req.user?._id
        const tweet = await Tweet.create({
            content, owner
        })
    
        if (!tweet) {
            throw new ApiError(500, "Something went wrong while adding tweet");
        }
    
        return res
            .status(200)
            .json(
                new ApiResponse(200, tweet, "Tweet created successfully")
            );
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while adding tweet"
        );
    }
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    // fetch tweet from the DB and return the data
    try {
        const { userId } = req.params;
        if (!userId?.trim()) {
            throw new ApiError(400, "User information is missing");
        }
        const allTweet = await Tweet.find({owner: userId});
    
        return res
            .status(200)
            .json(
                new ApiResponse(200, allTweet, "Tweet fetched successfully")
            );
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while fetching tweets"
        );
    }


})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    // get content and update using 
    try {
        const { content } = req.body;
        const { tweetId } = req.params;
        
        if (content?.trim() === "") {
            throw new ApiError(400, "Content is required");
        }
        // const owner = req.user?._id
    
        const updatedTweet = await Tweet.findByIdAndUpdate(
            tweetId,
            {
                $set: { content },
            },
            { new: true }
        )
        return res
            .status(200)
            .json(
                new ApiResponse(200, updatedTweet, "Tweet updated successfully")
            );
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while adding tweet"
        );
    }
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    // get tweet id from params
    // delete the tweet id
    const {tweetId} = req.params
    await Tweet.deleteOne({ _id: tweetId})

    return res
        .status(200)
        .json(
            new ApiResponse(200, "", "Tweet deleted successfully")
        );

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}