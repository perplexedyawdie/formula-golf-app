import ColyseusContext from "@/context/ColyseusContext";
import Avatar from "boring-avatars";
import { useEffect, useContext } from 'react'

function CreateGame() {
    const colyClient = useContext(ColyseusContext)

    return (
        <>
            <input type="checkbox" id="creategame-modal" className="modal-toggle" />
            <label htmlFor="creategame-modal" className="modal modal-bottom sm:modal-middle">
                <label className="modal-box relative">
                    <label htmlFor="creategame-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 className="font-bold text-lg">Share this code with your friend!</h3>
                    <p className="py-4">{colyClient?.room?.id}</p>
                    <div className="modal-action justify-center items-center">
                        {/* <label htmlFor="creategame-modal" className="btn">Yay!</label> */}
                        {
                            colyClient?.playerJoined ? (
                                <div className="avatar">
                                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                        <Avatar
                                            size={100}
                                            name={Math.random().toString()}
                                            variant="sunset"
                                            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                                        />
                                    </div>
                                </div>
                            ) : null
                        }
                    </div>
                </label>
            </label>
        </>
    );
}

export default CreateGame;