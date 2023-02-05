import CreateGame from "./modals/CreateGame";
import HelpScreen from "./modals/HelpScreen";
import HighScoreScreen from "./modals/HighScoreScreen";
import JoinGame from "./modals/JoinGame";

function ModalGroup() {
    return (
        <>
            <HelpScreen />
            <HighScoreScreen />
            <CreateGame />
            <JoinGame />
        </>
    );
}

export default ModalGroup;