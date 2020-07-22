const setting = {
    namespaced: true,
    state: {
        sliceNum: 80,
        scale: 1,
    },
    mutations: {
        setSliceNum(state, sliceNum) {
            state.sliceNum = sliceNum
        },
        setScale(state, scale) {
            state.scale = scale
        },
        reset(state) {
            state.sliceNum = 60
            state.scale = 1
        },
    },
}

export default setting
