<template>
    <div>
        <a-row type="flex" justify="start" :gutter="[0, 16]" class="setting-list">
            <a-col>
                <label for="sliceNum">
                    切割份数：
                    <a-tooltip placement="right" title="图片在水平、垂直方向被切割成网格状">
                        <a-input-number id="sliceNum" v-model="sliceNum" :min="1" :max="200" />
                    </a-tooltip>
                </label>
            </a-col>
            <a-col>
                <label for="scale">
                    放大倍数：
                    <a-tooltip placement="right" title="图片宽度、长度被放大">
                        <a-input-number id="scale" v-model="scale" :min="1" :max="20" />
                    </a-tooltip>
                </label>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState({
            setting: (state) => state.setting,
        }),
        sliceNum: {
            get() {
                return this.setting.sliceNum
            },
            set(value) {
                value = Math.ceil(value)
                if (value > 0 && value <= 200) {
                    this.$store.commit('setting/setSliceNum', value)
                }
            },
        },
        scale: {
            get() {
                return this.setting.scale
            },
            set(value) {
                value = Math.ceil(value)
                if (value > 0 && value <= 20) {
                    this.$store.commit('setting/setScale', value)
                }
            },
        },
    },
    data() {
        return {
            title: '设置',
        }
    },
    created() {
        this.$emit('getTitle', this.title)
    },
}
</script>

<style lang="scss" scoped>
.setting-list {
    flex-direction: column;
}
</style>
