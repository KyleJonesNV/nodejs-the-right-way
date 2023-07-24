import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import * as template from './template'

const user_password = 'elastic' + ':' + 'lyqSKuVRvv8cvVGyjO+V'
const auth = btoa(user_password)

// Page setup
document.body.innerHTML = template.main()
const mainElement = document.body.querySelector('.b4-main')
const alertsElement = document.body.querySelector('.b4-alerts')

/**
 * Use Window location hash to show the specified view.
 */

const showView = async () => {
  const [view, ...params] = window.location.hash.split('/')
  switch (view) {
    case '#welcome':
      mainElement.innerHTML = template.welcome()
      break
    case '#list-bundles':
      const bundles = await getBundles()
      listBundles(bundles)
      break
    default:
      // Unrecognized view.
      throw Error(`Unrecognized view ${view}`)
  }
}

window.addEventListener('hashchange', showView)

showView().catch((err) => {
  window.location.hash = '#welcome'
})

const getBundles = async () => {
  const esRes = await fetch('/es/b4/_search', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
  })
  const esResBody = await esRes.json()
  return esResBody.hits.hits.map((hit) => ({ id: hit._id, name: hit._source.name }))
}

const listBundles = (bundles) => {
  mainElement.innerHTML = template.addBundleForm() + template.listBundles({ bundles })

  const form = mainElement.querySelector('form')
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const name = form.querySelector('input').value
    addBundle(name)
  })
}

const showAlert = (message, type = 'danger') => {
  const html = template.alert({ type, message })
  alertsElement.insertAdjacentHTML('beforeend', html)
}

/**
 * Create a new bundle with given name, then llst bundles
 */

const addBundle = async (name: string) => {
  try {
    const bundles = await getBundles()
    const url = `/api/bundle?name=${encodeURIComponent(name)}`
    const res = await fetch(url, {
      method: 'POST',
    })
    const body = await res.json()
    bundles.push({ id: body._id, name })
    listBundles(bundles)
  } catch (error) {
    console.log(error)
    showAlert({ message: error.message, type: 'danger' })
  }
}
