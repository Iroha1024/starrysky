<template>
    <a-layout-footer class="footer">
        <a-row type="flex" justify="center" :gutter="[0, 16]">
            <a-col :offset="1">
                <a-button @click="open('restImgModal')"> <a-icon type="upload" />上传副图</a-button>
            </a-col>
            <a-col :offset="1">
                <a-button @click="open('settingModal')"> <a-icon type="setting" />设置</a-button>
            </a-col>
            <a-col :offset="1">
                <a-dropdown-button :disabled="!mainImg.url">
                    <a-icon type="select" /> 选择效果
                    <a-menu slot="overlay" @click="handleMenuClick">
                        <a-menu-item key="1">
                            <a-icon type="profile" /> 马赛克（纯色）
                        </a-menu-item>
                        <a-menu-item key="2" :disabled="!restImg.data.length">
                            <a-icon type="profile" /> 马赛克（图片）
                        </a-menu-item>
                    </a-menu>
                </a-dropdown-button>
            </a-col>
        </a-row>
    </a-layout-footer>
</template>

<script>
import { mapState } from 'vuex'

import { deltaRgb } from '../util/color'

export default {
    computed: {
        ...mapState({
            mainImg: (state) => state.mainImg,
            restImg: (state) => state.restImg,
            setting: (state) => state.setting,
            progress: (state) => state.progress,
        }),
    },
    methods: {
        open(type) {
            this.$emit('openModal', type)
        },
        handleMenuClick(e) {
            switch (e.key) {
                case '1':
                    this.drawPureColorMosaic(this.mainImg.sliceToData, this.mainImg.canvas)
                    break
                case '2':
                    this.drawImgMosaic(this.mainImg.sliceToData, this.restImg.data)
                    break
            }
        },
        drawPureColorMosaic(sliceToData, { width, height }) {
            const canvas = document.createElement('canvas')
            const { scale } = this.setting
            canvas.width = width * scale
            canvas.height = height * scale
            const context = canvas.getContext('2d')
            sliceToData.forEach((data) => {
                const { r, g, b, x, y, width, height } = data
                context.fillStyle = `rgb(${r}, ${g}, ${b})`
                context.fillRect(x * scale, y * scale, width * scale, height * scale)
            })
            this.$store.commit('mainImg/setUrl', canvas.toDataURL())
        },
        async drawImgMosaic(mainImgData, restImgData) {
            const sliceToImg = new Map()
            for (let i = 0; i < mainImgData.length; i++) {
                for (let j = 0, min = Infinity; j < restImgData.length; j++) {
                    const { r: r1, g: g1, b: b1 } = mainImgData[i]
                    const { r: r2, g: g2, b: b2 } = restImgData[j]
                    const delta = deltaRgb([r1, g1, b1], [r2, g2, b2])
                    if (delta < min) {
                        min = delta
                        sliceToImg.set(mainImgData[i], restImgData[j])
                    }
                }
            }
            const canvas = document.createElement('canvas')
            const { width, height } = this.mainImg.canvas
            const { scale } = this.setting
            canvas.width = width * scale
            canvas.height = height * scale
            const context = canvas.getContext('2d')
            const promiseList = []
            const sum = mainImgData.length
            let num = 0
            const base = Math.floor(sum / 100)
            for (let i = 0; i < sum; i++) {
                const mainImg = mainImgData[i]
                const { x, y, width: actualWidth, height: actualHeight } = mainImg
                const restImg = sliceToImg.get(mainImgData[i])
                const { width: imgWidth, height: imgHeight } = restImg
                const img = this.restImg.dataToDOM.get(restImg)
                num++
                if (base == 0 || num % base == 0 || num == sum) {
                    try {
                        await this.wait(() => {
                            this.$store.commit('progress/setPercent', Math.floor((num * 100) / sum))
                        }, this.progress.isCancelTask)
                    } catch {
                        return
                    }
                }
                this.drawImage(context, img, imgWidth, imgHeight, x, y, actualWidth, actualHeight)
            }
            this.$store.commit('mainImg/setUrl', canvas.toDataURL())
        },
        wait(fn, canceled) {
            return new Promise((resolve, reject) => {
                if (canceled) reject()
                setTimeout(() => {
                    fn()
                    resolve()
                }, 0)
            })
        },
        drawImage(context, img, swidth, sheight, x, y, width, height) {
            let sx = 0,
                sy = 0
            const { scale } = this.setting
            const cutRate = swidth / sheight
            const actualRate = width / height
            if (cutRate <= actualRate) {
                sy = sheight / 2 - (swidth * height) / (2 * width)
                sheight = (swidth * height) / width
            } else {
                sx = swidth / 2 - (sheight * width) / (2 * height)
                swidth = (width * sheight) / height
            }
            context.drawImage(
                img,
                sx,
                sy,
                swidth,
                sheight,
                x * scale,
                y * scale,
                width * scale,
                height * scale
            )
        },
    },
}
</script>

<style lang="scss" scoped>
.footer {
    padding-top: 60px !important;
}
</style>
