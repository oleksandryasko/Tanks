import * as PIXI from 'pixi.js'
import { LoadingView } from './gui/loading/LoadingView';
import { ScreenSize } from './sys/enums/generalMainEnums';

export class GameTank  {

    static _render: PIXI.Application; // for render canvas
    private _gameName:string;          // game name 

    private _screenWidth:number;  
    private _screenHeight:number;

    constructor(gameName:string, _gameContainer:PIXI.Container) {

        PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = false;
        // PIXI.settings.SORTABLE_CHILDREN = true;
        
        this._screenWidth = ScreenSize.canvasWidht;
        this._screenHeight = ScreenSize.canvasHeight;
        this._gameName = gameName;

        GameTank._render = new PIXI.Application({
            width: this._screenWidth,
            height: this._screenHeight,
            backgroundColor: 0x112232,
        });

        document.body.appendChild(GameTank._render.view);      // add canvas to html
        GameTank._render.stage.sortableChildren = true;
        GameTank._render.stage.addChild(this.initGameName());  // add game name to the top
        GameTank._render.stage.addChild(new LoadingView());    // add preloader
        GameTank._render.stage.addChild(_gameContainer);       // add main container (include IntroView, MainState, EndGame, WinContainer)
    };

    initGameName():PIXI.Text {
        const gameNameStyle = new PIXI.TextStyle({
            fontSize: 11,
            fill: '#ffffff',
        });
        const gameName = new PIXI.Text(this._gameName, gameNameStyle);
        gameName.x = 10;
        gameName.y = 0;
        return gameName;
    }
}