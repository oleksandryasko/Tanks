import { PlayBoard } from './../gui/PlayBoard';
import { Point } from "pixi.js";
import { AnimationManager } from "./AnimationManager";

class CollisionManager {

    private positionManager: Point;

    rectsColliding(boards: any, gameObjects: any, collisionSide: string) {

        let collisionX: number;
        let collisionY: number;

        let boardBounds = boards.getBounds();
        let gameObjectBounds = gameObjects.getBounds();

        if (boardBounds.x + boardBounds.width > gameObjectBounds.x &&
            boardBounds.x < gameObjectBounds.x + gameObjectBounds.width &&
            boardBounds.y + boardBounds.height > gameObjectBounds.y &&
            boardBounds.y < gameObjectBounds.y + gameObjectBounds.height) {
            if (collisionSide == "left") {
                collisionX = gameObjects.x + gameObjects.vx;
                gameObjects.x = collisionX;

            }
            if (collisionSide == "right") {
                collisionX = gameObjects.x - gameObjects.vx;
                gameObjects.x = collisionX;

            }
            if (collisionSide == "up") {
                collisionY = gameObjects.y + gameObjects.vy;
                gameObjects.y = collisionY;

            }
            if (collisionSide == "down") {
                collisionY = gameObjects.y - gameObjects.vy;
                gameObjects.y = collisionY;

            }
        }
    }

    // set array with correct way including weight of the way
    setRandom(weight:Array<EnemyConfig>):string{

        let arrWays = [];
        
        for (let i = 0; i < weight.length; i++){
            for (let k = 0; k < weight[i].weight; k++){
                arrWays.push(weight[i].way);
            }
        }

        let randomIndex = Math.floor(Math.random() * arrWays.length);
        let randomEnemy = arrWays[randomIndex];

        return randomEnemy;
    }
    
    rectsCollidingBoard(boards: any, gameObjects: any):boolean {

        let boardBounds = boards.getBounds();
        let gameObjectBounds = gameObjects.getBounds();

        if (boardBounds.x + boardBounds.width > gameObjectBounds.x &&
            boardBounds.x < gameObjectBounds.x + gameObjectBounds.width &&
            boardBounds.y + boardBounds.height > gameObjectBounds.y &&
            boardBounds.y < gameObjectBounds.y + gameObjectBounds.height) {
            
            return true
        }
        return false
    }

    // playe bomb animation 
    isCollisionAnimation(container:PlayBoard, animName: string, xPso: number, yPos: number ):void {
        this.positionManager = new Point(xPso, yPos);

        let animation = new AnimationManager(animName, this.positionManager, () => {
            animation.destroy();
        });

        container.addChild(animation);
    }
}

type EnemyConfig = {
    way: string;
    weight: number;
};

export default new CollisionManager();