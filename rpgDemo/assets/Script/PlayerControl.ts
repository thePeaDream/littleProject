import { _decorator, Component, EventKeyboard, Input, input, KeyCode, Node, RigidBody, RigidBody2D, Vec2, Vec3 } from 'cc';
import { FixedUpdate } from './FixedUpdate';
const { ccclass, property } = _decorator;


@ccclass('PlayerControl')
export class PlayerControl extends Component 
{
    private _moveDirection:Vec3 = new Vec3(0,0,0);
    @property(Number)
    public moveSpeed:number = 800;
    private rb:RigidBody2D = null;
    //分别记录方向键的按下状态
    private isLeftPressed:boolean = false;
    private isRightPressed:boolean = false;
    private isUpPressed:boolean = false;
    private isDownPressed:boolean = false;

    onLoad() 
    {
        this.rb = this.getComponent(RigidBody2D);
        input.on(Input.EventType.KEY_DOWN,this.onKeyDown,this);
        input.on(Input.EventType.KEY_UP,this.onKeyUp,this);
    }
    start() {
        
    }
    protected onDestroy(): void {
        input.off(Input.EventType.KEY_DOWN,this.onKeyDown,this);
        input.off(Input.EventType.KEY_UP,this.onKeyUp,this);
    }
    update(dt: number) 
    {
        //确保在回调函数中 this 仍然指向当前类的实例。
        //保证每一帧都是固定的速度
        FixedUpdate.getInstance().update(dt,this.fixedUpdate.bind(this))
    }
    onKeyDown(event: EventKeyboard)
    {
        switch(event.keyCode){
            case KeyCode.ARROW_UP:
                this.isUpPressed = true

                break;
            case KeyCode.ARROW_DOWN:
                this.isDownPressed = true
  
                break;
            case KeyCode.ARROW_LEFT:
                this.isLeftPressed = true
       
                break;
            case KeyCode.ARROW_RIGHT:
                this.isRightPressed = true
    
                break;
        }
        this._moveDirection.x = (this.isLeftPressed?-1:0) +(this.isRightPressed?1:0);
        this._moveDirection.y = (this.isUpPressed?1:0) +(this.isDownPressed?-1:0);
    }
    onKeyUp(event: EventKeyboard)
    {
        switch(event.keyCode){
            case KeyCode.ARROW_UP:
                this.isUpPressed = false
                
                break;
            case KeyCode.ARROW_DOWN:
                this.isDownPressed = false
                
                break;
            case KeyCode.ARROW_LEFT:
                this.isLeftPressed = false
                break;
            case KeyCode.ARROW_RIGHT:
                this.isRightPressed = false
                break;
        }
        this._moveDirection.x = (this.isLeftPressed?-1:0) +(this.isRightPressed?1:0);
        this._moveDirection.y = (this.isUpPressed?1:0) +(this.isDownPressed?-1:0);
    }
    fixedUpdate(fixedDt:number)
    {
        let movement = new Vec2(this._moveDirection.x*this.moveSpeed*fixedDt,this._moveDirection.y*this.moveSpeed*fixedDt);
        //console.log("当前刚体运动的向量值："+movement.x+","+movement.y);
        this.rb.linearVelocity = movement;
    }
}


