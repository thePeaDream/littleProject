import { _decorator, Component, instantiate, math, Node, Prefab } from 'cc';
import { Pipe } from './Pipe';
const { ccclass, property } = _decorator;

//当游戏暂停、终止或ready时，管道停止生成，同时已经生成的管道停止移动
@ccclass('PipeSpawner')
export class PipeSpawner extends Component 
{
    // =========属性=========
    @property(Prefab)
    pipePrefab:Prefab = null;//要生成的预制体/管道
    @property
    spawnRate:number = 0.5;//生成速度
    private timer:number = 0.5;//计时器
    private _isSpawing:boolean = false;

    //=========生命周期函数======
    start() {}

    update(deltaTime: number) 
    {
        //不生成管道
        if(this._isSpawing == false) return;

        this.timer += deltaTime;
        if(this.timer >= this.spawnRate){
            this.timer = 0;
            const pipeInst = instantiate(this.pipePrefab);
            this.node.addChild(pipeInst);
            //先让生成的管道坐标和生成器位置保持一致
            const p = this.node.getWorldPosition();
            pipeInst.setWorldPosition(p);
            
            //随机设置高度
            const y = math.randomRangeInt(-314,186);
            const plocal = pipeInst.getPosition();
            //再设置预制体的本地坐标
            pipeInst.setPosition(plocal.x,y);
            
        }
    }

    //暂停管道生成和移动
    public pause()
    {
        this._isSpawing = false;
        const nodeArray = this.node.children;
        for(let i = 0; i < nodeArray.length;++i)
        {
            const pipe = nodeArray[i].getComponent(Pipe);
            if(pipe){
                pipe.enabled = false;
            }
        }
    }
    //管道继续生成和移动
    public play()
    {
        this._isSpawing = true;
    }
}


