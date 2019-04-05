const predicate = (a, b) => b.name < a.name ? 1 : b.name < a.name ? -1 : b.version > a.version ? 1 : -1;

function initialize() {
    const elements = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elements);

    loadProcesses();
}

async function alert(message) {
    M.toast({ html: message, classes: 'red lighten-2', displayLength: 10000 });
}

async function loadProcesses() {
    const processes = await getProcessesAsync();
    await asyncForEach(processes, addInstanceCountAsync);
    processes.sort(predicate).forEach(addProcess);
}

async function getProcessesAsync() {
    let processes = await fetch('http://localhost:8080/engine-rest/process-definition')
        .then(response => response.json())
        .catch(error => alert(error));
    return processes;
}

async function startProcessAsync(id) {
    const payload = {
        variables: {
            email: {
                value: 'Peeter@eeter.com',
                type: 'String'
            }
        }
    }

    fetch('http://localhost:8080/engine-rest/process-definition/' + id + '/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(() => {
            document.getElementById(id + '-count').innerHTML = parseInt(document.getElementById(id + '-count').innerHTML) + 1;
            M.toast({ html: 'Process started' });
        })
        .catch(error => alert(error));
}

async function deleteProcessAsync(id) {
    fetch('http://localhost:8080/engine-rest/process-definition/' + id + '?cascade=true&skipCustomListeners=true&skipIoMappings=true', { method: 'DELETE' })
        .then(() => {
            prosess.parentNode.removeChild(document.getElementById(id));
            M.toast({ html: 'Process definition deleted' });
        })
        .catch(error => alert(error));
}

async function addInstanceCountAsync(process) {
    const data = await fetch('http://localhost:8080/engine-rest/process-instance/count?processDefinitionId=' + process.id)
        .then(response => response.json())
        .catch(error => alert(error));
    process.count = data.count;
    return process;
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

async function updateProcessAsync(id) {
    const process = document.getElementById(id);
    const fileInput = document.getElementById(id + '-file');
    const request = new XMLHttpRequest();
    const data = new FormData();
    data.append('enable-duplicate-filtering', 'false');
    data.append('deploy-changed-only', 'false');
    data.append('deployment-source', 'local');
    data.append('deployment-name', process.getAttribute('data-name'));
    data.append('tenant-id', process.getAttribute('data-tenant'));
    data.append('data', fileInput.files[0]);

    request.onreadystatechange = function () {
        if (request.readyState != 4) return;
        if (request.status != 200) {
            alert(request.statusText);
        } else {
            document.getElementById('processList').innerHTML = '';
            loadProcesses();
            M.toast({ html: 'Process deployed successfully' });
        }
    };

    request.open("POST", "http://localhost:8080/engine-rest/deployment/create");
    request.send(data);
}

async function copyToClipboard(id) {
    navigator.clipboard.writeText(id).then(() => M.toast({ html: 'Copied to Clipboard!' }));
}

async function addProcess(process) {
    document.getElementById('processList').innerHTML += `
    <li id="${process.id}" data-name="${process.name}" data-tenant="${process.tenantId}">
        <div class="collapsible-header">
            <i class="material-icons">settings</i>${process.name}
            <span class="left instances" id="${process.id + '-count'}">${process.count}</span><span class="instances">${process.count === 1 ? 'instance' : 'instances'}</span>
            <span class="new badge" data-badge-caption="v">${process.version}.</span>
        </div>
        <div class="collapsible-body">
            <div class="row">
                <div class="col s6">
                    <span>${process.id}</span><i class="tiny material-icons clickable" onclick="copyToClipboard('${process.id}');">content_copy</i>
                </div>
                <div class="col s6">
                    <button class="btn-large waves-effect waves-light right" onclick="startProcessAsync('${process.id}');">Start<i class="material-icons right">play_arrow</i></button>
                </div>
            </div>
            <div class="row">
                <div class="col s6">
                    <div class="file-field input-field">
                        <div class="btn">
                            <span>Model</span><input id="${process.id + '-file'}" type="file">
                        </div>
                        <div class="file-path-wrapper">
                            <input class="file-path validate" type="text">
                        </div>
                    </div>
                </div>
                <div class="col s6">
                    <button class="btn waves-effect waves-light red lighten-2 right" onclick="deleteProcessAsync('${process.id}');">Delete<i class="material-icons right">delete</i></button>
                    <button class="btn waves-effect waves-light right" onclick="updateProcessAsync('${process.id}');">Update<i class="material-icons right">build</i></button>
                </div>
            </div>
        </div>
    </li>`
}

(function () {
    initialize();
})();