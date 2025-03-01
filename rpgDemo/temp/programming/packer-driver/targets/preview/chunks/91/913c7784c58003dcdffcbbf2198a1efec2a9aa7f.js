System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Input, input, KeyCode, RigidBody2D, Vec2, Vec3, FixedUpdate, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, PlayerControl;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfFixedUpdate(extras) {
    _reporterNs.report("FixedUpdate", "./FixedUpdate", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Input = _cc.Input;
      input = _cc.input;
      KeyCode = _cc.KeyCode;
      RigidBody2D = _cc.RigidBody2D;
      Vec2 = _cc.Vec2;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      FixedUpdate = _unresolved_2.FixedUpdate;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ad4d3EF+b1NUqyr0fIpLH9t", "PlayerControl", undefined);

      __checkObsolete__(['_decorator', 'Component', 'EventKeyboard', 'Input', 'input', 'KeyCode', 'Node', 'RigidBody', 'RigidBody2D', 'Vec2', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PlayerControl", PlayerControl = (_dec = ccclass('PlayerControl'), _dec2 = property(Number), _dec(_class = (_class2 = class PlayerControl extends Component {
        constructor() {
          super(...arguments);
          this._moveDirection = new Vec3(0, 0, 0);

          _initializerDefineProperty(this, "moveSpeed", _descriptor, this);

          this.rb = null;
          //分别记录方向键的按下状态
          this.isLeftPressed = false;
          this.isRightPressed = false;
          this.isUpPressed = false;
          this.isDownPressed = false;
        }

        onLoad() {
          this.rb = this.getComponent(RigidBody2D);
          input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
          input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        }

        start() {}

        onDestroy() {
          input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
          input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        }

        update(dt) {
          //确保在回调函数中 this 仍然指向当前类的实例。
          //保证每一帧都是固定的速度
          (_crd && FixedUpdate === void 0 ? (_reportPossibleCrUseOfFixedUpdate({
            error: Error()
          }), FixedUpdate) : FixedUpdate).getInstance().update(dt, this.fixedUpdate.bind(this));
        }

        onKeyDown(event) {
          switch (event.keyCode) {
            case KeyCode.ARROW_UP:
              this.isUpPressed = true;
              break;

            case KeyCode.ARROW_DOWN:
              this.isDownPressed = true;
              break;

            case KeyCode.ARROW_LEFT:
              this.isLeftPressed = true;
              break;

            case KeyCode.ARROW_RIGHT:
              this.isRightPressed = true;
              break;
          }

          this._moveDirection.x = (this.isLeftPressed ? -1 : 0) + (this.isRightPressed ? 1 : 0);
          this._moveDirection.y = (this.isUpPressed ? 1 : 0) + (this.isDownPressed ? -1 : 0);
        }

        onKeyUp(event) {
          switch (event.keyCode) {
            case KeyCode.ARROW_UP:
              this.isUpPressed = false;
              break;

            case KeyCode.ARROW_DOWN:
              this.isDownPressed = false;
              break;

            case KeyCode.ARROW_LEFT:
              this.isLeftPressed = false;
              break;

            case KeyCode.ARROW_RIGHT:
              this.isRightPressed = false;
              break;
          }

          this._moveDirection.x = (this.isLeftPressed ? -1 : 0) + (this.isRightPressed ? 1 : 0);
          this._moveDirection.y = (this.isUpPressed ? 1 : 0) + (this.isDownPressed ? -1 : 0);
        }

        fixedUpdate(fixedDt) {
          var movement = new Vec2(this._moveDirection.x * this.moveSpeed * fixedDt, this._moveDirection.y * this.moveSpeed * fixedDt); //console.log("当前刚体运动的向量值："+movement.x+","+movement.y);

          this.rb.linearVelocity = movement;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 800;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=913c7784c58003dcdffcbbf2198a1efec2a9aa7f.js.map