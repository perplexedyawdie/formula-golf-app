import React from 'react'

function HighScoreScreen() {
  return (
    <>
            <input type="checkbox" id="highscore-modal" className="modal-toggle" />
            <label htmlFor="highscore-modal" className="modal modal-bottom sm:modal-middle">
                <label className="modal-box relative">
                    <label htmlFor="highscore-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 className="font-bold text-lg">Congratulations random Internet user!</h3>
                    <p className="py-4">You've been selected for a chance to get one year of subscription to use Wikipedia for free!</p>
                    <div className="modal-action">
                        <label htmlFor="highscore-modal" className="btn">Yay!</label>
                    </div>
                </label>
            </label>
        </>
  )
}

export default HighScoreScreen