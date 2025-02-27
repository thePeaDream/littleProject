import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;


export class GameData
{
    private static readonly BESTSCORE:string = "BestScore";
    private static _score:number = 0;
    public static addScore(count:number=1)
    {
        this._score += count;
    }
    public static getScore():number
    {
        return this._score;
    }
    public static getBestScore():number
    {
        let score = localStorage.getItem(this.BESTSCORE);
        if(score){
            return parseInt(score);
        }
        else{
            return 0;
        }
    }
    public static saveScore():void
    {
        let curScore = this.getScore();
        let bestScore = this.getBestScore();
        if(curScore > bestScore)
            localStorage.setItem(this.BESTSCORE,curScore.toString());
    }
    public static clearCurScore():void
    {
        this._score = 0;
    }
}


