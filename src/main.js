import Vue from 'vue'
import App from './App.vue'
import store from './store'

import 'ant-design-vue/dist/antd.css'
import './css/scrollbar.css'

import {
    Button,
    Upload,
    Icon,
    Layout,
    Dropdown,
    Menu,
    Row,
    Col,
    Modal,
    Progress,
    Tooltip,
    InputNumber,
} from 'ant-design-vue'

Vue.use(Button)
Vue.use(Upload)
Vue.use(Icon)
Vue.use(Layout)
Vue.use(Dropdown)
Vue.use(Menu)
Vue.use(Row)
Vue.use(Col)
Vue.use(Modal)
Vue.use(Progress)
Vue.use(Tooltip)
Vue.use(InputNumber)

Vue.config.productionTip = false

new Vue({
    store,
    render: (h) => h(App),
}).$mount('#app')
