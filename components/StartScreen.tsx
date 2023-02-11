import React, { useState, useEffect, useContext } from 'react'
import { LineWave } from 'react-loader-spinner'
import ModalGroup from './ModalGroup'
import { MdOutlineAccountCircle, MdHelpOutline } from 'react-icons/md'
import { GiPodium } from 'react-icons/gi'
// import dynamic from 'next/dynamic'
import * as Colyseus from "colyseus.js";
import ColyseusContext from "@/context/ColyseusContext";
import { SocketMessages } from '@/utils/socket-messages.enum'
import { useSession } from 'next-auth/react'
import generateUsername from '@/utils/get-a-username'

// const ModalGroup = dynamic(() => import('./ModalGroup'), {
//     ssr: false
//   })
function LoadingSpiner() {

    return (
        <LineWave
            height="100"
            width="100"
            color="white"
            ariaLabel="line-wave"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            firstLineColor=""
            middleLineColor=""
            lastLineColor=""
        />
    )
}

function MenuButtons() {
    // TODO only authenticated users can see these
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const colyClient = useContext(ColyseusContext)
    console.log(colyClient?.userName, " username")
    useEffect(() => {
        const loadingTimer = setTimeout(() => {
            setIsLoading(false)
        }, 1500);
        return () => clearTimeout(loadingTimer);
    }, [])

    function handleCreateGame() {
        if (!colyClient?.room && colyClient?.client) {
            colyClient.client.create("fg")
                .then((room) => {
                    room.onStateChange((newState) => {
                        console.log("New state:", newState);
                    });
                    room.onMessage(SocketMessages.PLAYER_JOINED, (msg) => {
                        console.log("player joined: ", msg)
                        colyClient.setPlayerJoined(msg);
                    })
                    room.onLeave((code) => {
                        console.log("You've been disconnected.");
                        colyClient.setRoom(null)
                    });
                    colyClient.setRoom(room)
                })
        }
    }

    async function handleExitRoom() {
        if (colyClient?.room) {
            await colyClient.room.leave()
        }
    }

    return (
        <>
            <ModalGroup />
            {
                isLoading ?
                    <LoadingSpiner /> : (
                        <div className="inline-flex space-y-4 max-w-md flex-col">
                            {/* <button className="btn btn-wide btn-active">Start</button> */}
                            <label onClick={() => handleCreateGame()} htmlFor="creategame-modal" className="btn btn-wide gap-2">
                                Create Game
                                {/* <div className="badge animate-pulse badge-info badge-sm">+1</div> */}
                            </label>
                            {
                                !colyClient?.room ?
                                    <label htmlFor="joingame-modal" className="btn btn-wide">Join Game</label> :
                                    <label onClick={() => handleExitRoom()} htmlFor="joingame-modal" className="btn btn-error btn-wide">Exit Room</label>
                            }
                            <div className="inline-flex justify-between">
                                <label htmlFor="useracc-modal" title="Account" className="btn btn-square">
                                    <MdOutlineAccountCircle size={20} />
                                </label>
                                <label title="Help" htmlFor="help-modal" className="btn btn-square">
                                    <MdHelpOutline size={20} />
                                </label>
                                <label title="Leaderboard" htmlFor="highscore-modal" className="btn btn-square">
                                    <GiPodium size={20} />
                                </label>
                            </div>
                        </div>
                    )
            }
        </>
    )

}

function StartScreen() {
    const colyClient = useContext(ColyseusContext)
    const { data: session } = useSession()
    const [countdown, setCountdown] = useState(10)
    
    useEffect(() => {
        if (!colyClient?.client && window != undefined) {
            colyClient?.setClient((new Colyseus.Client('ws://localhost:2567')));
        }
        if (!colyClient?.userName) {
            colyClient?.setUserName(session?.user?.userName || generateUsername())
        }
    }, [colyClient, session])

    // useEffect(() => {
    //     const countdownTimer = setInterval(() => {
    //         setCountdown(prev => prev > 0 ? (prev - 1): prev)
    //     }, 1000)
    //     return () => clearInterval(countdownTimer);
    // }, [])
    

    return (
        <div className="hero min-h-screen xl:max-w-5xl xl:mx-auto" style={{ backgroundImage: `url("/title-image.png")` }}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content h-full self-start text-neutral-content grid grid-rows-3 auto-cols-auto">
                <div className="max-w-full row-start-1 row-end-2">
                    <h1 className="lg:text-8xl md:text-6xl sm:text-4xl text-6xl text-center font-bugfast">Formula Golf</h1>
                </div>
                <div className="max-w-full row-start-2 row-end-4 items-start justify-center flex">
                    <MenuButtons />
                    {/* <span className="countdown font-mono text-6xl">
                        <span style={{ "--value": countdown } as React.CSSProperties}></span>
                    </span> */}
                </div>
            </div>
        </div>
    )
}

export default StartScreen