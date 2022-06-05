import { GameTank } from './../../GameTank';
import { EventName } from './../../sys/events/EventName';
import { LoadingView } from './../loading/LoadingView';
import { Immortal } from './bonus/Immortal';
import { PlayBoard } from './../PlayBoard';
import *as PIXI from 'pixi.js';
import Bullet from './Bullet';
import CollisionManager from '../../utils/CollisionManager';
import { Sound } from '@pixi/sound';
import { ScreenSize } from '../../sys/enums/generalMainEnums';

export abstract class Tanks extends PIXI.Sprite {

    abstract type:string;
    // set moving logic
    abstract move(): void;
    
    vx: number;
    vy: number;
    rotationPosition:string;

    filter:PIXI.filters.ColorMatrixFilter;

    timerId:any;

    bombSpeed:number;

    immortalEvent:Event;

    sheild:Immortal;
    disableBonus:number;


    immortalTimer:any;
    isImmortal:boolean;

    enemySpeed:number;

    isFire:boolean;
    

    constructor(key: string) {

        let texture = PIXI.utils.TextureCache[key];

        super(texture);

        this.filter = new PIXI.filters.ColorMatrixFilter();  // filter for helthy bonus

        this.filter.enabled = false; // disabel filter as default
        this.isImmortal = false;     // disabel  as default
        this.isFire = true;

        this.disableBonus = 10000;   // disable all bonuses after 10 sec
        this.bombSpeed = 3.0;        //  speed of bullet
        this.vx = this.vy = 3;       // speed of player
        this.enemySpeed = 2.5;         // enemys speed

        this.anchor.set(0.5);

        this.sheild = new Immortal();
        this.addChild(this.sheild);

        this.alpha = 0;

        // const gr  = new PIXI.Graphics();
        // gr.lineStyle(1, 0xFFBD01, 1);
        // gr.drawRect( this.x -20, this.y-20, this.width+20, this.height+20);
        // this.addChild(gr);

        addEventListener(EventName.STOP_ANY_ACTIONS, ()=> {
            this.stopAction()
        });

    }

    // shoot bullet
    fire() {
        this.isFire = true;

        this.playSounds("shot");

        if (this.type == "tank") {

            let bullet: Bullet = null;
            bullet = new Bullet("bullet", {
                direction: this.rotationPosition,
                speed: this.bombSpeed,
                xPos: this.x,
                yPos: this.y, 
            });
            PlayBoard.getInstance().addChild(bullet);
        }
        if (this.type == "enemy_tank") {
            let bullet: Bullet = null;
            bullet = new Bullet("enemy_bullet",{
                direction: this.rotationPosition,
                speed: this.bombSpeed,
                xPos: this.x,
                yPos: this.y,
            });
            PlayBoard.getInstance().addChild(bullet);
        }
    }

    checkAndMove() {

        this.collisionBoards();
        this.collisionBonus();
    }

    // what to do if collision happens beetwen tanks and boards
    collisionBoards() {
        if (this.y <= ScreenSize.canvasHeight * 0.55) {
            for (let tile of PlayBoard.getInstance().topArea){
                CollisionManager.rectsColliding(tile, this, this.rotationPosition);
            }
        }
        if(this.y > ScreenSize.canvasHeight * 0.47) {
            for (let tile of PlayBoard.getInstance().bottomArea){
                CollisionManager.rectsColliding(tile, this, this.rotationPosition);
            }
        }

    }

    // what to do if collision happens beetwen tanks and bonuses
    collisionBonus():void {
        for (let bonus of PlayBoard.getInstance().bonuses){
            if ( CollisionManager.rectsCollidingBoard(bonus, this)){

                this.playSounds("bonus");

                if(bonus.name == "bonus_speed"){
                        this.vx = this.vy = (this.type == "enemy_tank") ? 3 : 4.5;

                        setTimeout(() => {
                            this.vx = this.vy = (this.type == "enemy_tank") ? this.enemySpeed : 3;

                        }, this.disableBonus);
                }
                if(bonus.name == "bonus_slow"){
                        this.vx = this.vy = (this.type == "enemy_tank") ? 0.5 : 1;

                        setTimeout(() => {
                            this.vx = this.vy =  (this.type == "enemy_tank") ? this.enemySpeed : 3;

                        }, this.disableBonus);
                }
                if(bonus.name == "bonus_live"){
                    this.setHealthyBonus();
                }
                if(bonus.name == "bonus_immortal"){
                    this.setImmortalBonus();
                }

                bonus.destroy();
                PlayBoard.getInstance().bonuses.splice(PlayBoard.getInstance().bonuses.indexOf(bonus), 1);

            }
        }
    }

    // moving logic
    go(direction: string) {
        let rotateAngle = Math.PI / 2;

        // for hard mode
        if (this.type == "tank"){
            dispatchEvent(new CustomEvent(EventName.PLAYER_POSITION, {
                detail: {
                    x: this.x,
                    y: this.y,
                },
            }));
        }

        this.checkAndMove();
  
        switch (direction) {
            case 'up':
                this.rotation = rotateAngle * 0;
                this.rotationPosition = direction;
                this.y -= this.vy;
                break;

            case 'down':
                this.rotation = rotateAngle * -2;
                this.rotationPosition = direction;
                this.y += this.vy;;
                break;

            case 'left':
                this.rotation = rotateAngle * -1;
                this.rotationPosition = direction;
                this.x -= this.vx;
                break;

            case 'right':
                this.rotation = rotateAngle * 1;
                this.rotationPosition = direction;
                this.x += this.vx;
                break;
        }
    }

    setSpeed(){
        
        if (this.type == "tank") {
            this.vx = this.vy = 3;
        }
        if (this.type == "enemy_tank") {
            this.vx = this.vy = this.enemySpeed;
           
        }
    }

    // if game over stop only palyer tanks. Enemies should move every time.
    stopAction(){

        if (this.type != "enemy_tank") {
            this.vx = this.vy = 0;
            this.bombSpeed = 0;
        }
        this.isFire = false;

    }

    // add helthy bonus for the tanks
    setHealthyBonus(){
        const tint = 0x00FF00;
        const r = tint >> 16 & 0xFF;
        const g = tint >> 8 & 0xFF;
        const b = tint & 0xFF;
        this.filter.matrix[0] = r / 255;
        this.filter.matrix[6] = g / 255;
        this.filter.matrix[12] = b / 255; 
        this.filters = [this.filter];
        this.filter.enabled = true;

        setTimeout(() => {
            this.filter.enabled = false;
            this.filter.reset();

        }, this.disableBonus);  
    }

    // add helthy immortal bonus for the tanks
    setImmortalBonus(){
        this.sheild.alpha = 1;
        this.isImmortal = true;

        this.immortalTimer = setTimeout(() => {
            this.isImmortal = false;
            this.sheild.alpha = 0;

        }, this.disableBonus);  
    }

    playSounds(soundsName:string){
        let getSound = LoadingView.loader.resources[soundsName];
        const sound = Sound.from(getSound);
        sound.play(); 

    }

}