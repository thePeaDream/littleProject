System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, _dec, _class, _class2, _crd, ccclass, property, FixedUpdate;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "499faAOaKBHF4oQxkCPmymU", "FixedUpdate", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("FixedUpdate", FixedUpdate = (_dec = ccclass('FixedUpdate'), _dec(_class = (_class2 = class FixedUpdate {
        //设定一个固定的更新时间，固定每0.02秒更新一次 锁定帧数
        constructor() {
          //单例模式
          this.nowTime = 0;
          this.fixedDeltaTime = 0.02;
        } //获取单例对象


        static getInstance() {
          if (!FixedUpdate._instance) {
            FixedUpdate._instance = new FixedUpdate();
          }

          return FixedUpdate._instance;
        }

        update(dt, fiexdUpdateCallback) {
          //更新时间
          this.nowTime += dt; //当前时间大于固定时间间隔时

          while (this.nowTime > this.fixedDeltaTime) {
            //调用传入的回调函数，固定时间间隔为参数
            fiexdUpdateCallback(this.fixedDeltaTime); //更新当前时间的计数

            this.nowTime -= this.fixedDeltaTime;
          }
        }

      }, _class2._instance = void 0, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=151d260b6f041d4da08c9348756b949170768ccf.js.map