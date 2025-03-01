System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, _dec, _class, _crd, ccclass, property, CustomRenderingOrder;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "36eeefp+uBKhopTpRz5hTRA", "CustomRenderingOrder", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CustomRenderingOrder", CustomRenderingOrder = (_dec = ccclass('CustomRenderingOrder'), _dec(_class = class CustomRenderingOrder extends Component {
        start() {}

        update(dt) {
          let EnvNodes = this.node.children; //按照y轴从大到小排序,Y值越低,显示越靠前

          EnvNodes.sort((a, b) => b.position.y - a.position.y); //更新渲染顺序

          EnvNodes.forEach((EnvNode, index) => {
            if (EnvNode) {
              EnvNode.setSiblingIndex(index);
            }
          });
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2013e2e690a94ead2f3b6432e7d04c6eec46889e.js.map