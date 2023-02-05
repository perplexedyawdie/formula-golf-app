import NextAuth, { NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import dbObj from "../../../libs/mongo";

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
}

export default NextAuth(authOptions)