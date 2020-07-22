<template>
    <a-layout-content class="content">
        <a-upload-dragger
            v-if="!img.url"
            accept="image/png, image/jpeg"
            :beforeUpload="beforeUpload"
            :showUploadList="false"
            @change="change"
            class="dragger"
        >
            <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">
                点击或者拖拽图片至此
            </p>
            <p class="ant-upload-hint">
                请先在此上传主图，之后再上传副图
            </p>
        </a-upload-dragger>
        <div v-else class="main-img-wrapper">
            <a-row type="flex" class="feature-list">
                <a-col>
                    <a-tooltip placement="right" title="删除">
                        <a-icon type="delete" @click="close" />
                    </a-tooltip>
                </a-col>
                <a-col>
                    <a-tooltip placement="right" title="下载">
                        <a-icon type="download" @click="download" />
                    </a-tooltip>
                </a-col>
            </a-row>
            <img :src="img.url" class="preview" />
        </div>
    </a-layout-content>
</template>

<script>
import { mapState } from 'vuex'
import debounce from 'lodash.debounce'

import { calcMainColor } from '../util/color'

export default {
    computed: {
        ...mapState({
            img: (state) => state.mainImg,
            setting: (state) => state.setting,
        }),
    },
    watch: {
        'setting.sliceNum'() {
            if (this.img.canvas) {
                this.updateSliceData()
            }
        },
    },
    methods: {
        beforeUpload() {
            return false
        },
        close() {
            this.$store.commit('mainImg/reset')
        },
        download() {
            const a = document.createElement('a')
            a.href = this.img.url
            a.download = new Date().getTime().toString(16).toUpperCase()
            a.click()
        },
        async change({ fileList }) {
            const file = fileList[0]
            const canvas = await this.getImgInfo(file)
            this.$store.commit('mainImg/setCanvas', canvas)
            const sliceToData = this.getSliceData(this.img.canvas)
            this.$store.commit('mainImg/setSliceToData', sliceToData)
        },
        getImgInfo(file) {
            return new Promise((resolve) => {
                const reader = new FileReader()
                reader.readAsDataURL(file.originFileObj)
                reader.onload = () => {
                    this.$store.commit('mainImg/setUrl', reader.result)
                    const img = document.createElement('img')
                    img.src = this.img.url
                    img.classList.add('img--hidden')
                    document.body.appendChild(img)
                    img.onload = () => {
                        const canvas = document.createElement('canvas')
                        const { width, height } = img
                        document.body.removeChild(img)
                        canvas.width = width
                        canvas.height = height
                        const context = canvas.getContext('2d')
                        context.drawImage(img, 0, 0, width, height)
                        resolve(canvas)
                    }
                }
            })
        },
        updateSliceData: debounce(function () {
            const sliceToData = this.getSliceData(this.img.canvas)
            this.$store.commit('mainImg/setSliceToData', sliceToData)
        }, 1500),
        getSliceData(canvas) {
            const context = canvas.getContext('2d')
            const { width, height } = canvas
            const widthSlice = this.slice(width)
            const heightSlice = this.slice(height)
            // console.log(width, widthSlice)
            const sliceToData = []
            for (let j = 0; j < heightSlice.length - 1; j++) {
                for (let i = 0; i < widthSlice.length - 1; i++) {
                    const width = widthSlice[i + 1] - widthSlice[i]
                    const height = heightSlice[j + 1] - heightSlice[j]
                    const imgData = context.getImageData(
                        widthSlice[i],
                        heightSlice[j],
                        width,
                        height
                    ).data
                    const { r, g, b } = calcMainColor(imgData, width, height)
                    sliceToData.push({
                        r,
                        g,
                        b,
                        x: widthSlice[i],
                        y: heightSlice[j],
                        width,
                        height,
                    })
                }
            }
            // console.log(sliceToData)
            return sliceToData
        },
        slice(pixel) {
            const arr = []
            const { sliceNum } = this.setting
            let remainder = pixel % sliceNum
            const count = Math.floor(pixel / sliceNum)
            for (let index = 0; index < sliceNum; index++) {
                if (remainder > 0) {
                    arr[index] = count + 1
                    remainder--
                } else {
                    arr[index] = count
                }
                if (index != 0) arr[index] += arr[index - 1]
            }
            arr.unshift(0)
            return arr
        },
    },
}
</script>

<style lang="scss" scoped>
.content {
    display: flex;
    justify-content: center;
    align-items: center;
    .dragger {
        width: 100%;
        height: 100%;
        .ant-upload-text {
            font-size: 25px;
            margin-bottom: 20px !important;
        }
        .ant-upload-hint {
            font-size: 20px;
        }
    }
    .main-img-wrapper {
        position: relative;
        .feature-list {
            flex-direction: column;
            position: absolute;
            right: -35px;
            bottom: 0;
            font-size: 25px;
            i:hover {
                color: var(--antd-wave-shadow-color);
            }
        }
        .preview {
            max-height: 500px;
        }
    }
}
</style>
