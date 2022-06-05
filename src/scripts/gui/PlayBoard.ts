import { LoadingView } from './loading/LoadingView';
import { AnimationManager } from './../utils/AnimationManager';
import { mapImgSize, ScreenSize } from './../sys/enums/generalMainEnums';
import { Tile } from './board/Tile';
import *as PIXI from 'pixi.js';
import { EventName } from '../sys/events/EventName';
import { Sound } from '@pixi/sound';
import CollisionManager from '../utils/CollisionManager';

export class PlayBoard extends PIXI.Container {

    private static instance: PlayBoard;     // singleton
    private map: Array<Array<number>>;      // Tiles with id
    private point:PIXI.Point;

    public bonuses: Array<PIXI.Sprite>;     // bonuses for access in other classes
    public playerTanks: Array<PIXI.Sprite>  // player for access in other classes
    public enemieTanks: Array<PIXI.Sprite>  // enemies for access in other classes

    public topArea:Array<PIXI.Sprite>       // top boards for access in other classes
    public bottomArea:Array<PIXI.Sprite>    // bottom boards for access in other classes

    private enemiesTimerId:any;
    private bonusesTimerId:any;

    private isRandomEnemiesdDone = 0;

    // class PlayBoard is singleton
    public static getInstance(): PlayBoard {
        if (!PlayBoard.instance) {
            PlayBoard.instance = new PlayBoard();
        }
        return PlayBoard.instance;
    }

    private constructor() {
        super();

        this.map = new Array();

        this.playerTanks = new Array();
        this.bonuses = new Array();
        this.enemieTanks = new Array();

        this.topArea = new Array();
        this.bottomArea = new Array();

        this.showMainTiles();

        // play blast animation on board
        addEventListener(EventName.BOARD_DONE, (e: CustomEventInit) => {
            CollisionManager.isCollisionAnimation( this, "explode_small", e.detail.xPos, e.detail.yPos)
        });

        // play blast animation on eagle
        // game is done((
        addEventListener(EventName.EAGLE_DONE, (e: CustomEventInit) => {
            CollisionManager.isCollisionAnimation(this, "explode", e.detail.xPos, e.detail.yPos);
            this.gameOver();
        });

        // play blast animation on tanks
        addEventListener(EventName.TANK_DONE, (e: CustomEventInit) => {
            CollisionManager.isCollisionAnimation(this, "explode", e.detail.xPos, e.detail.yPos);
        });

        // switch the game to gard mode
        addEventListener(EventName.HARD_MODE_SWITHER, ()=> {
            this.hardMode();
        });

        // if is game over stop showing bonuses and enemies
        addEventListener(EventName.STOP_ANY_ACTIONS, ()=> {
            clearTimeout(this.enemiesTimerId);
            clearTimeout(this.bonusesTimerId);
        });

        // if win
        addEventListener(EventName.GAME_WIN, () => {
            this.alpha = 0.4;
        });

    }

