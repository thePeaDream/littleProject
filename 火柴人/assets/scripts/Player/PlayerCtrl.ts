import { _decorator, Component, dragonBones, Enum, EventKeyboard, EventMouse, EventTouch, input, Input, KeyCode, Node, RigidBody2D, Vec2, Vec3 } from 'cc';
import { AttackCheck } from '../GameManager/AttackCheck';
import { EnemyCtrl } from '../enemy/EnemyCtrl';
const { ccclass, property } = _decorator;

//方向
enum Dirc{
    LEFT,
    RIGHT
};
//状态
export enum State{
    IDLE= "待机",
    ATTACK1 = "普攻_01",
    ATTACK2 = "普攻_02",
    ATTACK3 = "普攻_03",
    ATTACK4 = "普攻_04",
    HIT1 = "受击_01",
    HIT2 = "受击_02",
    HIT3 = "受击_03",
    RUN = "奔跑",
}

@ccclass('PlayerCtrl')
export class PlayerCtrl extends Component {
    @property
    public hp = 5;
    @property(Node)
    public enemy:Node;
    @property
    public speed:number = 10; // 水平移动速度
    @property
    public testYSpeed:number = 10; //垂直跳跃的速度
    @property
    public attackDistance = 70;//攻击距离

    private armatureDisplay:dragonBones.ArmatureDisplay;//人物的龙骨动画组件
    private rigidBody:RigidBody2D;//人物的刚体组件

    //用map记录下用户的输入 
    //若用户按下a,则input['a'] = true;
    private user_input:Map<number,boolean> = new Map<number,boolean>();//用户的输入
    private cur_speed_dir:number = 0;//当前水平速度方向
    private cur_toward = -1;//当前人物朝向 -1向左  1向右
    private cur_state:State =State.IDLE;//人物当前状态
    
    private combo:number = 0;//人物当前的连击计数  
    private lastAttackTime:number = 0;//记录最后一次普攻时间

    onLoad() {
        //注册
        //鼠标点击事件
        //input.on(Input.EventType.MOUSE_DOWN,this.onMouseDown,this);
        //键盘点击事件
        input.on(Input.EventType.KEY_DOWN,this.onKeyDown,this);
        input.on(Input.EventType.KEY_UP,this.onKeyUp,this);

        //初始化两个组件(龙骨动画组件和刚体组件)
        this.armatureDisplay = this.getComponent(dragonBones.ArmatureDisplay);
        this.rigidBody = this.getComponent(RigidBody2D)

        //监听龙骨动画组件的结束,只播放有限次的动画结束后，会自动调用该回调函数
        this.armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);

