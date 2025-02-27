import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tags')
export class Tags extends Component 
{
    //每个碰撞器都有1个tab标签属性:number，方便区分不同类型的碰撞器
    public static readonly LAND:number = 10;
    public static readonly PIPE:number = 20;
    public static readonly PIPE_MIDDLE:number = 30;
}


