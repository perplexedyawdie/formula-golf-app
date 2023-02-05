function JoinGame() {
    return (
        <>
            <input type="checkbox" id="joingame-modal" className="modal-toggle" />
            <label htmlFor="joingame-modal" className="modal modal-bottom sm:modal-middle">
                <label className="modal-box relative">
                    <label htmlFor="joingame-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 className="font-bold text-lg">Hey, enter the game code below!</h3>
                    <input type="text" placeholder="Game code" className="input input-bordered input-primary w-full mt-4" />                    
                    <div className="modal-action justify-center items-center">
                        <label htmlFor="joingame-modal" className="btn">Join</label>
                    </div>
                </label>
            </label>
        </>
    );
}

export default JoinGame;