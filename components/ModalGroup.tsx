import CreateGame from "./modals/CreateGame";
import HelpScreen from "./modals/HelpScreen";
import HighScoreScreen from "./modals/HighScoreScreen";
import JoinGame from "./modals/JoinGame";
import UserAccount from "./modals/UserAccount";


function ModalGroup() {
    

    return (
        <>
            <HelpScreen />
            <HighScoreScreen />
            <CreateGame />
            <JoinGame />
            <UserAccount />
        </>
    );
}

export default ModalGroup;