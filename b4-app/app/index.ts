import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import { main, welcome, alert } from './template'

// Page setup
document.body.innerHTML = main()
const mainElement = document.body.querySelector('.b4-main')
const alertsElement = document.body.querySelector('.b4-alerts')

mainElement.innerHTML = welcome()
alertsElement.innerHTML = alert({type: "info", message: "Handlerbars is working!"})