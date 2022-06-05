import { EventName } from './../../sys/events/EventName';
import *as PIXI from 'pixi.js';
import { ScreenSize } from '../../sys/enums/generalMainEnums';
import { LoadingView } from '../loading/LoadingView';
import { gsap } from "gsap";
import { Sound } from '@pixi/sound';
 
export class GamePoints extends PIXI.Sprite {

    generalPoints:number;
    animationTricker: PIXI.Ticker;

    constructor(){

        let texture = LoadingView.loader.resources["scores"].texture;
        super(texture);

        this.generalPoints = 0;
        this.anchor.set(0.5);
        this.x = ScreenSize.canvasWidht - this.width;
        this.y = ScreenSize.canvasHeight * 0.5 - this.height;

        this.animationTricker = new PIXI.Ticker;

        this.addChild(this.initLoadingText());

        // if game over play animation
        addEventListener(EventName.GAME_OVER, ()=>{
            this.gameOverAnimation();
        });

    }

    initLoadingText(): PIXI.Text {

        const loadTextStyle = new PIXI.TextStyle({
            fontSize: 30,
            fill: '#ffffff',
        });

        let loadText = new PIXI.Text('', loadTextStyle);

        loadText.anchor.set(0.5);
        loadText.x = 0;
        loadText.y = this.height;
        loadText.text = "0";

        addEventListener(EventName.POINTS, (e: CustomEventInit) => {
            loadText.text = this.generalPoints += e.detail.points;

        })
        return loadText;
    }

    gameOverAnimation(){
        gsap.to(this.scale, {x: 2, y: 2, duration: 4});
        gsap.to(this, {x: ScreenSize.canvasWidht * 0.5, duration: 8});
    }

    
}