        //初始设置为闲置动画
        this.armatureDisplay.playAnimation(State.IDLE,0);
    }
    onDestroy() {
        //鼠标点击事件
        //input.off(Input.EventType.MOUSE_DOWN,this.onMouseDown,this);
        //键盘点击事件
        input.off(Input.EventType.KEY_DOWN,this.onKeyDown,this);
        input.off(Input.EventType.KEY_UP,this.onKeyUp,this);
        this.armatureDisplay.removeEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);
    }

    attack()
    {
        //攻击时让人物当前x轴速度清0
        this.cur_speed_dir = 0
        //连击判断  
        if(this.combo === 0)
            this.set_armation(State.ATTACK1);
        else if(this.combo === 1)
            this.set_armation(State.ATTACK2);
        else if(this.combo === 2)
            this.set_armation(State.ATTACK3);
        else if(this.combo === 3)
            this.set_armation(State.ATTACK4);
        this.combo = (this.combo+1) % 4;
        //更新最后一次普攻时间
        this.lastAttackTime = Date.now();
        
        //攻击完成后，进行攻击判定
        let flag:boolean = AttackCheck.checkAttack(this.node,this.enemy,this.attackDistance,this.cur_toward);
        if(flag === true)
        {  
            let enemyCtrl = this.enemy.getComponent(EnemyCtrl);
            // 让敌人面向角色
            const playerWorldPos = new Vec2(this.node.worldPosition.x, this.node.worldPosition.y);
            const enemyWorldPos = new Vec2(this.enemy.worldPosition.x, this.enemy.worldPosition.y);
            // 判断角色在敌人的左侧还是右侧
            if (playerWorldPos.x > enemyWorldPos.x) {
            // 角色在右侧，敌人朝右
                this.enemy.setScale(-0.5, this.enemy.scale.y, 1);
            } else {
            // 角色在左侧，敌人朝左
                this.enemy.setScale(0.5, this.enemy.scale.y, 1);
            }
            enemyCtrl.wounded();
        }
        //扣除敌人血条(如果为0，就删除该敌人节点)
    }

    left_move()
    {
        this.cur_speed_dir = -1;//向左
        this.cur_toward = -1;
        //人物贴图是默认向左
        this.node.setScale(new Vec3(0.5,0.5,1));
        this.set_armation(State.RUN);
    }

    right_move()
    {
        this.cur_speed_dir = 1;//向右
        this.cur_toward = 1;
        this.node.setScale(new Vec3(-0.5,0.5,1));
        this.set_armation(State.RUN);
    }

    idle()
    {
        this.cur_speed_dir = 0;
        this.set_armation(State.IDLE);
    }
    

    update(dt: number) {
        let state = this.cur_state;

        //如果当前状态还在攻击，必须等攻击动画完成才能继续播放其他动画
        if(this.cur_state == State.ATTACK1 || this.cur_state == State.ATTACK2 ||  this.cur_state == State.ATTACK3 || this.cur_state == State.ATTACK4){
            return;
        }
        //超过2秒没有普攻，重置连击数
        if(Date.now() - this.lastAttackTime > 2000)
        {
            this.combo = 0;
        }

        //根据当前用户按下的键，设置人物的状态
        if(this.user_input.get(KeyCode.KEY_J))//攻击
            this.attack();       
        else if(this.user_input.get(KeyCode.KEY_A))//左移
            this.left_move();
        else if(this.user_input.get(KeyCode.KEY_D))//右移
            this.right_move();
        else
            this.idle();

        //设置当前人物的速度
        this.rigidBody.linearVelocity = new Vec2(this.cur_speed_dir*this.speed,this.rigidBody.linearVelocity.y);
    }

    onMouseDown(event:EventMouse)
    {
    }

    onKeyDown(event:EventKeyboard)
    {
        this.user_input.set(event.keyCode, true);
    }

    onKeyUp(event:EventKeyboard)
    {
        this.user_input.set(event.keyCode, false);
    }

    //根据当前状态设置动画，状态每一帧都可能改变
    set_armation(state:State){
        if(this.cur_state == state) return;
        this.cur_state = state;
        if(this.cur_state == State.ATTACK1 || this.cur_state == State.ATTACK2 ||  this.cur_state == State.ATTACK3 || this.cur_state == State.ATTACK4)
        {
            this.armatureDisplay.playAnimation(state,1);
        }
        else
        {
            this.armatureDisplay.playAnimation(state,0);
        }
    }
    //有限次动画播放完成后自动调用该回调函数
    onComplete(event:dragonBones.EventObject){
        console.log("动画名称是"+event.animationState.name);
        this.set_armation(State.IDLE);
    }







    // //闲置状态
    // //设置待机动画，并让刚体组件速度清0
    // idle()
    // {
    //     // this.armatureDisplay.playAnimation("待机",0);//循环播放闲置动画
    //     // this.rigidBody.linearVelocity = new Vec2(0,0);//停止移动
    // }

    // //跳跃状态
    // //设置跳跃动画，并给刚体一个向上的速度
    // jump()
    // {
    //     // //播放跳跃动画
    //     // //监听动画完成事件
    //     // this.armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this.onJumpComplete, this);
    //     // this.armatureDisplay.playAnimation("空翻跳跃",1);
        
    //     // //给刚体一个向上加速度
    //     // this.rigidBody.linearVelocity = new Vec2(this.rigidBody.linearVelocity.x,this.testYSpeed);
    // }

    // //跳跃完成后切换回闲置状态
    // onJumpComplete()
    // {
    //     // // 取消监听动画完成事件
    //     // this.armatureDisplay.removeEventListener(dragonBones.EventObject.COMPLETE, this.onJumpComplete, this);
    //     // //切换回闲置状态
    //     // this.idle();
    // }

    // //攻击完成后切换回闲置状态
    // onAttackComplete()
    // {
    //     // this.armatureDisplay = this.getComponent(dragonBones.ArmatureDisplay);
    //     // // 取消监听动画完成事件
    //     // this.armatureDisplay.removeEventListener(dragonBones.EventObject.COMPLETE, this.onAttackComplete, this);
    //     // this.armatureDisplay.timeScale = 1;//恢复动画默认速度
    //     // //切换回闲置状态
    //     // this.idle();
    // }
    
}


