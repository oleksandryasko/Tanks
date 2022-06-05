import { LoadingView } from './../loading/LoadingView';
import { EventName } from '../../sys/events/EventName';
import *as PIXI from 'pixi.js';
import { ScreenSize } from '../../sys/enums/generalMainEnums';

export class IntroView extends PIXI.Container {

    private doneEvent:Event;
    private hardModeEvent:Event;
    private isHardMode:boolean;
    
    constructor(){
        super();

        this.doneEvent = new Event(EventName.INTRO_DONE);
        this.hardModeEvent = new Event(EventName.HARD_MODE_SWITHER);
        this.isHardMode = false;

        this.addElements();


    }

    addElements():void {

        const intoSprite = new PIXI.Sprite();                   // main sprite incudes logo and btn
        const halfWidthCanv = ScreenSize.canvasWidht * 0.5;
        const halfHeightCanv = ScreenSize.canvasHeight * 0.5;

        intoSprite.x= halfWidthCanv;
        intoSprite.y= halfHeightCanv;

        this.addLogo(0, 0, intoSprite);
        this.addPlayButton(0, 100, intoSprite);
        this.addChild(intoSprite);
    }

    // add logo to Intro (img or only text)
    addLogo(xPos:number, yPos:number, container:PIXI.Sprite):void {
        const gameLogoStyle = new PIXI.TextStyle({
            fontSize: 60,
            fill: '#ffffff',
        });
        let gameLogo = new PIXI.Text('Tank Game', gameLogoStyle);
        gameLogo.x = xPos;
        gameLogo.y = yPos - gameLogo.height - 30;
        gameLogo.anchor.set(0.5);
        container.addChild(gameLogo);

        this.addHardModeBox(container, gameLogo.x, gameLogo.y+gameLogo.height);
        
    }

    // add btn for starting the game
    addPlayButton(xPos:number, yPos:number,  container:PIXI.Sprite):void {

        let texture = LoadingView.loader.resources["button"].texture;
        let btn = new PIXI.Sprite(texture);
        btn.x = xPos;
        btn.y = yPos;
        btn.interactive = true;
        btn.buttonMode = true;
        btn.cursor = 'pointer';
        btn.anchor.set(0.5);

        btn.addListener(EventName.MOUSEOVER.toLowerCase(), () => {
            btn.alpha = 0.3;
        });

        btn.addListener(EventName.MOUSEOUT.toLowerCase(), () => {
            btn.alpha = 1;
        });

        btn.addListener(EventName.MOUSEDOWN.toLowerCase(), () => {
            btn.scale.set(0.9, 0.9);
        });

        btn.addListener(EventName.CLICK.toLowerCase(), () => {
            dispatchEvent(this.doneEvent); // dispatch for other classes

            if (this.isHardMode){
                dispatchEvent(this.hardModeEvent);
            }
            btn.removeAllListeners()       
            this.removeContainer();     // remove intro after click
        });

        container.addChild(btn);
    }

    addHardModeBox(container:PIXI.Sprite, offSetX:number, offSetY:number){
        
        let filter = new PIXI.filters.ColorMatrixFilter();  // filter for helthy bonus

        let texture = LoadingView.loader.resources["tank"].texture;
        let hardModeBtn = new PIXI.Sprite(texture);

        const tint = 0xFF0000;
        const r = tint >> 16 & 0xFF;
        const g = tint >> 8 & 0xFF;
        const b = tint & 0xFF;
        filter.matrix[0] = r / 255;
        filter.matrix[6] = g / 255;
        filter.matrix[12] = b / 255; 
        
        hardModeBtn.interactive = true;
        hardModeBtn.buttonMode = true;
        hardModeBtn.cursor = 'pointer';
        hardModeBtn.anchor.set(0.5);
        hardModeBtn.x = offSetX;
        hardModeBtn.y = offSetY;
       
        hardModeBtn.addListener(EventName.CLICK.toLowerCase(), ()=>{
            this.isHardMode = true;
            hardModeBtn.filters = [filter];
            hardModeBtn.removeAllListeners();
        })

        this.addHardInfo(container, hardModeBtn.x - 20, hardModeBtn.y );
        container.addChild(hardModeBtn)
    }

    addHardInfo(container:PIXI.Sprite, offSetX:number, offSetY:number ){
        const gameLogoStyle = new PIXI.TextStyle({
            fontSize: 15,
            fill: '#ffffff',
        });
        let hardModeText = new PIXI.Text('Hard mode. Exprementaly', gameLogoStyle);
        hardModeText.x = offSetX - hardModeText.width * 0.5;
        hardModeText.y = offSetY;
        hardModeText.anchor.set(0.5);
        container.addChild(hardModeText);
    }

    // click on btn remove intro and goes to main play container
    removeContainer() {
        this.destroy();
    }
}