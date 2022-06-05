import { ScreenSize } from './../../sys/enums/generalMainEnums';
import { Tanks } from "./Tanks";
import *as PIXI from 'pixi.js';
import CollisionManager from "../../utils/CollisionManager";
import { EventName } from '../../sys/events/EventName';

export class EnemyTank extends Tanks {

    type = "enemy_tank";
    tricker:PIXI.Ticker;

    intervalTimerId:any;

    constructor(){

        super(getRandomEnemy());

        this.tricker =  new PIXI.Ticker;
        this.setSpeed();
        
        let rotateAngle = Math.PI / 2;
        this.rotation = rotateAngle * -2;

        let _this = this;
        
        (function loop() {
            var rand = Math.round(Math.random() * 4500);
            _this.timerId = setTimeout(function() {
                if (_this.isFire){
                    _this.fire()

                }
                    loop();  
            }, rand);
        }());

        this.rotationPosition = 'down';

        this.move();

    }

    move() {

        // bot mode
        this.runEnemy();

    }

    setPriorityRandomWay(upWeight:number, dowmWeight:number, rightWeight:number, leftWeight:number){
        let getRandomWay:string;

        // setInterval(() => {
            getRandomWay = CollisionManager.setRandom([{
                way: "down",
                weight: dowmWeight
            },
            {
                way: "up",
                weight: upWeight
            },
            {
                way: "right",
                weight: rightWeight
            },
            {
                way: "left",
                weight: leftWeight
            },
            ]);

        // }, 1500);

        return getRandomWay;
        // this.runEnemy( () => { this.go(getRandomWay); });
            
    }

    runEnemy() {

        let getRandomWay: string;

        addEventListener(EventName.EAGLE_DONE, (e: CustomEventInit) => {
            console.log(e.detail.yPos);
        });

        this.intervalTimerId = setInterval(() => {

            // depending on position of enemies set priority way
            // 900 - is the width of game map.

            // top left
            if (this.y <= ScreenSize.canvasHeight * 0.5 && this.x < 900 *0.5) {
                getRandomWay = this.setPriorityRandomWay(1, 3, 2, 1);
            }
            // top right
            if (this.y < ScreenSize.canvasHeight * 0.5 && this.x > 900 *0.5) {
                getRandomWay = this.setPriorityRandomWay(1, 3, 1, 2);

            }
            // // bottom left
            if (this.y >= ScreenSize.canvasHeight * 0.4 && this.x < 900 *0.5) {
                getRandomWay = this.setPriorityRandomWay(1, 3, 1, 1);

            }
            // //bottom right
            if (this.y > ScreenSize.canvasHeight * 0.4 && this.x > 900 *0.5) {
                getRandomWay = this.setPriorityRandomWay(1, 3, 1, 1);
            }

            // if enemies position > eagle position run them to eagle
            if (this.y >= 660 &&  this.x < 900 *0.5) {
                getRandomWay = this.setPriorityRandomWay(0, 0, 2, 0);
            }
            if (this.y >= 660 &&  this.x > 900 *0.5) {
                getRandomWay = this.setPriorityRandomWay(0, 0, 0, 2);
            }
            
        }, 1000);

        setTimeout(() => {

            this.tricker.add ((_delta) => {
                // callback(delta);
                this.checkAndMove();
                this.go(getRandomWay)
            });
        }, 0);

        this.tricker.start();
        
    }

    // remove and destroy all timers, trickers and container
    destroyCont(){
        this.destroy();
        this.tricker.stop();
        this.tricker.destroy();
        clearTimeout(this.timerId);
        clearTimeout(this.intervalTimerId);

    }
    
}

function getRandomEnemy():string{
    let arrColor = ["enemy_blue", "enemy_red", "enemy_white"];
    let randomIndex = Math.floor(Math.random() * arrColor.length);
    let randomEnemy = arrColor[randomIndex];
    return randomEnemy;
}