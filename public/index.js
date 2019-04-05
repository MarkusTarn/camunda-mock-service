async function getProcessesAsync() {
    let response = await fetch('http://localhost:8080/engine-rest/process-definition');
    let data = await response.json();
    return data;
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

    let response = await fetch('http://localhost:8080/engine-rest/process-definition/' + id + '/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (response.ok) {
        M.toast({ html: 'Process started' });
    } else {
        M.toast({ html: 'Unsuccessfull' });
    }
}

async function deleteProcessAsync(id) {
    let response = await fetch('http://localhost:8080/engine-rest/process-definition/' + id + '?cascade=true&skipCustomListeners=true&skipIoMappings=true', { method: 'DELETE' });
    if (response.ok) {
        let prosess = document.getElementById(id);
        prosess.parentNode.removeChild(prosess);
        M.toast({ html: 'Process definition deleted' });
    } else {
        M.toast({ html: 'Unsuccessfull' });
    }
}

async function getInstanceCountAsync(id) {
    let response = await fetch('http://localhost:8080/engine-rest/process-instance/count?processDefinitionId=' + id);
    let data = await response.json();
    return data.count;
}

function updateProcessAsync(id) {
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

    request.onreadystatechange = function() {
        if(request.readyState != 4) return;
        if(request.status != 200){
            M.toast({ html: 'Deployment Unsuccessfully' });
        } else {
            document.getElementById('processList').innerHTML = '';
            getProcessesAsync().then(data => data.forEach(addProcess));
            M.toast({ html: 'Process deployed successfully' });
        }
    };

    request.open("POST", "http://localhost:8080/engine-rest/deployment/create");
    request.send(data);     
}

function copyToClipboard(id) {
    navigator.clipboard.writeText(id).then(() => M.toast({ html: 'Copied to Clipboard!' }));
}

async function addProcess(process) {
    let instanceCount =  await getInstanceCountAsync(process.id).then(count => {
        document.getElementById('processList').innerHTML +=
        '<li id="' + process.id + '" data-name="' + process.name + '" data-tenant="' + process.tenantId + '">' +
            '<div class="collapsible-header">' +
                '<i class="material-icons">settings</i>' + process.key + ' (' + count + (count === 1 ? ' instance' : ' instances') + ')<span class="new badge" data-badge-caption="v">' + process.version + '.</span>' +
            '</div>' +
            '<div class="collapsible-body">' +
                '<div class="row">' +
                    '<div class="col s6">' +
                        '<span> ' + process.id + ' </span><i class="tiny material-icons clickable" onclick="copyToClipboard(' + "'" + process.id + "'" + ');">content_copy</i>' +
                    '</div>' +
                    '<div class="col s6">' +
                        '<button class="btn-large waves-effect waves-light right" onclick="startProcessAsync(' + "'" + process.id + "'" + ');">Start<i class="material-icons right">play_arrow</i></button>' +
                    '</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col s6">' +
                        '<div class="file-field input-field">' +
                            '<div class="btn">' +
                                '<span>Model</span><input id="' + process.id + '-file" type="file">' +
                            '</div>' +
                            '<div class="file-path-wrapper">' +
                                '<input class="file-path validate" type="text">' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="col s6">' +
                        '<button class="btn waves-effect waves-light red lighten-2 right" onclick="deleteProcessAsync(' + "'" + process.id + "'" + ');">Delete<i class="material-icons right">delete</i></button>' +
                        '<button class="btn waves-effect waves-light right" onclick="updateProcessAsync(' + "'" + process.id + "'" + ');">Update<i class="material-icons right">build</i></button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</li>'
    })
}

(function () {
    const elems = document.querySelectorAll('.collapsible');
    const instances = M.Collapsible.init(elems);

    getProcessesAsync().then(data => data.forEach(addProcess));
})();