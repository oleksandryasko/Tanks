import {EventEmitter} from 'events';


class Keyboard extends EventEmitter {

    private left:any;
    private up:any;
    private right:any;
    private down:any;
    private space:any;

    constructor(...args:any) {
        
        super(...args);
        this.left = Keyboard.keyboard(37);
        this.up = Keyboard.keyboard(38);
        this.right = Keyboard.keyboard(39);
        this.down = Keyboard.keyboard(40);
        this.space = Keyboard.keyboard(32);

        var self = this;

        this.left.press = function() {
            self.emit('left', {});
        };

        this.up.press = function() {
            self.emit('up', {});
        };

        this.right.press = function() {
            self.emit('right', {});
        };

        this.down.press = function() {
            self.emit('down', {});
        };

        this.space.press = function() {
            self.emit('space', {});
        };
    }

    static keyboard(keyCode:any) {
        let key: {[k: string]: any} = {};
        key.code = keyCode;
        key.isDown = false;
        key.isUp = true;
        key.press = undefined;
        key.release = undefined;
        //The `downHandler`
        key.downHandler = function(event:any) {
            if (event.keyCode === key.code) {
                if (key.isUp && key.press) key.press();
                    if (event.keyCode == 32){
                        key.isDown = true;
                        key.isUp = false;

                    }
            }
            event.preventDefault();
        };

        //The `upHandler`
        key.upHandler = function(event:any) {
            if (event.keyCode === key.code) {
                if (key.isDown && key.release) key.release();
                    if (event.keyCode == 32){
                        key.isDown = false;
                        key.isUp = true; // here
                    }

            }
            event.preventDefault();
        };

        //Attach event listeners
        window.addEventListener(
            "keydown", key.downHandler.bind(key), false
        );
        window.addEventListener(
            "keyup", key.upHandler.bind(key), false
        );
        return key;
    }

}

export default new Keyboard();