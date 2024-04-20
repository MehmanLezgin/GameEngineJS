class DynamicTexture2 extends Renderer2D {
    constructor(width = 128, height = 128) {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        super(canvas, new Camera2D(), false)
    }

    render() {
        return this.canvas
    }
}