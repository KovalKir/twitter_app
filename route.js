import { Router } from "express";
import { TwitterApi } from 'twitter-api-v2';
import fs from "fs";
import { readFile } from "fs/promises";
import 'dotenv/config';

export const callbackRoute = Router();


const port = 5000; // need to be registered in app settings


const keyConsumer = process.env.CONSUMER_KEY;
const secretConsumer = process.env.CONSUMER_SECRET;

callbackRoute.get('/', async (req, res) => {
    const reqClient = new TwitterApi({ appKey: keyConsumer, appSecret: secretConsumer })
    const link = await reqClient.generateAuthLink(`http://localhost:${port}/callback`)

    const reqCredentials = {
        url: link.url,
        reqKey: link.oauth_token,
        reqSecret: link.oauth_token_secret,
    }

    fs.writeFile('credentials.json', JSON.stringify(reqCredentials), err => {
        if (err) {
          console.error(err);
        }
        // file written successfully
    })

    res.render('index', {authLink: link.url})
})

callbackRoute.get('/callback', async (req, res) => {
    
    const { oauth_token, oauth_verifier } = req.query;

    if (!oauth_token || !oauth_verifier) {
        res.status(400).render('error', { error: 'Bad request, or you denied application access. Please renew your request.' });
        return;
    }

    const credentials = JSON.parse(await readFile('credentials.json'));

    const savedKey = credentials.reqKey;
    const savedSecret = credentials.reqSecret;

    if (!savedKey || !savedSecret || savedKey !== oauth_token) {
        res.status(400).render('error', { error: 'OAuth token is not known or invalid. Your request may have expire. Please renew the auth process.' });
        return;
    }

    const tempClient = new TwitterApi({ 
        appKey: keyConsumer, 
        appSecret: secretConsumer,
        accessToken: oauth_token,
        accessSecret: savedSecret,
    })

    const { accessToken, accessSecret, screenName, userId } = await tempClient.login(oauth_verifier);


    res.send(`access token = ${accessToken}, access secret = ${accessSecret}, screen name = ${screenName}, user ID = ${userId}`)
    
    // POST-request to follow some twitterID (read and write app permissions needed)

    // await (await tempClient.login(oauth_verifier)).client.v2.follow(<LOGGED USER ID>, <TARGET TWITTER ID>)
})