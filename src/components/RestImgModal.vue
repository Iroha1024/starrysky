<template>
    <a-upload
        accept="image/png, image/jpeg"
        :beforeUpload="beforeUpload"
        :fileList="fileList"
        list-type="picture-card"
        multiple
        :previewFile="previewFile"
        :remove="remove"
        :showUploadList="{ showPreviewIcon: false }"
        @change="change"
    >
        <div>
            <a-icon type="plus" />
            <div class="ant-upload-text">
                上传
            </div>
        </div>
    </a-upload>
</template>

<script>
import { calcMainColor } from '../util/color'

export default {
    data() {
        return {
            title: '上传副图',
            fileList: [],
        }
    },
    watch: {
        '$store.state.restImg.data.length': function (length) {
            if (length == 0) this.fileList = []
        },
    },
    created() {
        this.$emit('getTitle', this.title)
    },
    methods: {
        beforeUpload(file) {
            return false
        },
        remove(file) {
            const index = this.fileList.indexOf(file)
            this.fileList.splice(index, 1)
            const uid = file.uid
            this.$store.commit('restImg/removeData', uid)
        },
        previewFile(file) {
            return new Promise((resolve) => {
                const canvas = document.createElement('canvas')
                const MEASURE_SIZE = 200
                canvas.width = MEASURE_SIZE
                canvas.height = MEASURE_SIZE
                canvas.style.cssText =
                    'position: fixed; left: 0; top: 0; width: ' +
                    MEASURE_SIZE +
                    'px; height: ' +
                    MEASURE_SIZE +
                    'px; z-index: 9999; display: none;'
                document.body.appendChild(canvas)
                const ctx = canvas.getContext('2d')
                const img = new Image()
                const url = window.URL.createObjectURL(file)
                img.src = url
                img.onload = () => {
                    const width = img.width,
                        height = img.height
                    let drawWidth = MEASURE_SIZE,
                        drawHeight = MEASURE_SIZE,
                        offsetX = 0,
                        offsetY = 0
                    if (width < height) {
                        drawHeight = height * (MEASURE_SIZE / width)
                        offsetY = -(drawHeight - drawWidth) / 2
                    } else {
                        drawWidth = width * (MEASURE_SIZE / height)
                        offsetX = -(drawWidth - drawHeight) / 2
                    }
                    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
                    const dataURL = canvas.toDataURL()
                    document.body.removeChild(canvas)
                    this.getImgInfo(img, file.uid, url)
                    resolve(dataURL)
                }
            })
        },
        change({ file, fileList }) {
            if (this.fileList.some((item) => item.name == file.name)) return
            const currentFile = fileList.find((item) => item.name == file.name)
            this.fileList = [...this.fileList, currentFile]
        },
        getImgInfo(img, uid, url) {
            const canvas = document.createElement('canvas')
            const { width, height } = img
            canvas.width = width
            canvas.height = height
            const context = canvas.getContext('2d')
            context.drawImage(img, 0, 0, width, height)
            const imgData = context.getImageData(0, 0, width, height).data
            const { r, g, b } = calcMainColor(imgData, width, height)
            const data = {
                uid,
                url,
                r,
                g,
                b,
                width,
                height,
            }
            this.$store.commit('restImg/setData', data)
            this.$store.commit('restImg/setDataToDOM', { data, dom: img })
        },
    },
}
</script>

<style lang="scss" scoped></style>
