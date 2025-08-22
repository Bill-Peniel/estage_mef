import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// Animation libraries
import AOS from 'aos'
import 'aos/dist/aos.css'
// Custom animations
import './assets/animation.css'
// Import des styles globaux
import './assets/css/main.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Initialize AOS
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  mirror: false
})

const app = createApp(App)

const toastOptions = {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: true,
  rtl: false
}

app.use(router)
app.use(store)
app.use(Toast, toastOptions)

app.mount('#app')
