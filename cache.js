import { TwitterApi } from 'twitter-api-v2';

import 'dotenv/config'

import fs from "fs";
import { readFile } from "fs/promises";

function auth() {
    const client = new TwitterApi({
        appKey: process.env.CONSUMER_KEY,
        appSecret: process.env.CONSUMER_SECRET,
        accessToken: process.env.ACCESS_TOKEN,
        accessSecret: process.env.ACCESS_SECRET,
      });
    return client;
}

async function cacheInfo (targetTweetID) {
    
    try {
        
        const client = auth();
    
        const retweets = await client.v2.tweetRetweetedBy(targetTweetID);
        
        fs.writeFile('retweets.json', JSON.stringify(retweets), err => {
            if (err) {
                console.error(err);
            }
        })

        const likes = await client.v2.tweetLikedBy(targetTweetID);
        
        fs.writeFile('likes.json', JSON.stringify(likes), err => {
            if (err) {
                console.error(err);
            }
        })

        console.log ('Cached successfully!')

    } catch (error) {
        console.log(error);
    }

}

async function checkUser (targetUserScreenName) {
    
    const retweets = JSON.parse(await readFile('retweets.json'));
    const likes = JSON.parse(await readFile('likes.json'));

    const isRetweet = !!(retweets.data.find(element => element.username === targetUserScreenName));
    const isLiked = !!(likes.data.find(element => element.username === targetUserScreenName));

    console.log(`User ${targetUserScreenName} like = ${isLiked}`);
    console.log(`User ${targetUserScreenName} retweet = ${isRetweet}`)
    
}

async function main () {
    await cacheInfo ('1664258560270774273');
    await checkUser ('k_Dev1991')
}

main()


