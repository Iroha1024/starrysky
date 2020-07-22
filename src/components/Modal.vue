<template>
    <a-modal
        :bodyStyle="bodyStyle"
        centered
        :title="title"
        :visible="Boolean(modalType)"
        :width="width"
        @cancel="closeModal"
    >
        <keep-alive>
            <component :is="componentName" @getTitle="getTitle"></component>
        </keep-alive>
        <template #footer>
            <a-button @click="reset"><a-icon type="undo" />重置</a-button>
        </template>
    </a-modal>
</template>

<script>
import RestImgModal from './RestImgModal'
import SettingModal from './SettingModal'

export default {
    components: {
        RestImgModal,
        SettingModal,
    },
    props: ['modalType', 'closeModal'],
    data() {
        return {
            title: '',
        }
    },
    computed: {
        width() {
            switch (this.modalType) {
                case 'restImgModal':
                    return 620
                case 'settingModal':
                    return 520
            }
        },
        bodyStyle() {
            switch (this.modalType) {
                case 'restImgModal':
                    return {
                        maxHeight: '300px',
                        overflow: 'auto',
                    }
                case 'settingModal':
                    return {}
            }
        },
        componentName() {
            switch (this.modalType) {
                case 'restImgModal':
                    return RestImgModal
                case 'settingModal':
                    return SettingModal
            }
        },
    },
    methods: {
        getTitle(title) {
            this.title = title
        },
        reset() {
            switch (this.modalType) {
                case 'restImgModal':
                    this.$store.commit('restImg/reset')
                    break
                case 'settingModal':
                    this.$store.commit('setting/reset')
                    break
            }
        },
    },
}
</script>

<style lang="scss" scoped></style>
