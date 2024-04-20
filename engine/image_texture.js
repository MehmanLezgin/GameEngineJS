class ImageTexture extends Texture {
    constructor(path) {
        super()
        this.img = new Image()
        this.img.src = path
        
        this.img.addEventListener('load', () => this.onUpdateListener?.())
    }

    getImage() {
        return this.img
    }

    
    getWidth() {
        return this.img.width
    }

    getHeight() {
        return this.img.height
    }

    isLoaded() {
        return this.img.complete && this.img.naturalHeight != 0
    }
}