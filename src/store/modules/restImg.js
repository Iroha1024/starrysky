const restImg = {
    namespaced: true,
    state: {
        data: [],
        dataToDOM: new WeakMap(),
    },
    mutations: {
        setData(state, data) {
            state.data.push(data)
        },
        removeData(state, uid) {
            const file = state.data.find((item) => item.uid == uid)
            window.URL.revokeObjectURL(file.url)
            const index = state.data.findIndex((item) => item.uid == uid)
            state.data.splice(index, 1)
        },
        setDataToDOM(state, { data, dom }) {
            state.dataToDOM.set(data, dom)
        },
        reset(state) {
            state.data.forEach((item) => {
                window.URL.revokeObjectURL(item.url)
            })
            state.data = []
            state.dataToDOM = new WeakMap()
        },
    },
}

export default restImg
