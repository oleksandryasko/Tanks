export class EventName {
    
    static readonly LOADING_DONE = 'LOAD_DONE'; // event for loading view
    static readonly INTRO_DONE = 'INTRO_DONE';  // event for press btn in IntroView
    static readonly GAME_OVER = 'GAME_OVER';  //

    // custom event
    static readonly MOUSEOVER = 'MOUSEOVER';  
    static readonly MOUSEOUT = 'MOUSEOUT';  
    static readonly MOUSEDOWN = 'MOUSEDOWN';  
    static readonly CLICK = 'CLICK'; 
    static readonly KEYDOWN = 'KEYDOWN'; 
    
    // colizion events
    static readonly BOARD_DONE = 'BOARD_DONE';  
    static readonly EAGLE_DONE = 'EAGLE_DONE';  
    static readonly TANK_DONE = 'TANK_DONE';  

    static readonly STOP_ANY_ACTIONS = 'STOP_ANY_ACTIONS';  

    // hard mode evemt
    static readonly PLAYER_POSITION = 'PLAYER_POSITION';  
    static readonly HARD_MODE_SWITHER = 'HARD_MODE_SWITHER';  

    // points evemt
    static readonly POINTS = 'POINTS';  

    // win event
    static readonly GAME_WIN = 'GAME_WIN';  

}