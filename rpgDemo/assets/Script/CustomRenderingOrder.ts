import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CustomRenderingOrder')
export class CustomRenderingOrder extends Component {
    start() {

    }

    update(dt: number) {
        let EnvNodes = this.node.children;
        //按照y轴从大到小排序,Y值越低,显示越靠前
        EnvNodes.sort((a,b)=>b.position.y-a.position.y);
   
        //更新渲染顺序
        EnvNodes.forEach((EnvNode, index)=>{
            if(EnvNode){
                EnvNode.setSiblingIndex(index);
            }
        })
    }
}


