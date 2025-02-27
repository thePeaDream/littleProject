import { _decorator, Component, Node,input,Input, RigidBody2D, Vec2, Collider2D, Contact2DType, IPhysics2DContact, Animation, AudioClip } from 'cc';
import { GameManager } from './GameManager';
import { Tags } from './Tags';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('Bird')
export class Bird extends Component 
{
    // ========= 属性 ==========
    @property
    rotateSpeed:number = 30;//1秒旋转30度
    private rgd2d:RigidBody2D = null; //刚体组件
    private _canControl:boolean = false; //是否允许控制
    @property(AudioClip)
    clickAudio:AudioClip = null;
    
    // ========== 生命周期函数 ========
    onLoad () 
    {
        //给当前节点Bird/this注册点击事件回调函数，发生点击后执行onTouchStart()
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        
        // 获取当前节点Bird/this的碰撞器组件
        let collider = this.getComponent(Collider2D);
        //如果存在碰撞器
        if (collider) 
        {
            //当前节点开始碰撞到目标时，调用回调函数onBeginContact
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            //当前节点结束碰撞目标时，调用回调函数onEndContact
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
        //初始化刚体组件
        this.rgd2d = this.getComponent(RigidBody2D);
    }

    update(deltaTime: number) 
    {
        //先判断能不能控制
        if(this._canControl == false) return;
        //计算出每帧旋转的角度    每秒旋转的度数 * (1帧)的秒数
        this.node.angle -= this.rotateSpeed*deltaTime;
        //向下倾斜的角度有限制
        if(this.node.angle < -60)
            this.node.angle = -60;
    }
    onDestroy () 
    {
        //注销对当前节点Bird/this的监听点击事件
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        // 获取当前节点Bird/this的碰撞器组件
        let collider = this.getComponent(Collider2D);
        //如果存在碰撞器
        if (collider) 
        {
            //当前节点开始碰撞到目标时，调用回调函数onBeginContact
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            //当前节点结束碰撞目标时，调用回调函数onEndContact
            collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    // ========== 碰撞检测相关 ===========
    public onTouchStart() {
        if(this._canControl == false) return;
        this.rgd2d.linearVelocity = new Vec2(0,10);
        this.node.angle = 30;
        AudioMgr.inst.playOneShot(this.clickAudio);
    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)
    {
        //console.log(otherCollider.tag);//打印碰撞物的tag 10代表地面 20代表管道 30代表管道之间的空隙
        if(otherCollider.tag === Tags.LAND || otherCollider.tag === Tags.PIPE)
        {
            GameManager.inst().transtionToGameOverState();
        }
    }
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)
    {
        if(otherCollider.tag === Tags.PIPE_MIDDLE)
        {
            GameManager.inst().addScore(1);
        }
    }
    
    // ============= 控制移动相关 =============
    public enableControl()
    {
        this._canControl = true;
        //让鸟受到重力影响,开启刚体组件
        this.rgd2d.enabled = true;
        //开启动画效果
        this.getComponent(Animation).enabled = true;
    }
    public disableControl()
    {
        this._canControl = false;
        //不能让鸟受到重力影响,禁用刚体组件
        this.rgd2d.enabled = false;
        //禁用动画效果
        this.getComponent(Animation).enabled = false;
    }

    public disableControlNotRGD()//不禁用刚体组件
    {
        this._canControl = false;
        //禁用动画效果
        this.getComponent(Animation).enabled = false;
    }
    
}


