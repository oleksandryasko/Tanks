import *as PIXI from 'pixi.js';
import { ScreenSize } from '../../sys/enums/generalMainEnums';

export class GameWin extends PIXI.Sprite {

    constructor(){
        super();

        const gameLogoStyle = new PIXI.TextStyle({
            fontSize: 60,
            fill: '#ffffff',
        });
        let gameLogo = new PIXI.Text('YOU WIN', gameLogoStyle);
        gameLogo.x = ScreenSize.canvasWidht * 0.5;
        gameLogo.y = ScreenSize.canvasHeight * 0.5;
        gameLogo.anchor.set(0.5);
        this.addChild(gameLogo);
    }
}