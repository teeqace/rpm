import {
  messagePipeline
} from 'MessagePipeline'
import EBStraight from '../EnemyBehaviors/EBStraight'
import EBRotate from '../EnemyBehaviors/EBRotate'
import EBClockRotate from '../EnemyBehaviors/EBClockRotate'

cc.Class({
  extends: cc.Component,

  properties: {
    ebStraight: EBStraight,
    ebRotate: EBRotate,
    ebClockRotate: EBClockRotate
    // mochiNode: cc.Node
  },

  // use this for initialization
  onLoad: function () {
    this.anim = this.node.getComponent(cc.Animation)
    this.anim.on('finished', this.animFinished, this)

    // this.cursorNode = null

    // this.isWhite = false
    // this.absorping = false
    // this.disappearing = false
    // this.absorpLengthRate = 1.0

    // this.animWhiten = false

    // this.isEaten = false

    // this.animName = ''

    // // this.speedBase = 100
    // this.speed = 100

    // this.ebType = ''
  },


  reuse(data) {
    this.ebType = data.ebType

    if (this.ebType === 'ebStraight') {
      this.ebStraight.init(data)
    } else if (this.ebType === 'ebRotate') {
      this.ebRotate.init(data)
    } else if (this.ebType === 'ebClockRotate') {
      this.ebClockRotate.init(data)
    }
    this.isWhite = false
    this.animName = ''
    this.speed = data.speed
    this.node.color = cc.hexToColor('#1E1E1E')
    this.node.setScale(1);
    this.isEaten = false
  },

  update(dt) {
    if (this.ebType === 'ebStraight') {
      this.ebStraight.ebUpdate(dt)
    } else if (this.ebType === 'ebRotate') {
      this.ebRotate.ebUpdate(dt)
    } else if (this.ebType === 'ebClockRotate') {
      this.ebClockRotate.ebUpdate(dt)
    }
  },

  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {
  //   // if (!this.isWhite) {
  //   let from = this.node.getPosition()
  //   let to = this.mochiNode.getPosition()
  //   let distance = cc.pDistance(to, from)
  //   let radAngle = cc.pToAngle(cc.pSub(to, from))
  //   let degAngle = -cc.radiansToDegrees(radAngle)

  //   let toRad = degAngle * Math.PI / 180

  //   this.node.y -= Math.sin(toRad) * dt * this.speed
  //   this.node.x += Math.cos(toRad) * dt * this.speed
  //   // }
  //   //  else if (this.isWhite && !this.absorping) {
  //   //   let from = this.node.getPosition()
  //   //   let to = this.cursorNode.getPosition()
  //   //   let radAngle = cc.pToAngle(cc.pSub(to, from))
  //   //   let degAngle = -cc.radiansToDegrees(radAngle)

  //   //   let toRad = degAngle * Math.PI / 180

  //   //   let addY = Math.sin(toRad) * 1000 * dt
  //   //   let addX = Math.cos(toRad) * 1000 * dt
  //   //   if (addY < Math.abs(from.y - to.y)) {
  //   //     this.node.y -= addY
  //   //   } else {
  //   //     this.node.y = to.y
  //   //   }
  //   //   if (addX < Math.abs(to.x - from.x)) {
  //   //     this.node.x += addX
  //   //   } else {
  //   //     this.node.x = to.x
  //   //   }

  //   //   let distance = cc.pDistance(this.node.getPosition(), to)
  //   //   if (distance < Math.max(this.cursorNode.width / 2, this.node.width / 2)) {
  //   //     this.node.x = to.x
  //   //     this.node.y = to.y
  //   //     this.absorping = true
  //   //   }
  //   // } else if (this.absorping && !this.disappearing) {
  //   //   let from = this.cursorNode.getPosition()
  //   //   let to = this.mochiNode.getPosition()
  //   //   let distance = cc.pDistance(to, from)
  //   //   let radAngle = cc.pToAngle(cc.pSub(to, from))
  //   //   let degAngle = -cc.radiansToDegrees(radAngle)

  //   //   let toRad = degAngle * Math.PI / 180

  //   //   let newY = Math.sin(toRad) * distance * this.absorpLengthRate
  //   //   let newX = -Math.cos(toRad) * distance * this.absorpLengthRate
  //   //   this.node.y = newY
  //   //   this.node.x = newX

  //   //   distance = cc.pDistance(to, this.node.getPosition())
  //   //   if (distance <= Math.abs(16 * this.mochiNode.getScale() - this.node.width / 2)) {
  //   //     this.disappearing = true
  //   //     this.animName = 'EnemyDisappear'
  //   //     this.anim.play(this.animName)
  //   //     this.node.emit('onEaten', this)
  //   //   } else {
  //   //     this.absorpLengthRate = Math.max(0, this.absorpLengthRate - dt / 2)
  //   //   }
  //   // }
  // },

  onCollisionEnter(other, self) {
    if (!this.isEaten && !this.isWhite && other.node.group === 'cursor') {
      this.isWhite = true
      this.anim.play('EnemyWhiten')
      messagePipeline.sendMessage('SOUND_PLAY', 'white')
    }
    if (other.node.group === 'player') {
      this.isEaten = true
      if (this.isWhite) {
        this.node.emit('onEaten', this)
      } else {
        this.node.emit('onHit', this)
      }
      this.speed = 500
      this.anim.play('EnemyDisappear')
    }
    if (other.node.group === 'bgColor') {
      this.isEaten = true
      this.anim.play('EnemyDisappear')
    }
  },

  animFinished(event) {
    if (event.target.clip.name === 'EnemyDisappear') {
      this.node.emit('onEnemyDelete', this.node)
    }
  },

  deleteEnemy() {
    if (this.node.getNumberOfRunningActions() > 0) {
      this.node.stopAllActions()
    }
    this.node.emit('onEnemyDelete', this.node)
  }
});