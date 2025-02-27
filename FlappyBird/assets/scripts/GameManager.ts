import { _decorator, AudioClip, Component, Label, Node } from 'cc';
import { Bird } from './Bird';
import {MoveBg} from './MoveBg'
import { PipeSpawner } from './PipeSpawner';
import { GameReadyUI } from './UI/GameReadyUI';
import { GameData } from './GameData';
import { GameOverUI } from './UI/GameOverUI';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

//游戏状态
enum GameState{
    Ready,
    Gaming,
    GameOver
}
//管理游戏全局数据
//例如：背景移动速度、游戏当前状态、管理每个游戏节点的暂停和开始、开始界面UI的隐藏和显示等
@ccclass('GameManager')
export class GameManager extends Component 
{
    //======== 属性 =========
    private static _inst:GameManager = null; //静态GameManager对象，其他脚本可以通过GameManager.inst()获取
    public static inst(){ return this._inst;}
    @property
    moveSpeed:number = 100;//背景移动速度
    curGS:GameState = GameState.Ready;//游戏状态
    @property(Bird)
    bird:Bird = null;//小鸟的控制
    @property(MoveBg)
    bgMoving:MoveBg = null;//背景的移动
    @property(MoveBg)
    landMoving:MoveBg = null;//地面的移动
    @property(PipeSpawner)
    pipeSpawning:PipeSpawner =null;//管道的移动和生成
    @property(GameReadyUI)
    gameReadyUI:GameReadyUI = null;//开始界面UI
    @property(Node)
    gamingUI:Node = null;//游戏过程中对GamingUI的引用
    @property(Label)
    scoreLabel:Label = null;//管理分数
    @property(GameOverUI)
    gameOverUI:GameOverUI = null;//结束UI
    @property(AudioClip)
    bgAudio:AudioClip = null;
    @property(AudioClip)
    gameOverAudio:AudioClip = null;

    
    //========= 生命周期相关 =======
    onLoad() 
    {
        GameManager._inst = this;
    }
    protected start()
    {
        //刚开始将游戏状态设为 准备
        this.transitionToReadyState();
        AudioMgr.inst.play(this.bgAudio);
    }

    //========== 游戏状态相关 ========
    public transitionToReadyState()
    {
        this.curGS = GameState.Ready;
        this.bird.disableControl();
        this.bgMoving.disabledMoving();
        this.landMoving.disabledMoving();
        this.pipeSpawning.pause();
        this.gamingUI.active = false;
        this.gameOverUI.node.active = false;
        this.gameReadyUI.node.active = true;
    }
    public transitionToGamingState()
    {
        this.curGS = GameState.Gaming;
        this.gameReadyUI.node.active = false; 
        this.gamingUI.active = true;
        this.gameOverUI.node.active = false;
        this.bird.enableControl();
        this.bgMoving.enabledMoving();
        this.landMoving.enabledMoving();
        this.pipeSpawning.play();
    }
    public transtionToGameOverState()
    {
        if(this.curGS == GameState.GameOver) return;
        this.curGS = GameState.GameOver;
        this.gameReadyUI.node.active = false; 
        this.bird.disableControlNotRGD();
        this.bgMoving.disabledMoving();
        this.landMoving.disabledMoving();
        this.pipeSpawning.pause();
        this.gamingUI.active = false;
        this.gameOverUI.node.active = true;
        this.gameOverUI.show(GameData.getScore(),GameData.getBestScore());
        GameData.saveScore();
        AudioMgr.inst.stop();//停止背景音乐播放
        AudioMgr.inst.playOneShot(this.gameOverAudio);
    }

    public addScore(count:number = 1)
    {
        GameData.addScore(count);
        //修改显示的分数
        this.scoreLabel.string = GameData.getScore().toString();
    }
}


