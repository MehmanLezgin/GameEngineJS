class DynamicCanvasTexture extends CanvasTexture {
    constructor(width = 128, height = 128, rend = null) {
        super(width, height, rend)
        this.onResizeListener = null
    }

    setOnResizeListener() {
        this.onResizeListener = listener
    }

    onResize(newWidth, newHeight) {
        // this.rend.canvas.width = newWidth
        // this.rend.canvas.height = newHeight
        this.rend.setWidth(newWidth)
        this.rend.setHeight(newHeight)
        this.onResizeListener?.()
        this.onUpdateListener?.()
    }

    render() {

    }

    getImage() {
        this.render()
        return this.rend.canvas
    }
}