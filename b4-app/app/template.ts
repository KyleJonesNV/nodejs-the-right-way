import * as Handlebars from '../node_modules/handlebars/dist/handlebars.js'

export const main = Handlebars.compile(`
    <div class="container">
        <h1>B4 - Book Bundler</h1>
        <div class="b4-alerts"></div>
        <div class="b4-main"></div>
    <div>    
`)

export const welcome = Handlebars.compile(`
    <div class="h-100 p-5 bg-body-secondary border rounded-3">
        <h1>Welcome!</h1>
        <p>B4 is an application for creating book bundles.</p>
    </div>
`)

export const alert = Handlebars.compile(`
    <div class="alert alert-{{type}} alert-dismissible fade show" role="alert">
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        {{message}}
    </div>
`)
