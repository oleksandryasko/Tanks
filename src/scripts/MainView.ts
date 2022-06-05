import { PlayBoard } from './gui/PlayBoard';
import { IntroView } from './gui/intro/IntroView';
import { EventName } from './sys/events/EventName';
import * as PIXI from 'pixi.js'
import { GamePoints } from './gui/points/GamePoints';
import { GameWin } from './gui/winContainer/GameWin';

export class MainView extends PIXI.Container{

    constructor() {
        super();
        
        addEventListener(EventName.LOADING_DONE, () => {
            this.addChild(addIntroView());
        });

        addEventListener(EventName.INTRO_DONE, () => {
            this.addChild(addPlayBoard());
            this.addChild(addGamePoints());
        });

        addEventListener(EventName.GAME_WIN, () => {
            this.addChild(addGameWinContainer());
        });
    }
} 

function addIntroView():IntroView {
    let intro = new IntroView();
    return intro;
}

function addPlayBoard():PlayBoard {
    let mainContPlay = PlayBoard.getInstance();
    return mainContPlay;
}

function addGamePoints():GamePoints {
    let gamePoints = new GamePoints();
    return gamePoints;
}

function addGameWinContainer():GameWin {
    let gameWinCont = new GameWin();
    return gameWinCont;
}
