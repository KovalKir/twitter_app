import { TwitterApi } from 'twitter-api-v2';

import 'dotenv/config'

const userName = "k_Dev1991";
const tweetID = "1664258560270774273";


function auth() {
    const client = new TwitterApi({
        appKey: process.env.CONSUMER_KEY,
        appSecret: process.env.CONSUMER_SECRET,
        accessToken: process.env.ACCESS_TOKEN,
        accessSecret: process.env.ACCESS_SECRET,
      });
    return client;
}

async function isRetweet (targetUserName, targetTweetID) {
    try {
        const client = auth();
        const retweets = await client.v2.tweetRetweetedBy(targetTweetID);
        const targetUser = retweets.data.find(element => element.username === targetUserName);
        
        return !!targetUser

    } catch (error) {
        console.log (error)
    }
}

async function isLiked (targetUserName, targetTweetID) {
    try {
        const client = auth();
        const likes = await client.v2.tweetLikedBy(targetTweetID);
        
        const targetUser = likes.data.find(element => element.username === targetUserName);
        
        // !name = false if name not null or undefined, !!name = true if name not nul or undefined
        
        return !!targetUser

    } catch (error) {
        console.log (error)
    }
}


async function main () {
    
    const like = await isLiked(userName,tweetID);
    const retweet = await isRetweet(userName, tweetID);

    console.log(`User ${userName} like = ${like}; user ${userName} retweet = ${retweet}`)
    
}

main()

