import { _decorator, Component, dragonBones, Enum, EventKeyboard, EventMouse, EventTouch, input, Input, KeyCode, Node, RigidBody2D, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

enum Dirc{
    LEFT,
    RIGHT
};
@ccclass('PlayerCtrl')
export class PlayerCtrl extends Component {
    @property
    public speed:number = 10; // 水平移动速度
    @property
    public testYSpeed:number = 10; //垂直跳跃的速度

    private armatureDisplay:dragonBones.ArmatureDisplay;//人物的龙骨动画组件
    private rigidBody:RigidBody2D;//人物的刚体组件

    
    onLoad() {
        //注册
        //鼠标点击事件
        input.on(Input.EventType.MOUSE_DOWN,this.onMouseDown,this);
        //键盘点击事件
        input.on(Input.EventType.KEY_DOWN,this.onKeyDown,this);
        input.on(Input.EventType.KEY_UP,this.onKeyUp,this);

    }
    onDestroy() {
        //鼠标点击事件
        input.off(Input.EventType.MOUSE_DOWN,this.onMouseDown,this);
        //键盘点击事件
        input.off(Input.EventType.KEY_DOWN,this.onKeyDown,this);
        input.off(Input.EventType.KEY_UP,this.onKeyUp,this);
    }
    start(){
        //一开始让角色处于闲置动画
        //先获取当前节点里的龙骨动画组件
        this.armatureDisplay = this.getComponent(dragonBones.ArmatureDisplay);
        this.armatureDisplay.playAnimation("待机",0);
        this.rigidBody = this.getComponent(RigidBody2D)
    }
    update(deltaTime: number) {
        
    }

    onMouseDown(event:EventMouse)
    {
        this.attack();
    }

    onKeyDown(event:EventKeyboard)
    {
        switch(event.keyCode){
            case KeyCode.KEY_A:
                this.move(Dirc.LEFT);
            break;
            case KeyCode.KEY_D:
                this.move(Dirc.RIGHT);
            break;
            case KeyCode.SPACE:
                this.jump();
            break;
        }
    }

    onKeyUp(event:EventKeyboard)
    {
        switch(event.keyCode){
            case KeyCode.KEY_A:
                this.idle();
            break;
            case KeyCode.KEY_D:
                this.idle();
            break;
        }
    }

    //攻击状态
    //设置攻击动画
    attack()
    {
        //播放攻击动画
        // 监听动画完成事件
        this.armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this.onAttackComplete, this);
        this.armatureDisplay.timeScale = 2;//设置播放速度为原来得2倍
        this.armatureDisplay.playAnimation(`普攻_03`,1);
    }

    //移动状态
    //设置移动动画,并给刚体一个水平方向的速度
    move(dirc:Dirc)
    {
        //设置移动动画
        if(dirc === Dirc.LEFT){
            //人物默认贴图就是向左
            this.node.setScale(new Vec3(0.5,0.5,1));
        }
        else if(dirc === Dirc.RIGHT){
            //翻转角色,向右
            this.node.setScale(new Vec3(-0.5,0.5,1));
        }
        this.armatureDisplay.playAnimation("奔跑",0);//循环播放跑步动画

        //设置移动速度
        //给刚体组件一个水平速度
        // 获取当前速度
        // this.rigidBody.linearVelocity;
        if(dirc === Dirc.LEFT){
            this.rigidBody.linearVelocity = new Vec2(-this.speed,this.rigidBody.linearVelocity.y);
        }else if(dirc === Dirc.RIGHT){
            this.rigidBody.linearVelocity = new Vec2(this.speed,this.rigidBody.linearVelocity.y);
        }

    }

    //闲置状态
    //设置待机动画，并让刚体组件速度清0
    idle()
    {
        this.armatureDisplay.playAnimation("待机",0);//循环播放闲置动画
        this.rigidBody.linearVelocity = new Vec2(0,0);//停止移动
    }

    //跳跃状态
    //设置跳跃动画，并给刚体一个向上的速度
    jump()
    {
        //播放跳跃动画
        //监听动画完成事件
        this.armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this.onJumpComplete, this);
        this.armatureDisplay.playAnimation("空翻跳跃",1);
        
        //给刚体一个向上加速度
        this.rigidBody.linearVelocity = new Vec2(this.rigidBody.linearVelocity.x,this.testYSpeed);
    }

    //跳跃完成后切换回闲置状态
    onJumpComplete()
    {
        // 取消监听动画完成事件
        this.armatureDisplay.removeEventListener(dragonBones.EventObject.COMPLETE, this.onJumpComplete, this);
        //切换回闲置状态
        this.idle();
    }

    //攻击完成后切换回闲置状态
    onAttackComplete()
    {
        this.armatureDisplay = this.getComponent(dragonBones.ArmatureDisplay);
        // 取消监听动画完成事件
        this.armatureDisplay.removeEventListener(dragonBones.EventObject.COMPLETE, this.onAttackComplete, this);
        this.armatureDisplay.timeScale = 1;//恢复动画默认速度
        //切换回闲置状态
        this.idle();
    }
    
}


