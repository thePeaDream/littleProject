import { _decorator, Component, director, Label, Node} from 'cc';
import { GameData } from '../GameData';
const { ccclass, property } = _decorator;

@ccclass('GameOverUI')
export class GameOverUI extends Component 
{
    @property(Label)
    public curScoreLabel:Label = null;

    @property(Label)
    public bestScoreLabel:Label = null;

    @property(Node)
    newSprite:Node = null;

    @property([Node])
    medalArray:Node[] = [];

    public show(curScore:number,bestScore:number)
    {
        //显示当前分数
        this.node.active = true;
        //显示最高分数记录
        this.curScoreLabel.string = curScore.toString();
        this.bestScoreLabel.string = bestScore.toString();

        if(curScore > bestScore)
        {
            this.newSprite.active = true;
        }
        else
        {
            this.newSprite.active = false;
        }
        const index = curScore/10;
        let indexInt = Math.floor(index); 
        if(indexInt > 3){
            indexInt = 3;
        }
        this.medalArray[indexInt].active = true;
    }

    public onPlayButtonClick()
    {
        GameData.clearCurScore();
        director.loadScene(director.getScene().name);
    }
}


