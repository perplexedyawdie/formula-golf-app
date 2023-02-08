import NextAuth, { NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { DbCollection } from "@/utils/db-collections.enum";
import dbObj from "@/libs/mongo";
import { Collection, ObjectId } from "mongodb";
import generateUsername from "@/utils/get-a-username";


if (!process.env.DISCORD_CLIENT_ID) {
  throw new Error('Please add your discord client id to .env.local')
}

if (!process.env.DISCORD_CLIENT_SECRET) {
  throw new Error('Please add your discord client secret to .env.local')
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!
    })
  ],
  adapter: MongoDBAdapter(dbObj.clientProm),
  events: {
    async createUser({ user }) {
      const userNameCollection: Collection = (await dbObj.dbProm).collection(DbCollection.USERNAME);
      const newUsername = {
        userId: new ObjectId(user.id),
        userName: generateUsername()
      }
      await userNameCollection.insertOne(newUsername)
    }
  },
  callbacks: {
    async session({ session, token, user }) {
      const userNameCollection: Collection = (await dbObj.dbProm).collection(DbCollection.USERNAME);
      const resp = await userNameCollection.findOne({ userId: (new ObjectId(user.id)) })
      if (resp && session.user) {
        session.user.userName = resp.userName;
      }
      return session
    }
  }
}

export default NextAuth(authOptions)