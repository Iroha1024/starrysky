<template>
    <transition name="fade" @after-leave="afterLeave">
        <div v-show="progress.isShow" class="progress-wrapper">
            <div class="ant-modal-mask blur"></div>
            <a-progress
                type="circle"
                :percent="progress.percent"
                class="ant-modal-centered ant-modal-wrap"
            >
                <template #format>
                    <div @mousemove="isCancel = true" @mouseout="isCancel = false" class="font">
                        <span v-if="isCancel" @click="cancelTask" class="cancel">取消</span>
                        <span v-else>{{ progress.percent }} %</span>
                    </div>
                </template>
            </a-progress>
        </div>
    </transition>
</template>

<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState({
            progress: (state) => state.progress,
        }),
    },
    watch: {
        'progress.percent'(percent) {
            if (percent > 0 && percent < 2) {
                this.$store.commit('progress/setIsShow', true)
            }
            if (percent == 100) {
                this.$store.commit('progress/setIsShow', false)
            }
        },
    },
    data() {
        return {
            isCancel: false,
        }
    },
    methods: {
        afterLeave() {
            this.$store.commit('progress/setPercent', 0)
        },
        cancelTask() {
            this.$store.commit('progress/setisCancelTask', true)
            this.$store.commit('progress/setIsShow', false)
            setTimeout(() => {
                this.$store.commit('progress/setisCancelTask', false)
            }, 200)
        },
    },
}
</script>

<style lang="scss" scoped>
.fade-enter-active {
    transition: opacity 0.2s;
}
.fade-leave-active {
    transition: opacity 0.8s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
.progress-wrapper {
    opacity: 1;
    .blur {
        backdrop-filter: blur(5px);
    }
    .font {
        font-size: 25px;
        color: #ffffff;
        .cancel {
            cursor: pointer;
            color: #f74040;
        }
    }
}
</style>
