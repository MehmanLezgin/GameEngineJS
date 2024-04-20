class StaticCanvasTexture extends CanvasTexture {
    constructor(width = 128, height = 128, rend = null) {
        super(width, height, rend)
        this.render()
    }

    render() {

    }

    getImage() {
        return this.rend.canvas
    }
}