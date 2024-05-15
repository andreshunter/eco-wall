function limpiarCampos() {
    $('#txt_correo').val('');
    $('#txt_password').val('');
    $('#txt_nombre').val('');
    $('#txt_apellido').val('');
}

$(document).ready(function () {
    //REGISTRA CORREO
    $('#btn_registrar').click(function () {
        let mail = $('#txt_correo').val()
        let pass = $('#txt_password').val()
        let nombre = $('#txt_nombre').val()
        let apellido = $('#txt_apellido').val()


        let url = "https://programadormaldito.cl/route/usuario_duoc_almacenar"

        let datos = {
            mail: mail,
            pass: pass,
            nombre: nombre,
            apellido: apellido
        }

        $.ajax({
            url: url,
            type: "POST", //POST es para enviar informacion a la api // GET es para obtener la informacion
            contentType: "application/json",
            data: JSON.stringify(datos),

            success: function (response) {
                console.log(response)
                limpiarCampos();

            },
            error: function (status, error) {
                console.log(error + " " + status)
                limpiarCampos();
            }
        })
    })

    //INICIO DE SESION -- LOGIN

    $('#btn_ingresar').click(function () {
        let mail = $('#txt_mail').val()
        let pass = $('#txt_pass').val()


        let url = "https://programadormaldito.cl/route/usuario_duoc_login"

        let datos = {
            mail: mail,
            pass: pass
        }

        $.ajax({
            url: url,
            type: "POST", //POST es para enviar informacion a la api // GET es para obtener la informacion
            contentType: "application/json",
            data: JSON.stringify(datos),

            success: function (response) {
                if (response[0].RESPUESTA == "0") {
                    Swal.fire({
                        title: "Ingreso invalido",
                        text: "Correo y/o contraseña es invalido",
                        icon: "error",
                        confirmButtonText: "OK"
                    });

                } else {
                    localStorage.setItem('correo', mail);

                    Swal.fire({
                        title: "Ingreso correcto",
                        icon: "success",
                        confirmButtonText: "OK"
                    });
                    //redirecciona a crear_producto despues de 3 segundos
                    setTimeout(function () {
                        window.location.href = "crear_producto.html";
                    }, 3000);
                }
                console.log(response)
            },
            error: function (status, error) {
                console.log(error + " " + status)
            }
        })
    })

    // Navegar
    $('#btn_tienda').click(function () {
        window.location.href = "tienda.html";
    });

    $('#btn_index').click(function () {
        window.location.href = "index.html";
    });

    $('#btn_buscador').click(function () {
        window.location.href = "buscador.html";
    });

    $('#btn_producto_correo').click(function () {
        window.location.href = "productos_creados.html";
    });
    
    $('#btn_ingresar_productos').click(function () {
        window.location.href = "crear_producto.html";
    });

});


// Muestra al usuario logueado
function mostrarUsuarioLogueado() {
    const correo = localStorage.getItem('correo');
    /* Condiciones, si esta logueado oculta iniciar sesion y registrar
    a la vez muestra usuario logueado + boton cerrar sesion */
    if (correo) {
        $('.nav-item.login').html(`<div class="d-flex"> 
        <button type="button" class="btn btn-dark">
        <i class="bi bi-person-circle"></i> ${correo} </button>
        <span style="margin-right: 5px;"></span> 
        <button id="btn_cerrar_sesion" type="button" class="btn btn-success">
        <i class="bi bi-box-arrow-right"></i> Cerrar Sesión</button>
        </div> `);
        $('.nav-item.registro').hide();
    } else {
        //Si no esta logueado muestra iniciar sesion y registrar en caso que este eliminado
        $('.nav-item.registro').show();
    }
};





function limpiarCamposProducto() {
    $('#txt_codigo').val('');
    $('#txt_nombre').val('');
    $('#txt_descripcion').val('');
    $('#txt_precio').val('');
}

//INGRESA EL CORREO EN CREAR PRODUCTO
function asignarCorreoProducto() {
    const correo = localStorage.getItem('correo');
    if (correo) {
        $('#txt_correo').val(correo);
    }
}

//PERMITE QUE NO SE BORRE EL CORREO Y QUEDE FIJO
$(document).ready(function () {
    const correo = localStorage.getItem('correo');
    if (correo) {
        $('#txt_correo').val(correo).attr('readonly', true);
    }
});

//INGRESO DE PRODUCTOS

