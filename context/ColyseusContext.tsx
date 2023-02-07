import { createContext, Dispatch, SetStateAction } from 'react';
import * as Colyseus from "colyseus.js";

interface ColyClient {
    client: Colyseus.Client | null
    setClient: Dispatch<SetStateAction<Colyseus.Client | null>>
    room: Colyseus.Room | null 
    setRoom: Dispatch<SetStateAction<Colyseus.Room | null>>
    playerJoined: boolean
    setPlayerJoined: Dispatch<SetStateAction<boolean>>
}
const ColyseusContext  = createContext<ColyClient | null>(null)

export default ColyseusContext;