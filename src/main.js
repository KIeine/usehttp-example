import { createApp } from 'vue'
import App from './App.vue'
import { browser } from './mocks/browser.js';

browser.start()
createApp(App).mount('#app')
