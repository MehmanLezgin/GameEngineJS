class Texture {
    constructor() {
        this.onUpdateListener = null
    }

    getImage() {
        throw "getImage is virtual for class 'Texture'"
    }

    isLoaded() {
        return false
    }

    getWidth() {
        return 0
    }

    getHeight() {
        return 0
    }

    setOnUpdateListener(listener) {
        this.onUpdateListener = listener
    }
}