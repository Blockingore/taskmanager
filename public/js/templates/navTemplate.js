"use strict";

function createNavLinks(active){
    return `<li class="nav-item ${active === 'tasks' ? 'active' : ''}">
                <a class="nav-link" href="/"> Tasks ${active === ' tasks' ? '<span class="sr-only">(current)</span>' : ''} </a>
            </li>`
}

export default createNavLinks;