import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import * as template from './template'

const user_password = 'elastic' + ':' + 'lyqSKuVRvv8cvVGyjO+V'
const auth = btoa(user_password)

/**
 * Alerts UI
 */
const showAlert = (message, type = 'danger') => {
  const alertsElement = document.body.querySelector('.b4-alerts')
  const html = template.alert({ type, message })
  alertsElement.insertAdjacentHTML('beforeend', html)
}

/**
 * Use window location hash for routing views
 */
const showView = async () => {
  const mainElement = document.body.querySelector('.b4-main')
  const [view, ...params] = window.location.hash.split('/')

  switch (view) {
    case '#welcome':
      const session = {}
      mainElement.innerHTML = template.welcome({session})
      break
    default:
      // Unrecognized view.
      throw Error(`Unrecognized view ${view}`)
  }
}

// Page setup
(async () => {
  const session = {}
  document.body.innerHTML = template.main({session})
  window.addEventListener('hashchange', showView)
  showView().catch((err) => {
    window.location.hash = '#welcome'
  })
})()