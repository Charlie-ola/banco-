
if (localStorage.getItem('saldoTotal') === null) {
    localStorage.setItem('saldoTotal', '1000000');
}

// NAVEGACIÓN 
function depositar() { window.location.href = "consignar.html"; }
function retirar() { window.location.href = "retirar.html"; }
function transferir() { window.location.href = "depositar.html"; }
function verDetalles() { window.location.href = "vertrans.html"; }
function irAHome() { window.location.href = "home.html"; }
function volver() { window.location.href = "Login.html"; }

// CARGAR DATOS EN EL HOME 
function cargarHome() {
    let nombre = localStorage.getItem('usuarioNombre') || "Usuario";
    let saldo = parseFloat(localStorage.getItem('saldoTotal'));

    // 
    if(document.getElementById('homeNombre')) document.getElementById('homeNombre').innerText = nombre;
    if(document.getElementById('navNombre')) document.getElementById('navNombre').innerText = nombre;

    //  Saldo Visual
    const balanceValue = document.getElementById('balanceValue');
    if (balanceValue) {
        balanceValue.textContent = `$${saldo.toLocaleString('es-CO')}`;
    }

    
    const hideBtn = document.getElementById('hideBtn');
    let isHidden = false;
    if (hideBtn && balanceValue) {
        hideBtn.onclick = function() {
            isHidden = !isHidden;
            balanceValue.textContent = isHidden ? '****,***' : `$${saldo.toLocaleString('es-CO')}`;
            hideBtn.innerHTML = isHidden ? '👁️' : '👁️‍🗨️';
        };
    }
}

// TRANSACCIONES ---

function actualizarSaldo(monto, operacion) {
    let saldoActual = parseFloat(localStorage.getItem('saldoTotal'));
    if (operacion === 'suma') {
        saldoActual += parseFloat(monto);
    } else {
        saldoActual -= parseFloat(monto);
    }
    localStorage.setItem('saldoTotal', saldoActual.toString());
}

function guardarTransaccion(tipo, monto, detalle) {
    let transacciones = JSON.parse(localStorage.getItem('misTransacciones')) || [];
    const nuevaTrans = {
        tipo: tipo,
        monto: monto,
        detalle: detalle,
        fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    };
    transacciones.unshift(nuevaTrans);
    localStorage.setItem('misTransacciones', JSON.stringify(transacciones));
}

//  FUNCIONES DE EJECUCIÓN 

function ejecutarConsignacion() {
    let monto = document.getElementById('amount').value;
    if (monto > 0) {
        actualizarSaldo(monto, 'suma'); 
        guardarTransaccion('positive', `+$${parseFloat(monto).toLocaleString()}`, 'Consignación realizada');
        alert("Consignación exitosa");
        irAHome();
    }
}

function ejecutarRetiro() {
    let monto = document.getElementById('amount').value;
    let saldoActual = parseFloat(localStorage.getItem('saldoTotal'));

    if (monto > 0 && monto <= saldoActual) {
        actualizarSaldo(monto, 'resta'); 
        guardarTransaccion('negative', `-$${parseFloat(monto).toLocaleString()}`, 'Retiro en Cajero');
        alert("Retiro exitoso");
        irAHome();
    } else {
        alert("Saldo insuficiente o monto inválido");
    }
}

function ejecutarTransferencia() {
    let monto = document.getElementById('amount').value;
    let cuenta = document.getElementById('destAccount').value;
    let saldoActual = parseFloat(localStorage.getItem('saldoTotal'));

    if (monto > 0 && monto <= saldoActual && cuenta !== "") {
        actualizarSaldo(monto, 'resta'); 
        guardarTransaccion('negative', `-$${parseFloat(monto).toLocaleString()}`, `Transferencia a ${cuenta}`);
        alert("Transferencia realizada");
        irAHome();
    } else {
        alert("Verifique el saldo o los datos de la cuenta");
    }
}

// MOSTRAR HISTORIAL 
function cargarPaginaTransacciones() {
    cargarHome(); 
    const contenedor = document.getElementById('listaTransacciones');
    let transacciones = JSON.parse(localStorage.getItem('misTransacciones')) || [];

    if (transacciones.length === 0) {
        contenedor.innerHTML = "<p style='text-align:center; padding:20px;'>No hay movimientos registrados.</p>";
        return;
    }

    contenedor.innerHTML = transacciones.map(t => `
        <div class="transaction-item" style="display:flex; justify-content:space-between; padding:15px; border-bottom:1px solid #eee;">
            <div>
                <strong>${t.detalle}</strong><br>
                <small style="color:gray;">${t.fecha}</small>
            </div>
            <span style="font-weight:bold; color: ${t.tipo === 'positive' ? '#28a745' : '#dc3545'};">
                ${t.monto}
            </span>
        </div>
    `).join('');
}