import { createContext, Dispatch, MutableRefObject, SetStateAction } from 'react';
import * as Colyseus from "colyseus.js";
import { Observable } from '@babylonjs/core';
import { FormulaPlayer } from '@/types/formula-click';

interface ColyClient {
    client: Colyseus.Client | null
    setClient: Dispatch<SetStateAction<Colyseus.Client | null>>
    room: Colyseus.Room | null 
    setRoom: Dispatch<SetStateAction<Colyseus.Room | null>>
    playerJoined: boolean
    setPlayerJoined: Dispatch<SetStateAction<boolean>>
    userName: string | null
    setUserName: Dispatch<SetStateAction<string | null>>
    onRemotePlayerMsg: MutableRefObject<Observable<string>>
    playerType: MutableRefObject<FormulaPlayer>
    playerTurn: MutableRefObject<boolean>
    onPlayerTurnMsg: MutableRefObject<Observable<boolean>>
    gameEnd: MutableRefObject<boolean>
    onGameEndMsg: MutableRefObject<Observable<boolean>>
}
const ColyseusContext  = createContext<ColyClient | null>(null)

export default ColyseusContext;