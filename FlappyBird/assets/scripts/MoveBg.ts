import { _decorator, Component, Node } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('MoveBg')
export class MoveBg extends Component 
{
    //====== 属性 ========
    @property(Node)
    target1ToMove:Node = null;//要移动的目标节点1
    @property(Node)
    target2ToMove:Node = null;//要移动的目标节点2
    private moveSpeed:number = 100;//移动速度 每秒移动100像素
    private _canMoving:boolean = false; //是否可以移动
    
    //======= 生命周期 =======
    start() 
    {
        this.moveSpeed = GameManager.inst().moveSpeed;
    }
    update(deltaTime: number) 
    {
        if(this._canMoving == false)
            return;
        //要移动的距离
        const moveDistance = this.moveSpeed*deltaTime;

        let p1 = this.target1ToMove.getPosition();
        this.target1ToMove.setPosition(p1.x - moveDistance,p1.y);

        let p2 = this.target2ToMove.getPosition();
        this.target2ToMove.setPosition(p2.x - moveDistance,p2.y);

        if(p1.x < -730)//一旦超出屏幕外，就要把bg01放在bg02的右边
        {
            //2号背景的x坐标+728
            p2 = this.target2ToMove.getPosition();
            this.target1ToMove.setPosition(p2.x + 728,p2.y);
        }

        if(p2.x < -730)//一旦超出屏幕外，就要把bg02放在bg01的右边
        {
            //2号背景的x坐标+728
            p1 = this.target1ToMove.getPosition();
            this.target2ToMove.setPosition(p1.x + 728,p1.y);
        }
    }

    //====== 是否开启移动 ======
    public enabledMoving()
    {
        this._canMoving = true;
    }
    public disabledMoving()
    {
        this._canMoving = false;
    }
}


