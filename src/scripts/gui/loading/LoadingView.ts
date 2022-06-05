import { ScreenSize } from '../../sys/enums/generalMainEnums';
import *as PIXI from 'pixi.js';
import { Loader } from "pixi.js";
import { EventName } from '../../sys/events/EventName';

export class LoadingView extends PIXI.Container {

    static loader: Loader;

    constructor() {
        super();

        const doneEvent = new Event(EventName.LOADING_DONE);
        const loadSprite = new PIXI.Sprite;

        // for showing loader animation need to load loaderBar and loaderBg before downloading all images
        let loaderBar = PIXI.Sprite.from('assets/images/load/loader-bar.png');
        let loaderBg = PIXI.Sprite.from('assets/images/load/loader-bg.png');
        
        LoadingView.loader = Loader.shared;

        // load bonus imgs
        for ( let key in this.getBonus()) {
            LoadingView.loader.add(key,  "assets/images/bonus/" + key + ".png");
        };

        // load board imgs
        for ( let key in this.getBoard()) {
            LoadingView.loader.add(key,  "assets/images/board/" + key + ".png");
        };

        // load tanks imgs
        for ( let key in this.getTanks()) {
            LoadingView.loader.add(key,  "assets/images/tanks/" + key + ".png");
        };

        // load extra imgs
        for ( let key in this.getExtraImgs()) {
            LoadingView.loader.add(key,  "assets/images/" + key + ".png");
        };

        // load sounds
        for ( let key in this.getSounds()) {
            LoadingView.loader.add(key,  "assets/sounds/" + key + ".wav");
        };

        LoadingView.loader.load( () => {console.log("All texture loaded")});

        loaderBar.scale.set(0, 1);

        let scaleY = 1; 
        let scaleX = 0;

        // show progress bar
        LoadingView.loader.onProgress.add((e:any) => {
            scaleX = e.progress / 100;
            loaderBar.scale.set(scaleX, scaleY);
        });

        // Done loading
        LoadingView.loader.onComplete.add((_e:any) => {
            // small delay
            setTimeout(() => {
                this.removeChildren();
                dispatchEvent(doneEvent);
            }, 2000);

        });

        this.addLoader(loaderBg, loaderBar, loadSprite)
    }

    initLoadingText(xPos:number, yPos:number):PIXI.Text {

        const loadTextStyle = new PIXI.TextStyle({
            fontSize: 30,
            fill: '#ffffff',
        });

        let loadText = new PIXI.Text('Loading...', loadTextStyle);

        loadText.x = xPos;
        loadText.y = yPos - loadText.height;
        
        return loadText;
    }

    /*
    loadBack - loading background
    loadBar - loading bar (animation progress bar)
    loadSprite - main sprite. Includes all loading elements
    */
    addLoader(loadBack:PIXI.Sprite, loadBar:PIXI.Sprite, loadSprite:PIXI.Sprite){

        let halfHeightCanv = ScreenSize.canvasHeight * 0.5;
        let halfWidthCanv = ScreenSize.canvasWidht * 0.5;

        let loadingText = this.initLoadingText(loadBar.x, loadBar.y);
        
        loadBack.anchor.set(0.5);
        loadBar.anchor.set(0.5);
        loadingText.anchor.set(0.5);
        
        loadBar.x = loadBack.x;
        loadBar.y = loadBack.y;
        
        loadSprite.x = halfWidthCanv;
        loadSprite.y = halfHeightCanv;
        
        loadSprite.addChild(loadingText, loadBack, loadBar); 

        this.addChild(loadSprite);  
    }

    // return object with bonus imgs
    getBonus():object {
        return {
            bonus_immortal: null,
            bonus_live: null,
            bonus_slow: null,
            bonus_speed: null,
        }
    }
    
    // return object with board imgs
    getBoard():object {
        return {
            eagle: null,
            leaves: null,
            small_wall_1: null,
            small_wall_2: null,
            small_wall_3: null,
            small_wall_4: null,
            wall: null,
            water: null,
        }
    }
    // return object with tanks imgs
    getTanks():object {
        return {
            enemy_blue: null,
            enemy_red: null,
            enemy_white: null,
            tank: null,
        }
    }

    // return object with bullet/buttons.... imgs
    getExtraImgs():object {
        return {
            appear: null,
            bullet: null,
            button: null,
            enemy_bullet: null,
            explode_small: null,
            explode: null,
            scores: null,
        }
    }

    // return object sounds
    getSounds():object {
        return {
            bonus: null,
            explode_music: null,
            hit: null,
            lose: null,
            shot: null,
            win: null,
        }
    }

}