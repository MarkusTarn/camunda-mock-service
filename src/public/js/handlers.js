function initialize() {
    loadHandlers();
}

async function loadHandlers() {
    const handlers = await getHandlersAsync();
    console.log(handlers)
    for (let handler in await handlers) {
        addHandler(handler, handlers[handler]);
    }
}

async function getHandlersAsync() {
    const handlers = await fetch('/handlers')
        .then(response => response.json())
        .catch(error => alert(error));
    return handlers;
}

async function updateHandlerVariableAsync(name, key) {
    const payload = {
        name,
        key,
        value: document.getElementById(name + '-' + key).value
    }

    fetch(`/handlers`, { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(await payload)
    })
        .then(M.toast({ html: 'Handler variable changed' }))
        .then(document.getElementById('handlersList').innerHTML = '')
        .then(loadHandlers())
        .catch(error => alert(error));
}

async function newVariableAsync(handlerName) {
    document.getElementById(handlerName).innerHTML += `
        <li class="collection-item">
            <div class="row">
                <div class="col s5">
                    <div class="input-field inline handler-variable">
                        <input class="left" placeholder="key" id="${handlerName + '-newKey'}" type="text">
                    </div>
                </div>
                <div class="col s5">
                    <div class="input-field inline handler-variable">
                        <input class="left" placeholder="value" id="${handlerName + '-newValue'}" type="text">
                    </div>
                </div>
                <div class="col s2">
                    <div class="input-field inline handler-variable">
                        <a href="#!" onclick="addHandlerVariableAsync('${handlerName}');"><i class="material-icons tiny">add</i></a>
                    </div>
                </div>
            </div>
        </li>
    `
}

async function addHandlerVariableAsync(name) {
    const key = document.getElementById(name + '-newKey').value;
    const value = document.getElementById(name + '-newValue').value;
    if (key == '' || value == '') {
        alert('Enter proper values')
    } else {
        const payload = { name, key, value };
    
        fetch(`/handlers`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(await payload)
        })
            .then(M.toast({ html: 'Handler variable added!' }))
            .then(document.getElementById('handlersList').innerHTML = '')
            .then(loadHandlers())
            .catch(error => alert(error));
    }
}

async function addHandler(handlerName, handler) {
    console.log(handler);
    let handlerItem = `
        <div id="${handlerName}">
        <li class="collection-header grey lighten-3">
            <div class="row valign-wrapper">
                <div class="col s9">
                    <h6>${handlerName}</h6>
                </div>
                <div class="col s3 valign-wrapper">
                    <button class=" valign-wrapper btn-small" class="right" onclick="newVariableAsync('${handlerName}');">add</button>
                </div>
            </div>
        </li>
    `;
    for (let key in handler) {
        handlerItem += `
            <li class="collection-item">
                <div class="row">
                    <div class="col s12 valign-wrapper">
                        <span>${key}</span> 
                        <div class="input-field inline handler-variable">
                            <input class="secondary-content right" id="${handlerName + '-' + key}" value="${handler[key]}" type="text" onchange="updateHandlerVariableAsync('${handlerName}', '${key}');">
                        </div>
                    </div>
                </div>
            </li>
        `;
    }
    handlerItem += '</div>'
    
    document.getElementById('handlersList').innerHTML += handlerItem;
}

(function () {
    initialize();
})();