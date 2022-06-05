import { LoadingView } from './../loading/LoadingView';
import { EnemyTank } from './../tank/EnemyTank';
import { mapImgSize } from '../../sys/enums/generalMainEnums';

import *as PIXI from 'pixi.js';
import { PlayerTank } from '../tank/PlayerTank';

export class Tile extends PIXI.Sprite {

    image:PIXI.Sprite;

    constructor(id:number){
        super();

        switch (id) {
            case 1: 
                let greyBoardName = "wall";
                let texture = LoadingView.loader.resources[greyBoardName].texture;
                this.image = new PIXI.Sprite(texture);
                this.image.name = greyBoardName;
            break;

            case 2:
                let redBoardName = "small_wall_1";
                let texture2 = LoadingView.loader.resources[redBoardName].texture;
                this.image = new PIXI.Sprite(texture2);
                this.image.name = redBoardName;
                
            break;
            case 3:
                let eagle = "eagle";
                let texture3 = LoadingView.loader.resources[eagle].texture;
                this.image = new PIXI.Sprite(texture3);
                this.image.name = eagle;
            break;
            case 4:
                let player = "player_tank";
                this.image = new PlayerTank();
                this.image.name = player;
            break;
            case 5:
                let enemy = "enemy_tank";
                this.image = new EnemyTank();
                this.image.name = enemy;
            break;
            case 6:
                let imortal = "bonus_immortal";
                let texture4 = LoadingView.loader.resources[imortal].texture;
                this.image = new PIXI.Sprite(texture4);
                this.image.name = imortal;
            break;
            case 7:
                let live = "bonus_live";
                let texture5 = LoadingView.loader.resources[live].texture;
                this.image = new PIXI.Sprite(texture5);
                this.image.name = live;
            break;
            case 8:
                let slow = "bonus_slow";
                let texture6 = LoadingView.loader.resources[slow].texture;
                this.image = new PIXI.Sprite(texture6);
                this.image.name = slow;
            break;
            case 9:
                let speed = "bonus_speed";
                let texture7 = LoadingView.loader.resources[speed].texture;
                this.image = new PIXI.Sprite(texture7);
                this.image.name = speed;
            break;
        }


        if (this.image != null) {

            if (this.image.name == "small_wall_1") {
                this.image.anchor.set(0);

            }else{
                this.image.anchor.set(0.5);
            }
            this.addChild(this.image);

        }
       
    }

    public setLoc(x:number, y:number, imageHeight:number, imageWidth:number) { 
        if (this.image != null) {
            this.image.x =  imageHeight + x *  mapImgSize.imageHeight; 
            this.image.y =  imageWidth + y * mapImgSize.imageWidth; 
            
        }
    }
}