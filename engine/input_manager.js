class InputManager {
    constructor(element) {
        this._element = element;
        this.mouseOldPos = new vec2()
        this.mousePos = new vec2()
        this.isMouseDown = false;

        addEventListener('mousemove', (e) => {
            this.mouseOldPos.x = this.mousePos.x
            this.mouseOldPos.y = this.mousePos.y
            this.updateMousePos(e)
        })

        addEventListener('mousedown', (e) => {
            this.isMouseDown = true;
        })

        addEventListener('mouseup', (e) => {
            this.isMouseDown = false;
        })
    }

    addOnTouchListener(listener) {
        addEventListener('touchstart', (e) => {
            var touch = e.touches[0]
            listener(e, new vec2(touch.pageX, touch.pageY))
        })
    }
    
    addOnMouseDownListener(listener) {
        addEventListener('mousedown', (e) => listener(e, this.mousePos))
    }
    
    addOnMouseUpListener(listener) {
        addEventListener('mouseup', (e) => listener(e, this.mousePos))
    }

    addOnMouseMoveListener(listener) {
        addEventListener('mousemove', (e) => {
            listener(e, this.mousePos, this.mouseOldPos) // e, oldPos, newPos
        })
    }

    addOnKeyDownListener(listener) {
        addEventListener('keydown', (e) => listener(e, e.keyCode))
    }

    addOnKeyUpListener(listener) {
        addEventListener('keyup', (e) => listener(e, e.keyCode))
    }
    
    addScrollListener(listener) {
        addEventListener('wheel', (e) => listener(e, e.deltaX, e.deltaY, e.deltaZ))
    }

    updateMousePos(e) {
        const rect = this._element.getBoundingClientRect()
        this.mousePos.x = e.clientX - rect.left
        this.mousePos.y = e.clientY - rect.top
    }
}