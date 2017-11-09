import {
  messagePipeline
} from 'MessagePipeline'
cc.Class({
  extends: cc.Component,

  properties: {},

  // use this for initialization
  onLoad: function () {
    this.audioSources = this.node.getComponents(cc.AudioSource)
    this.clipNames = []
    for (let i = 0; i < this.audioSources.length; i++) {
      let clipName = this.audioSources[i].clip
      this.clipNames.push(clipName.substring(clipName.lastIndexOf('/') + 1, clipName.lastIndexOf('.')))
    }
  },

  start() {
    this._soundNameStack = []
    messagePipeline.on('SOUND_PLAY', this._soundStack, this)
    messagePipeline.on('onMinBeat', this._onMinBeat, this)
  },

  onDestroy() {
    messagePipeline.off('SOUND_PLAY', this._soundStack, this)
  },

  _soundStack(event) {
    let sound = event.getUserData()
    let soundIndex = this.clipNames.indexOf(sound)
    if (soundIndex < 0) {
      return
    }
    if (this._soundNameStack.indexOf(soundIndex) < 0) {
      this._soundNameStack.push(soundIndex)
    }
    // if (this.audioSources[soundIndex].isPlaying) {
    //   this.audioSources[soundIndex].stop()
    // }
    // this.audioSources[soundIndex].play()
  },

  _onMinBeat(event) {
    let minBeatCount = event.getUserData()
    // if (minBeatCount % 2 === 0) {
    //   return
    // }
    this._soundNameStack.forEach(function(index) {
      if (this.audioSources[index].isPlaying) {
        this.audioSources[index].stop()
      }
      this.audioSources[index].play()
    }, this);
    this._soundNameStack = []
  }
})
