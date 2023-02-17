import dbObj from '@/libs/mongo';
import { Collection } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {

    const { dbProm } = dbObj;
    const newHighscoreData = req.body;
    // newProjectData.userId = new ObjectId((session.userId as string));
    const highScoreCollection: Collection = (await dbProm).collection('highscores');
    const { insertedId } = await highScoreCollection.insertOne(newHighscoreData);
    res.status(200).send(true)


}