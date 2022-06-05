import { EventName } from './../../sys/events/EventName';
import { PlayBoard } from './../PlayBoard';
import *as PIXI from 'pixi.js';
import CollisionManager from '../../utils/CollisionManager';
import { ScreenSize } from '../../sys/enums/generalMainEnums';
import { LoadingView } from '../loading/LoadingView';
import { Sound } from '@pixi/sound';

export default class Bullet extends PIXI.Sprite {

    vx: number;  // bullet speed
    vy: number;  // bullet speed

    bulletDirection: string;

    getPlayers: Array<any>;
    getEnemies: Array<any>;

    topBoard:Array<any>;
    bottomBoard:Array<any>;

    bullet_ticker: PIXI.Ticker;

    _type:string;

    private gameOver: Event;

    constructor(type: string, bulletOptions: any) {
        
        let texture = LoadingView.loader.resources[type].texture;
        super(texture);
        this._type = type;

        this.bullet_ticker = new PIXI.Ticker;

        this.anchor.set(0.5);
        this.setDirection(bulletOptions.direction, bulletOptions.speed, bulletOptions.xPos, bulletOptions.yPos);
        this.bulletDirection = bulletOptions.direction;

        this.getPlayers = PlayBoard.getInstance().playerTanks;
        this.getEnemies = PlayBoard.getInstance().enemieTanks;

        this.topBoard = PlayBoard.getInstance().topArea;
        this.bottomBoard = PlayBoard.getInstance().bottomArea;

        this.gameOver = new Event(EventName.GAME_OVER);

        addEventListener(EventName.STOP_ANY_ACTIONS, ()=> {
            this.stopShoot();
            this.removeAllListeners();
        });
    }

    setDirection(direction: string, speed: number, xPos: number, yPos: number) {

        let shootIndex = 20; // the bullet starts from the barrel and not from middle of the tank

        switch (direction) {

            case 'up':
                this.y = yPos - shootIndex;
                this.x = xPos;
                this.shoot((delta) => {
                    this.y -= speed * delta;
                })
                break;

            case 'down':
                this.y = yPos + shootIndex;
                this.x = xPos;
                this.shoot((delta) => {
                    this.y += speed * delta;
                })
                break;

            case 'left':
                this.y = yPos;
                this.x = xPos - shootIndex;
                this.shoot((delta) => {
                    this.x -= speed * delta;
                })
                break;

            case 'right':
                this.y = yPos;
                this.x = xPos + shootIndex;
                this.shoot((delta) => {
                    this.x += speed * delta;
                })
                break;

            default:
                this.vy = -speed;
                break;
        }
    }

    // shoot bullet
    shoot(callback: (delta: number) => void) {

        this.bullet_ticker.add((delta) => {
            callback(delta);
            
            this.collisionBoard();
            this.collisionPlayer();
            this.collisionEnemies();
        });
        this.bullet_ticker.start();
    }

    // board collision
    collisionBoard() {
        if (this.y <= ScreenSize.canvasHeight * 0.5) {
            this.boardCollisionLogic(this.topBoard);
        }

        if (this.y > ScreenSize.canvasHeight * 0.5) {
            this.boardCollisionLogic(this.bottomBoard);
        }
    }

    // what to do if bullet hit to players
    collisionPlayer() {
        for (let player of this.getPlayers) {

            if (CollisionManager.rectsCollidingBoard(player, this)) {
                if (player.name == "player_tank") {
                    if (player.filter.enabled){
                        // come back to starting position
                        player.x = 468;
                        player.y = 612;
                        player.filter.enabled = false;
                    }else if (player.isImmortal){
                        player.sheild.alpha = 0
                        clearTimeout(player.immortalTimer);
                        player.isImmortal = false;
                    }else{

                        dispatchEvent(new CustomEvent(EventName.TANK_DONE, {
                            detail: {
                                xPos: this.x,
                                yPos: this.y,
                            },
                        }));
                        PlayBoard.getInstance().playSounds("hit");
                        
                        setTimeout(() => {
                            dispatchEvent(this.gameOver);
                        }, 1400);

                        PlayBoard.getInstance().gameOver();
                    }
                    this.stopShoot();

                }
            }
        }
    }

    // what to do if bullet hit to enemies
    collisionEnemies() {
        for (let enemy of this.getEnemies) {

            if (CollisionManager.rectsCollidingBoard(enemy, this)) {
                if (enemy.name == "enemy_tank" && this._type != "enemy_bullet") {
                    if (enemy.filter.enabled){
                        // come back to starting position
                        enemy.x = 468;
                        enemy.y = 312;
                        enemy.filter.enabled = false;
                    }else if (enemy.isImmortal){
                        enemy.sheild.alpha = 0
                        clearTimeout(enemy.immortalTimer);
                        enemy.isImmortal = false;
                    }else{
                        dispatchEvent(new CustomEvent(EventName.TANK_DONE, {
                            detail: {
                                xPos: this.x,
                                yPos: this.y,
                            },
                        }));
                        PlayBoard.getInstance().playSounds("hit");
                        enemy.destroyCont();
                        this.getEnemies.splice(this.getEnemies.indexOf(enemy), 1);

                        dispatchEvent(new CustomEvent(EventName.POINTS, {
                            detail: {
                                points: 100,
                            },
                        }));
                    }
                    this.stopShoot();
                }
            }
        }

        if(this.getEnemies.length == 0){
            dispatchEvent(new Event(EventName.STOP_ANY_ACTIONS));
            dispatchEvent(new Event(EventName.GAME_WIN));
            this.playSounds("win")
        }
    }

    playSounds(soundsName: string) {
        let getSound = LoadingView.loader.resources[soundsName];
        const sound = Sound.from(getSound);
        sound.play();
    }

    // sto any actions
    stopShoot() {

        this.x = 0;
        this.y = 0;
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.bullet_ticker.stop();
        this.bullet_ticker.remove(this.shoot);

    }

    // what to do if bullet hit to board
    boardCollisionLogic(boardArr:Array<any>){
        for (let board of boardArr) {

            if (CollisionManager.rectsCollidingBoard(board, this)) {
                PlayBoard.getInstance().playSounds("explode_music");

                if (board.name != "eagle") {
                    // send event to other classes with [x]/[y] position 
                    dispatchEvent(new CustomEvent(EventName.BOARD_DONE, {
                        detail: {
                            xPos: this.x,
                            yPos: this.y,
                        },
                    }));
                }

                if (board.name == "small_wall_1") {
                    board.destroy();
                    boardArr.splice(boardArr.indexOf(board), 1);

                }
                if (board.name == "eagle") {

                    dispatchEvent(new CustomEvent(EventName.EAGLE_DONE, {
                        detail: {
                            xPos: this.x,
                            yPos: this.y,
                        },
                    }));

                    dispatchEvent(this.gameOver);

                }
                this.stopShoot();
            }

        }
    }
}