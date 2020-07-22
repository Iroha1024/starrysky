const progress = {
    namespaced: true,
    state: {
        percent: 0,
        isShow: false,
        isCancelTask: false,
    },
    mutations: {
        setPercent(state, percent) {
            state.percent = percent
        },
        setIsShow(state, isShow) {
            state.isShow = isShow
        },
        setisCancelTask(state, isCancelTask) {
            state.isCancelTask = isCancelTask
        },
    },
}

export default progress
