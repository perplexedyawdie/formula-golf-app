import ColyseusContext from "@/context/ColyseusContext";
import { useContext, useState } from "react";

function JoinGame() {
    const [gameCode, setGameCode] = useState<string>("")
    const colyClient = useContext(ColyseusContext)
    function handleJoinGame() {
        if (!colyClient?.room && colyClient?.client && gameCode != "") {
            colyClient.client.joinById(gameCode)
                .then((room) => {
                    room.onStateChange((newState) => {
                        console.log("New state:", newState);
                    });

                    room.onLeave((code) => {
                        console.log("You've been disconnected.");
                        colyClient.setRoom(null)
                    });
                    colyClient.setRoom(room)
                })
        }
    }
    return (
        <>
            <input type="checkbox" id="joingame-modal" className="modal-toggle" />
            <label htmlFor="joingame-modal" className="modal modal-bottom sm:modal-middle">
                <label className="modal-box relative">
                    <label htmlFor="joingame-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 className="font-bold text-lg">Hey, enter the game code below!</h3>
                    <input
                        value={gameCode}
                        onChange={(e) => setGameCode(e.target.value)}
                        type="text"
                        placeholder="Game code"
                        className="input input-bordered input-primary w-full mt-4" />
                    <div className="modal-action justify-center items-center">
                        <label
                            onClick={() => handleJoinGame()}
                            htmlFor="joingame-modal"
                            className="btn">
                            Join
                        </label>
                    </div>
                </label>
            </label>
        </>
    );
}

export default JoinGame;