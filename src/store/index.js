import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import mainImg from './modules/mainImg'
import restImg from './modules/restImg'
import setting from './modules/setting'
import progress from './modules/progress'

export default new Vuex.Store({
    modules: {
        mainImg,
        restImg,
        setting,
        progress,
    },
})
