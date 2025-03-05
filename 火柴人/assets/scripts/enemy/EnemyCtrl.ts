import { _decorator, Component, dragonBones, find, Node, RigidBody2D, Vec2, Vec3 } from 'cc';
import { State } from '../Player/PlayerCtrl';
const { ccclass, property } = _decorator;

// //状态
// enum EnemyState{
//     IDLE= "待机",
//     ATTACK1 = "普攻_01",
//     ATTACK2 = "普攻_02",
//     ATTACK3 = "普攻_03",
//     ATTACK4 = "普攻_04",
//     HIT = "受击_01",
//     RUN = "奔跑",
// }
@ccclass('EnemyCtrl')
export class EnemyCtrl extends Component 
{
    @property
    public hp = 10;
    @property
    public speed:number = 5; // 水平移动速度
    @property
    public testYSpeed:number = 10; //垂直跳跃的速度
    @property
    public attackDistance = 70;//攻击距离
    private armatureDisplay:dragonBones.ArmatureDisplay;//人物的龙骨动画组件
    private rigidBody:RigidBody2D;//人物的刚体组件

    private cur_speed_dir:number = 0;//当前水平速度方向
    private cur_toward = -1;//当前人物朝向 -1向左  1向右
    move_left:boolean = false;
    move_right:boolean = false;

    private cur_state:State = State.IDLE;
    private playerNode:Node;

    onLoad(){
        //初始化两个组件(龙骨动画组件和刚体组件)
        this.armatureDisplay = this.getComponent(dragonBones.ArmatureDisplay);
        this.rigidBody = this.getComponent(RigidBody2D)
        //监听龙骨动画组件的结束,只播放有限次的动画结束后，会自动调用该回调函数
        this.armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);
        //初始设置为闲置动画
        this.armatureDisplay.playAnimation(State.IDLE,0);
        this.playerNode = find(`Canvas/Hero`);//获取人物节点

        
    }
    onDestroy() {
        this.armatureDisplay.removeEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);
    }
    
    attack(){
        this.cur_speed_dir = 0;//攻击时速度设置为0
        this.set_armation(State.ATTACK1);
    }
    left_move(){
        this.cur_speed_dir = -1;//向左
        this.cur_toward = -1;
        //人物贴图是默认向左
        this.node.setScale(new Vec3(0.5,0.5,1));
        this.set_armation(State.RUN);
    }
    right_move(){
        this.cur_speed_dir = 1;//向右
        this.cur_toward = 1;
        this.node.setScale(new Vec3(-0.5,0.5,1));
        this.set_armation(State.RUN);
    }
    idle(){
        this.cur_speed_dir = 0;
        this.set_armation(State.IDLE);
    }
    //受伤
    wounded(){
        // 受击动画状态数组
        const hitStates: State[] = [State.HIT1, State.HIT2, State.HIT3];
        // 随机选择一个受击动画
        const randomHitState = hitStates[Math.floor(Math.random() * hitStates.length)];
        this.cur_speed_dir = 0;
        this.set_armation(randomHitState);
    }
    enemyAction(){
        let p_pos = this.playerNode.position;
        let e_pos = this.node.position;
        let dis = Vec3.distance(p_pos,e_pos);
        if(dis <= 70)
        {
            this.attack();
        }
        else if(dis <= 300)
        {
            let v:number = p_pos.x - e_pos.x;
            if(v > 0){
                //向右移动
                this.right_move();
            }
            else{
                //向左移动
                this.left_move();
            }
        }
        else
        {
            this.idle();
        }

        // if(this.move_left){
        //     this.left_move();
        // }
        // else if(this.move_right)
        // {
        //     this.right_move();
        // }
        // else{
        //     this.idle();
        // }
        //设置当前敌人的速度
        this.rigidBody.linearVelocity = new Vec2(this.cur_speed_dir*this.speed,this.rigidBody.linearVelocity.y);
    }
    update(dt: number) {

        //如果当前状态还在攻击，可以被打断
        // if(this.cur_state == State.ATTACK1 || this.cur_state == State.ATTACK2 ||  this.cur_state == State.ATTACK3 || this.cur_state == State.ATTACK4){
        //     return;
        // }
        if(this.cur_state == State.HIT1 ||this.cur_state == State.HIT2 ||this.cur_state == State.HIT3)
            return;
        this.enemyAction();      
    }

    //设置敌人的动画
    public set_armation(state:State){
        if(this.cur_state == state) return;
        this.cur_state = state;
        if(this.cur_state == State.ATTACK1 || this.cur_state == State.ATTACK2 ||  this.cur_state == State.ATTACK3 || this.cur_state == State.ATTACK4 || this.cur_state == State.HIT1 || this.cur_state == State.HIT2 || this.cur_state == State.HIT3)
        {
            console.log("播放敌人动画："+this.cur_state)
            this.armatureDisplay.playAnimation(state,1);
        }
        else
        {
            this.armatureDisplay.playAnimation(state,0);
        }
    }
    
    //有限次动画播放完成后自动调用该回调函数
    onComplete(event:dragonBones.EventObject){
        console.log("敌人"+event.animationState.name);
        this.set_armation(State.IDLE);
    }
}