    // general map of the game. Show all elements
    showMainTiles(){

        // 0 - empty space
        // 1 - grey board
        // 2 - red board
        // 3 - bird
        // 4 - player tank
        // 5 - enemy tank
        // 6 - bonus_immortal
        // 7 - bonus_live
        // 8 - bonus_slow
        // 9 - bonus_speed
        this.map = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],    // 0
                    [1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1],    // 1
                    [1, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 1,],   // 2
                    [1, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 1,],   // 3
                    [1, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 1, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 1,],   // 4
                    [1, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 1,],   // 5
                    [1, 0, 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 2, 2, 0, 1,],   // 6
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],   // 7
                    [1, 2, 2, 0, 2, 2, 2, 2, 0, 0, 2, 2, 0, 2, 2, 0, 0, 2, 2, 2, 2, 0, 2, 2, 1,],   // 8
                    [1, 1, 1, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 1, 1, 1,],   // 9
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],   // 10
                    [1, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 2, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 1,],   // 11
                    [1, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 1,],   // 12
                    [1, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 1,],   // 13
                    [1, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 1,],   // 14
                    [1, 0, 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 2, 2, 0, 1,],   // 15
                    [1, 0, 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 4, 0, 0, 0, 0, 2, 2, 0, 0, 2, 2, 0, 1,],   // 16
                    [1, 0, 2, 2, 0, 0, 2, 2, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 0, 0, 2, 2, 0, 1,],   // 17
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],   // 18
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],   // 19
        ];

        // every 15 sec show bonus
        this.bonusesTimerId = setInterval(() => {
            this.setRandomBonus();
        }, 15000);


        // show tile boards and set correct position
        for (let index = 0; index < this.map.length; index++) {
            let y = index; // for correct [y] position

            for (let nestedIndex = 0; nestedIndex < this.map[index].length; nestedIndex++) {

                let tile = new Tile(this.map[index][nestedIndex]);
                let x = nestedIndex; // for correct [x] position

                tile.setLoc(x, y, mapImgSize.imageHeight, mapImgSize.imageWidth); // set x/y position

                // push only boards depending on screen sizes
                if (this.map[index][nestedIndex] == 1 || this.map[index][nestedIndex] == 2 || this.map[index][nestedIndex] == 3) {
                    
                    if (tile.image.y < ScreenSize.canvasHeight * 0.5) {
                        this.topArea.push(tile.image);
                    }
                    if (tile.image.y > ScreenSize.canvasHeight * 0.5) {
                        this.bottomArea.push(tile.image);
                    }
                }

                // push only bonuses
                if (this.map[index][nestedIndex] == 6 || this.map[index][nestedIndex] == 7 || this.map[index][nestedIndex] == 8 || this.map[index][nestedIndex] == 9) {
                    this.bonuses.push(tile.image);
                }

                // show extra red bloks
                if (this.map[index][nestedIndex] == 2) {
                    for( let redIndex = 0; redIndex <= 3; redIndex++){
                        this.setExtraRedBloks(redIndex, this.map[index][nestedIndex], x,y );
                    }
                }
                
                // play appear animation of all tanks
                if (this.map[index][nestedIndex] == 4) {
                    this.playAppearAnimation(tile);
                    this.playerTanks.push(tile.image);
                }
                if (this.map[index][nestedIndex] == 5) {
                    this.playAppearAnimation(tile);
                    this.enemieTanks.push(tile.image);
                }

                this.addChild(tile);
            }

        }

        this.enemiesTimerId = setInterval(() => {
            this.setRandomEnemies();
            this.isRandomEnemiesdDone++;

            // stop show random enemies
            if(this.isRandomEnemiesdDone == 3){
                clearTimeout(this.enemiesTimerId);
            }
        }, 8000);

    }

    // show extra red blocks
    setExtraRedBloks(key:number, arrIndex:number, xPos:number, yPos:number){
        let tileRed = new Tile(arrIndex);

        // show redBlock and for each set the correct position
        switch(key) {
            case 1:
                this.showRedBolck(tileRed, () => {
                    tileRed.setLoc(xPos, yPos,  mapImgSize.imageHeight, tileRed.image.width);
                });
                break;
            case 2:
                this.showRedBolck(tileRed, () => {
                    tileRed.setLoc(xPos, yPos, tileRed.image.height, mapImgSize.imageWidth);
                });
                break;
            case 3:
                this.showRedBolck(tileRed, () => {
                    tileRed.setLoc(xPos, yPos, tileRed.image.height, tileRed.image.width);
                });
                break;
        }
    }

    showRedBolck(tile: Tile, callBack: () => void) {
        callBack();
        this.addChild(tile);
        if (tile.image.y <= ScreenSize.canvasHeight * 0.5) {
            this.topArea.push(tile.image);
        }
        if (tile.image.y > ScreenSize.canvasHeight * 0.5) {
            this.bottomArea.push(tile.image);
        }
    }

    // set random bonus on the tile
    setRandomBonus() {

        let yBonus = this.getRandomArbitrary(1, this.map.length - 2);
        let xBonus = this.getRandomArbitrary(1, this.map[yBonus].length - 2);

        let bonusRandom = this.getRandomArbitrary(6, 10);

        let bonusIndex = this.map[yBonus][xBonus] = + bonusRandom;

        let bonusTile = new Tile(bonusIndex);
        bonusTile.setLoc(xBonus, yBonus, bonusTile.image.height, bonusTile.image.width);

        this.bonuses.push(bonusTile.image);
        this.addChild(bonusTile);

    }

    // set random bonus on the tile
    setRandomEnemies() {
        for (let index = 0; index < this.map.length; index++) {
            for (let nestedIndex = 0; nestedIndex < this.map[index].length; nestedIndex++) {
                if(this.map[index][nestedIndex] == 5){
                    let bonusTile = new Tile(this.map[index][nestedIndex]);
                    bonusTile.setLoc(nestedIndex, index, mapImgSize.imageHeight, mapImgSize.imageWidth); // set x/y position
                    this.playAppearAnimation(bonusTile);
                    this.enemieTanks.push(bonusTile.image); 
                    this.addChild(bonusTile);
                }
            }
        }
    }

    getRandomArbitrary(min: number, max: number) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    // play Appear animation 
    playAppearAnimation(tile: Tile) {

        let tricker = new PIXI.Ticker;
        this.point = new PIXI.Point(tile.image.x, tile.image.y);

        let animation = new AnimationManager("appear", this.point, () => {
            tricker.add((delta) => {
                tile.image.alpha += delta;

                if (tile.image.alpha > 1) {
                    tricker.destroy();
                }
            })
            tricker.start();
            tricker.speed = 0.1;
            animation.destroy();

        });

        this.addChild(animation);
    }

    // oh no, game over 
    gameOver() {
        let gameOverEvent = new Event(EventName.STOP_ANY_ACTIONS);
        dispatchEvent(gameOverEvent);

        let tricker = new PIXI.Ticker;
        let gameOverFilter = new PIXI.filters.BlurFilter();
        gameOverFilter.blur = 0;

        // show like the end animation if you lose
        tricker.add((delta) => {
            delta = 0.3;
            gameOverFilter.blur += delta;

            if (gameOverFilter.blur >= 10) {
                tricker.stop();
                tricker.destroy();
            }

            tricker.speed = 0.1;

        });
        tricker.start();
        this.filters = [gameOverFilter];
        this.playSounds("lose");
    }

    playSounds(soundsName: string) {
        let getSound = LoadingView.loader.resources[soundsName];
        const sound = Sound.from(getSound);
        sound.play();
    }

    // simple logic for hard mode
    hardMode(){
        this.scale.set(2.5,2.5)

        // camera follow to player tank
        addEventListener(EventName.PLAYER_POSITION, (e: CustomEventInit) => {
            this.pivot.x = e.detail.x / 3;
            this.pivot.y = e.detail.y / 1.5;
        })

    }
}
