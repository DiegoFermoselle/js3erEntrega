document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("simuladorForm");
    const resultadoSection = document.getElementById("resultado");

    // Cargar datos guardados en localStorage (si es necesario)
    cargarDatosGuardados();

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        // Validar los campos
        if (!validarFormulario()) {
            mostrarError("Por favor, ingresa datos válidos.");
            return;
        }

        // Capturar valores del formulario
        const material = document.getElementById("material").value;
        const cantidad = parseFloat(document.getElementById("cantidad").value);
        const tiempo = parseFloat(document.getElementById("tiempo").value);
        const soporte = document.getElementById("soporte").checked;
        const acabado = document.getElementById("acabado").checked;

        // Realizar los cálculos
        const costoMaterial = calcularCostoMaterial(material, cantidad);
        const costoTiempo = calcularCostoTiempo(tiempo);
        const costoSoporte = soporte ? 10 : 0;
        const costoAcabado = acabado ? 15 : 0;
        const costoTotal = costoMaterial + costoTiempo + costoSoporte + costoAcabado;

        // Guardar datos en localStorage
        guardarDatos({ material, cantidad, tiempo, soporte, acabado, costoTotal });

        // Mostrar resultados en el DOM
        mostrarResultado(material, cantidad, tiempo, costoMaterial, costoTiempo, costoSoporte, costoAcabado, costoTotal);
    });

    function mostrarError(mensaje) {
        const errorDiv = document.getElementById("error");
        errorDiv.textContent = mensaje;
        errorDiv.style.display = "block";
    }

    function validarFormulario() {
        const material = document.getElementById("material").value;
        const cantidad = document.getElementById("cantidad").value;
        const tiempo = document.getElementById("tiempo").value;

        return material && cantidad > 0 && tiempo > 0;
    }

    function mostrarResultado(material, cantidad, tiempo, costoMaterial, costoTiempo, costoSoporte, costoAcabado, costoTotal) {
        resultadoSection.innerHTML = `
            <h2>Resultado</h2>
            <p><strong>Material:</strong> ${material}</p>
            <p><strong>Cantidad:</strong> ${cantidad} gramos</p>
            <p><strong>Tiempo:</strong> ${tiempo} horas</p>
            <p><strong>Costo de Material:</strong> $${costoMaterial.toFixed(2)}</p>
            <p><strong>Costo de Tiempo:</strong> $${costoTiempo.toFixed(2)}</p>
            <p><strong>Costo de Soporte:</strong> $${costoSoporte.toFixed(2)}</p>
            <p><strong>Costo de Acabado:</strong> $${costoAcabado.toFixed(2)}</p>
            <h3>Costo Total: $${costoTotal.toFixed(2)}</h3>
            <button id="nuevoPresupuesto">Solicitar otro presupuesto</button>
        `;
        resultadoSection.classList.add("show");

        document.getElementById("nuevoPresupuesto").addEventListener("click", () => {
            resultadoSection.classList.remove("show");
            form.reset();
            localStorage.removeItem('presupuestoActual');
        });
    }

    function calcularCostoMaterial(material, cantidad) {
        const precios = {
            PLA: 0.05,
            ABS: 0.07,
            PETG: 0.06
        };
        return precios[material] * cantidad;
    }

    function calcularCostoTiempo(tiempo) {
        const costoPorHora = 20; // Precio por hora de impresión
        return costoPorHora * tiempo;
    }

    function guardarDatos(presupuesto) {
        localStorage.setItem('presupuestoActual', JSON.stringify(presupuesto));
    }

    function cargarDatosGuardados() {
        const presupuestoGuardado = localStorage.getItem('presupuestoActual');
        if (presupuestoGuardado) {
            const datos = JSON.parse(presupuestoGuardado);
            mostrarResultado(
                datos.material, 
                datos.cantidad, 
                datos.tiempo, 
                calcularCostoMaterial(datos.material, datos.cantidad),
                calcularCostoTiempo(datos.tiempo),
                datos.soporte ? 10 : 0,
                datos.acabado ? 15 : 0,
                datos.costoTotal
            );
        }
    }
});
