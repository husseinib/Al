import { ProgressBar } from "@pixi/ui"
import { Container, Graphics, Text, TextStyle } from "pixi.js"

class AssetsProgressBar extends Container {
  constructor(config) {
    super()
    this.defaultArgs = {
      animate: true,
      value: 0,
      vertical: window.matchMedia("(orientation: portrait)").matches
    }

    this.options = { ...this.defaultArgs, ...config.progress.bar }

    const background = new Graphics()
        .fill(this.options.borderColor)
        .roundRect(0, 0, this.options.width, this.options.height, this.options.radius)
        .fill(this.options.backgroundColor)
        .roundRect(this.options.border, this.options.border, this.options.width - (this.options.border * 2), this.options.height - (this.options.border * 2), this.options.radius)

    const filler = new Graphics()
        .fill(this.options.borderColor)
        .roundRect(0, 0, this.options.width, this.options.height, this.options.radius)
        .fill(this.options.fillColor)
        .roundRect(this.options.border, this.options.border, this.options.width - (this.options.border * 2), this.options.height - (this.options.border * 2), this.options.radius)

    this.progressBar = new ProgressBar({
        bg: background,
        fill: filler,
        progress: this.options.value
    })

    const loadingTxtStyle = new TextStyle({ ...config.progress.text, fontWeight: 'bold' })

    this.progressText = new Text('', loadingTxtStyle)
    this.progressText.visible = config.progress.text.visible
    this.progressText.position.set(
      this.progressBar.width / 2,
      this.progressBar.height
    )

    if(this.options.vertical) {
      this.rotation = Math.PI / 2;
      this.position.set(this.y, this.x)
    }
    
    this.addChild(this.progressBar, this.progressText)
    this.pivot.set(
      this.width / 2,
      this.height / 2
    )
  }

  setProgress(progress) {
    this.progressBar.progress = Math.floor(progress * 100)
    this.progressText.text = `${this.progressBar.progress}%`
    this.progressText.x = this.progressBar.width / 2 - this.progressText.width / 2
    if(Number(progress) === 1) this.destroy()
  }
}

export default AssetsProgressBar