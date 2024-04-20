class ScoreTexture extends DynamicTexture2 {
    constructor(width, height, numTexPath) {
        super(width, height);
        this.score = 0;
        this.numSprites = this.loadDigitSprites(numTexPath);
    }

    loadDigitSprites(numTexPath) {
        const numSprites = Array(10);
        for (let i = 0; i <= 9; i++) {
            const texture = Sprite.loadTexture(`${numTexPath}/${i}.png`);
            numSprites[i] = new RectSprite({ texture, scale: 0.5 });
        }

        // numSprites[0].texture.addEventListener('load', () => {
        //     console.log(numSprites[0].texture.height / numSprites[0].texture.width);
        //     console.log(numSprites[1].texture.height / numSprites[1].texture.width);
        //     numSprites[1].aspect = numSprites[0].texture.height / numSprites[0].texture.width
        //     // console.log(numSprites[0].texture.height, numSprites[0].texture.width);
        // })
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
        this.clear();
        const digits = this.splitScoreDigits();
        const size = this.numSprites[0].scale.x + 0.03  ;
        const length = digits.length;
        const offset = (length * 0.5 - 0.5) * size;
        const pos = new vec2();

        for (let i = 0; i < length; i++) {
            const digit = digits[i];
            const sprite = this.numSprites[digit];
            if (!sprite) continue

            pos.x = i * size - offset;
            this.renderSprite(sprite, { pos });
        }

        return this.canvas;
    }
}
