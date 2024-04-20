class CanvasTexture extends Texture {
    constructor(width = 128, height = 128, rend = null) {
        super()
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        this.rend = rend ? rend : new Renderer2D(canvas, new Camera2D(), false)
    }

    getImage() {
        return this.canvas
    }

    getWidth() {
        return this.rend.getWidth()
    }

    getHeight() {
        return this.rend.getHeight()
    }

    isLoaded() {
        return this.rend.canvas.width > 0 && this.rend.canvas.height > 0
    }
}