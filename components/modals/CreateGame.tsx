import ColyseusContext from "@/context/ColyseusContext";
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
                    <div className="modal-action">
                        <label htmlFor="creategame-modal" className="btn">Yay!</label>
                    </div>
                </label>
            </label>
        </>
    );
}

export default CreateGame;