import { GameTank } from './GameTank';
import { MainView } from './MainView';

window.onload = () => {

    const gameName:string = 'Tanks'; // game name

    new GameTank(gameName, new MainView); // entry point to the game
};
