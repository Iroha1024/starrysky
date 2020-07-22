export function calcMainColor(imgData, width, height) {
    let r = 0,
        g = 0,
        b = 0
    for (let i = 0; i < imgData.length; i += 4) {
        r += imgData[i]
        g += imgData[i + 1]
        b += imgData[i + 2]
    }
    r /= width * height
    g /= width * height
    b /= width * height
    r = Math.round(r)
    g = Math.round(g)
    b = Math.round(b)
    return {
        r,
        g,
        b,
    }
}

export function deltaRgb(rgb1, rgb2) {
    const [r1, g1, b1] = rgb1,
        [r2, g2, b2] = rgb2,
        drp2 = Math.pow(r1 - r2, 2),
        dgp2 = Math.pow(g1 - g2, 2),
        dbp2 = Math.pow(b1 - b2, 2),
        t = (r1 + r2) / 2

    return Math.sqrt(2 * drp2 + 4 * dgp2 + 3 * dbp2 + (t * (drp2 - dbp2)) / 256)
}
