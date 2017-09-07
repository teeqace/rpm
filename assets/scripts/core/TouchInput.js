import Mochi from 'Mochi'
import Target from './Weapon/Target'

cc.Class({
  extends: cc.Component,

  properties: {
    mochi: Mochi,
    target: Target,
    cursor: cc.Node
  },

  _onTouchBegan(event) {
    let location = event.getLocation()
    // cc.log('_onTouchBegan')
    // cc.log(location)
    this._mochiMove(location)

    this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this)
    this._touched = true
    this.target.isDisp = true
  },

  _finishTouch(event) {
    if (!this._touched) {
      return
    }
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this)
    this._touched = false

    let location = event.getLocation()
    this.cursor.position = new cc.Vec2(1000, 1000)
    this.target.isDisp = false
    // cc.log(location)
    // cc.log('_finishTouch')

  },

  _onTouchEnded(event) {
    this._finishTouch(event)
    // cc.log('_onTouchEnded')
  },

  _onTouchCancel(event) {
    this._finishTouch(event)
    // cc.log('_onTouchCancel')
  },

  _onTouchMove(event) {
    let location = event.getLocation()
    this._mochiMove(location)
    // cc.log(location)
  },

  // use this for initialization
  onLoad() {
    this._touched = false
    this._registerEvent()
  },

  onDestroy() {
    this._unregisterEvent()
  },

  _registerEvent() {
    this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this)
    this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this)
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this)
  },

  _unregisterEvent() {
    this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this)
    this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this)
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this)
  },

  _mochiMove(location) {
    let canvasLocation = this.node.parent.convertToNodeSpaceAR(location)
    // cc.log(canvasLocation)
    this.cursor.position = canvasLocation
    // this.mochi.setTarget(canvasLocation.x)
  }

})