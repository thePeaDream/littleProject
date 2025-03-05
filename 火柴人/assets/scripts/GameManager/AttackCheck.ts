import { _decorator, Component, Node, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AttackCheck')
export class AttackCheck{
    static checkAttack(attacker: Node, target: Node, attackDistance: number,toward: number):boolean{
        if(attacker === null || target === null) return;
        // 获取攻击者的位置
        const attackerWorldPos:Vec2 = new Vec2(attacker.worldPosition.x, attacker.worldPosition.y);
        
        // 获取目标的位置
        const targetWorldPos:Vec2 = new Vec2(target.worldPosition.x, target.worldPosition.y);
        
        // 计算攻击者与目标的距离
        const distance = Vec2.distance(attackerWorldPos, targetWorldPos);

        // 判断是否命中
        if (distance > attackDistance) {
            return false;
        }
        // 判断目标是否在攻击者的前方
        if (toward === 1 && targetWorldPos.x < attackerWorldPos.x) {
            return false;
        } else if (toward === -1 && targetWorldPos.x > attackerWorldPos.x) {
            return false;
        }

        // 目标在攻击范围内且在前方
        console.log(`${attacker.name} 攻击命中 ${target.name}！`);
        return true;
    }
}


