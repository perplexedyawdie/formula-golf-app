import React, { useState, useEffect } from 'react'
import { LineWave } from 'react-loader-spinner'
import HelpScreen from './modals/HelpScreen'
import HighScoreScreen from './modals/HighScoreScreen'


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

    useEffect(() => {
        const loadingTimer = setTimeout(() => {
            setIsLoading(false)
        }, 1500);
        return () => clearTimeout(loadingTimer);
    }, [])


    return (
        <>
            <HelpScreen />
            <HighScoreScreen />
            {
                isLoading ?
                    <LoadingSpiner /> : (
                        <div className="btn-group space-y-4 max-w-md btn-group-vertical">
                            <button className="btn btn-wide btn-active">Start</button>
                            <label htmlFor="help-modal" className="btn btn-wide">Help</label>
                            <label htmlFor="highscore-modal" className="btn btn-wide">High Score</label>
                        </div>
                    )
            }
        </>
    )

}

function StartScreen() {
    return (
        <div className="hero min-h-screen xl:max-w-5xl xl:mx-auto" style={{ backgroundImage: `url("/title-image.png")` }}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content h-full self-start text-neutral-content grid grid-rows-3 auto-cols-auto">
                <div className="max-w-full row-start-1 row-end-2">
                    <h1 className="lg:text-8xl md:text-6xl sm:text-4xl text-6xl text-center font-bugfast">Formula Golf</h1>
                </div>
                <div className="max-w-full row-start-2 row-end-4 items-start justify-center flex">
                    <MenuButtons />
                </div>
            </div>
        </div>
    )
}

export default StartScreen