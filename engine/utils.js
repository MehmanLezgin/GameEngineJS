class Utils {
    static clamp(val, min, max) {
        return Math.min(Math.max(val, min), max)
    }

    static randf(min, max) {
        return Math.random() * (max - min) + min
    }
}