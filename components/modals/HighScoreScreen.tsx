import React, { useEffect, useState, useId } from 'react'
import axios from 'axios'
interface HighScores {
    _id: string
    userName: string
    clicks: number
    distanceTravelled: number
}
function HighScoreScreen() {
    const [scores, setScores] = useState<HighScores[]>([])
    useEffect(() => {
      axios.get('/api/highscores').then((scores) => {
        setScores(scores.data)
      })
    }, [])
    
    return (
        <>
            <input type="checkbox" id="highscore-modal" className="modal-toggle" />
            <label htmlFor="highscore-modal" className="modal modal-bottom sm:modal-middle">
                <label className="modal-box relative">
                    <label htmlFor="highscore-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 className="font-bold text-lg">🏆 High Scores 🏆</h3>
                    <div className="overflow-x-auto overflow-y-scroll">
                        <table className="table w-full">

                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Clicks</th>
                                    <th>Distance travelled</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* <!-- row 1 --> */}
                                {
                                    scores.map((score) => (
                                        <tr key={score._id}>
                                        <td>{score.userName}</td>
                                        <td>{score.clicks}</td>
                                        <td>{score.distanceTravelled}</td>
                                    </tr>
                                    ))
                                }
                               
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-action">
                        <label htmlFor="highscore-modal" className="btn">Yay!</label>
                    </div>
                </label>
            </label>
        </>
    )
}

export default HighScoreScreen