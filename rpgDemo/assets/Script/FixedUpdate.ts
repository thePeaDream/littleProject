import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FixedUpdate')
export class FixedUpdate
{
    private static _instance:FixedUpdate;//单例模式
    private nowTime:number = 0;
    private fixedDeltaTime:number=0.02;//设定一个固定的更新时间，固定每0.02秒更新一次 锁定帧数
    private constructor(){}
    //获取单例对象
    public static getInstance():FixedUpdate{
        if(!FixedUpdate._instance){
            FixedUpdate._instance = new FixedUpdate();
        }
        return FixedUpdate._instance;
    }
    public update(dt:number,fiexdUpdateCallback:(delta:number)=>void)
    {
        //更新时间
        this.nowTime += dt;
        //当前时间大于固定时间间隔时
        while(this.nowTime > this.fixedDeltaTime)
        {
            //调用传入的回调函数，固定时间间隔为参数
            fiexdUpdateCallback(this.fixedDeltaTime);
            //更新当前时间的计数
            this.nowTime -= this.fixedDeltaTime;
        }
    }
}


