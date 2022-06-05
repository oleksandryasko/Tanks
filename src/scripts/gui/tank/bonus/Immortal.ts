import *as PIXI from 'pixi.js';
import { LoadingView } from '../../loading/LoadingView';

export class Immortal extends PIXI.Sprite {
    
    constructor(){
        
        let imortal = "bonus_immortal";
        let texture4 = LoadingView.loader.resources[imortal].texture;
        super(texture4);
        this.alpha = 0;
        this.scale.set(0.4, 0.4);

    }
}