function almacenarProducto() {
    let codigo = $('#txt_codigo').val();
    let nombre = $('#txt_nombre').val();
    let descripcion = $('#txt_descripcion').val();
    let precio = parseFloat($('#txt_precio').val()); // parseFloat pasa los datos a decimal, parseInt pasa los datos a entero
    let correo = $('#txt_correo').val();

    let url = 'https://programadormaldito.cl/route/producto_duoc_almacenar';

    let producto = {
        codigo: codigo,
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        mail: correo
    }

    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(producto),
        success: function (response) {
            console.log(response);
            if (response[0].RESPUESTA === "OK") {
                Swal.fire({
                    title: "Información",
                    text: "Producto almacenado correctamente",
                    icon: "success",
                    confirmButtonText: "OK"
                });
                limpiarCamposProducto();
            } else if (response[0].RESPUESTA === "NOK") {
                Swal.fire({
                    title: "Error",
                    text: "El código de producto ya existe en la base de datos",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Hubo un error al almacenar el producto",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
        },
        error: function (status, error) {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: "Hubo un error al almacenar el producto",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    });
};

// BUSCADOR DE PRODUCTOS UTILIZAR EL DATATABLE

let dataTable;
let dataTableInitialized = false;

const dataTableOptions = {
    pageLength: 50, // Si queremos mostrar mas o menos productos cambiamos el valor
    destroy: true,
    language: {
        lengthMenu: "Mostrar _MENU_ productos por página",
        zeroRecords: "No se ha encontrado ningún producto",
        info: "Mostrando de _START_ a _END_ productos de un total de _TOTAL_ productos",
        infoEmpty: "No se ha encontrado ningún producto",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar", //incluye el buscador el data table
        loadingRecords: "Cargando...",
        paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
        }
    }
};

//PARA QUE MUESTRE TODOS LOS PRODUCTOS

function cargarProductos() {
    let url = 'https://programadormaldito.cl/route/producto_duoc_obtener';

    $.ajax({
        url: url,
        type: 'GET',
        success: function (response) {
            console.log('Datos obtenidos:', response);

            // Verificar si la respuesta contiene al menos un array
            if (Array.isArray(response) && response.length > 0 && Array.isArray(response[0])) {
                let productos = response[0]; // Acceder al primer sub-array
                let tbody = $('#tabla_productos tbody');
                tbody.empty();

                productos.forEach((producto, index) => {
                    let fila = `<tr>
                        <td>${index + 1}</td>
                        <td>${producto.p_codigo}</td>
                        <td>${producto.p_nombre}</td>
                        <td>${producto.p_descripcion}</td>
                        <td>${producto.p_precio}</td>
                        <td>${producto.p_mail_creado}</td>
                    </tr>`;
                    tbody.append(fila);
                });

                // DataTable lo inicia y reinicia 
                if (!dataTableInitialized) {
                    dataTable = $('#tabla_productos').DataTable(dataTableOptions);
                    dataTableInitialized = true;
                } else {
                    dataTable.clear().rows.add($(tbody).find('tr')).draw();
                }
            } else {
                console.error('La respuesta no contiene los datos esperados');
                Swal.fire({
                    title: "Error",
                    text: "No se encontraron productos",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
        },
        error: function ( status, error) {
            console.error('Error en la petición AJAX:', error);
            Swal.fire({
                title: "Error",
                text: "Hubo un error al cargar los productos",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    });
}

//PARA QUE MUESSTRE LOS PRODUCTOS CREADOS POR EL CORREO

function cargarProductosPorCorreo() {
    let mailLogueado = localStorage.getItem('correo');
    let url = `https://programadormaldito.cl/route/producto_duoc_obtener_x_mail?mail=${mailLogueado}`;

    $.ajax({
        url: url,
        type: 'GET',
        success: function (response) {
            console.log('Datos obtenidos:', response);

            let tbody = $('#tabla_productos_correo tbody');
            tbody.empty();

            if (Array.isArray(response) && response.length > 0 && Array.isArray(response[0])) {
                response[0].forEach((producto, index) => {
                    let fila = `<tr>
                        <td>${index + 1}</td>
                        <td>${producto.p_codigo}</td>
                        <td>${producto.p_nombre}</td>
                        <td>${producto.p_descripcion}</td>
                        <td>${producto.p_precio}</td>
                        <td>${producto.p_mail_creado}</td>
                    </tr>`;
                    tbody.append(fila);
                });

                // Reinicializar DataTable
                $('#tabla_productos_correo').DataTable().destroy();
                $('#tabla_productos_correo').DataTable(dataTableOptions);
            } else {
                console.error('La respuesta no contiene los datos esperados');
                Swal.fire({
                    title: "Error",
                    text: "No se encontraron productos",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
        },
        error: function (status, error) {
            console.error('Error en la petición AJAX:', error);
            Swal.fire({
                title: "Error",
                text: "Hubo un error al cargar los productos",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    });
}


// Cuando esten cargados los datos ejecuta las funciones mostrarUsuarioLogueado cargarProductos y cargarProductosPorCorreo
$(document).ready(function () {
    mostrarUsuarioLogueado();

    cargarProductos();
    cargarProductosPorCorreo();

    //Elimina el usuario logueado y refresca la pagina
    $('#btn_cerrar_sesion').click(function () {
        localStorage.removeItem('correo'); //elimina el correo logueado del localstore
        mostrarUsuarioLogueado();
        location.reload(); //refresca la pagina
    });

});
