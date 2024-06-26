class ScoreTexture extends StaticCanvasTexture {
    constructor(width, height, numTexPath) {
        super(width, height);
        this.score = 0;
        this.numSprites = this.loadDigitSprites(numTexPath);
    }

    loadDigitSprites(numTexPath) {
        const numSprites = Array(10);
        for (let i = 0; i <= 9; i++) {
            const texture = new ImageTexture(`${numTexPath}/${i}.png`);
            numSprites[i] = new RectSprite({ texture, scale: 0.5 });
        }

        return numSprites;
    }

    setScore(value) {
        if (value !== this.score) {
            this.score = value;
            this.render();
        }
    }

    splitScoreDigits() {
        if (this.score <= 0) return [0];
        const arr = [];
        let tmp = this.score;
        while (tmp) {
            arr.push(tmp % 10);
            tmp = Math.floor(tmp / 10);
        }
        return arr.reverse();
    }

    render() {
        this.rend.clear();
        const digits = this.splitScoreDigits();
        // const size = this.numSprites[0].scale.x + 0.03  ;
        const size = .52;
        const length = digits.length;
        const offset = (length * 0.5 - 0.5) * size;
        const pos = new vec2();

        for (let i = 0; i < length; i++) {
            const digit = digits[i];
            const sprite = this.numSprites[digit];
            
            if (!sprite) continue

            // console.log(sprite.texture.img);
            pos.x = i * size - offset;
            this.rend.renderSprite(sprite, { pos });
        }
    }

    getImage() {
        this.render()
        return this.rend.canvas
    }
}
