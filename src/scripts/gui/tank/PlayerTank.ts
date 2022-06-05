import Keyboard from "../../utils/Keyboard";
import { Tanks } from "./Tanks";

export class PlayerTank extends Tanks {

    type = "tank";

    constructor() {
        super("tank");

        this.rotationPosition = 'up';

        this.move();
    }

    move() {

        Keyboard.on('down', () => { this.go('down'); });
        Keyboard.on('up', () => { this.go('up'); });
        Keyboard.on('left', () => { this.go('left'); });
        Keyboard.on('right', () => { this.go('right'); });
        Keyboard.on('space', () => {
            if (this.isFire){
                this.fire();
            }
        });
    }
}