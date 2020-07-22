<template>
    <a-layout id="app">
        <main-img-area></main-img-area>
        <feature-area @openModal="openModal"></feature-area>
        <modal :modalType="modalType" :closeModal="closeModal"></modal>
        <progress-area></progress-area>
    </a-layout>
</template>

<script>
import MainImgArea from './components/MainImgArea'
import FeatureArea from './components/FeatureArea'
import Modal from './components/Modal'
import ProgressArea from './components/ProgressArea'

export default {
    name: 'App',
    components: {
        MainImgArea,
        FeatureArea,
        Modal,
        ProgressArea,
    },
    data() {
        return {
            modalType: '',
        }
    },
    methods: {
        openModal(type) {
            this.modalType = type
        },
        closeModal() {
            this.modalType = ''
        },
    },
}
</script>

<style lang="scss">
html {
    user-select: none;
}
#app {
    height: 100%;
    padding: 5% 25%;
}
.img--hidden {
    visibility: hidden;
    position: absolute;
    top: -9999px;
    left: -9999px;
}
</style>
