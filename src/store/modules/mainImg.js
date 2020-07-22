const mainImg = {
    namespaced: true,
    state: {
        url: '',
        canvas: null,
        sliceToData: [],
    },
    mutations: {
        reset(state) {
            state.url = ''
            state.canvas = null
            state.sliceToData = []
        },
        setUrl(state, url) {
            state.url = url
        },
        setCanvas(state, canvas) {
            state.canvas = canvas
        },
        setSliceToData(state, sliceToData) {
            state.sliceToData = sliceToData
        },
    },
}

export default mainImg
