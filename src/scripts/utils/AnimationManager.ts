import { LoadingView } from "../gui/loading/LoadingView";
import *as PIXI from 'pixi.js';

export class AnimationManager extends PIXI.AnimatedSprite {

    constructor(animName: string, place: PIXI.Point, done: () => void) {

        let getImgFrame: number;

        let spriteSheet = new Array();
        let getTexture = PIXI.BaseTexture.from(LoadingView.loader.resources[animName].url);

        spriteSheet.push();

        getImgFrame = getTexture.width / getTexture.height;

        for (let i = 0; i < getImgFrame; i++) {

            spriteSheet.push(
                new PIXI.Texture(getTexture, new PIXI.Rectangle(i * getTexture.height, 0, getTexture.height, getTexture.height)),
            )
        }

        super(spriteSheet);

        if (place != null) {
            this.y = place.y;
            this.x = place.x;
        }

        this.anchor.set(0.6, 0.5);
        this.animationSpeed = 0.2;
        this.loop = false;
        this.play();

        this.onComplete = function () {
            done();
        };
    }
}