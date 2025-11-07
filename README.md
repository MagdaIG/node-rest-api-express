# Servidor REST Funcional

Servidor REST implementado con Express.js para la gestión de productos, que demuestra el uso de diferentes verbos HTTP, manejo de parámetros, códigos de estado y buenas prácticas en el desarrollo de APIs.

## Cómo hacerlo funcionar

### Requisitos previos

- Node.js instalado (versión 14 o superior)
- npm (viene incluido con Node.js)

### Instalación

1. Clonar o descargar el proyecto
2. Abrir una terminal en la carpeta del proyecto
3. Instalar las dependencias:

```bash
npm install
```

### Ejecución

Para iniciar el servidor:

```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000`

### Probar los endpoints

Puedes usar herramientas como:
- Postman
- cURL
- Thunder Client (extensión de VS Code)
- Insomnia

Ejemplos con cURL:

```bash
# GET - Obtener todos los productos
curl http://localhost:3000/productos

# GET - Obtener productos con filtros (query string)
curl "http://localhost:3000/productos?categoria=Accesorios&precioMin=20"

# POST - Crear un nuevo producto
curl -X POST http://localhost:3000/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Monitor","precio":300,"categoria":"Electrónicos"}'

# PUT - Actualizar un producto
curl -X PUT http://localhost:3000/productos/1 \
  -H "Content-Type: application/json" \
  -d '{"precio":1100}'

# DELETE - Eliminar un producto
curl -X DELETE http://localhost:3000/productos/1
```

## Endpoints disponibles

### GET /productos
Obtiene la lista de productos. Soporta filtros mediante query string:
- `categoria`: Filtra por categoría
- `precioMin`: Precio mínimo
- `precioMax`: Precio máximo

**Respuesta exitosa (200 OK):**
```json
{
  "estado": "exito",
  "mensaje": "Lista de productos obtenida correctamente",
  "datos": {
    "productos": [...],
    "total": 3
  }
}
```

### POST /productos
Crea un nuevo producto. Requiere en el body:
- `nombre` (requerido, no vacío)
- `precio` (requerido, mayor a 0)
- `categoria` (requerido, no vacío)

**Respuesta exitosa (201 Created):**
```json
{
  "estado": "exito",
  "mensaje": "Producto creado correctamente",
  "datos": {
    "producto": {...}
  }
}
```

**Respuesta de error (400 Bad Request):**
```json
{
  "estado": "error",
  "mensaje": "El nombre del producto es requerido y no puede estar vacío",
  "codigo": 400
}
```

### PUT /productos/:id
Actualiza un producto existente. El ID se pasa como parámetro en la URL. Los campos en el body son opcionales.

**Respuesta exitosa (200 OK):**
```json
{
  "estado": "exito",
  "mensaje": "Producto actualizado correctamente",
  "datos": {
    "producto": {...}
  }
}
```

**Respuesta de error (404 Not Found):**
```json
{
  "estado": "error",
  "mensaje": "Producto con ID X no encontrado",
  "codigo": 404
}
```

### DELETE /productos/:id
Elimina un producto según su ID.

**Respuesta exitosa (200 OK):**
```json
{
  "estado": "exito",
  "mensaje": "Producto eliminado correctamente",
  "datos": {
    "productoEliminado": {...}
  }
}
```

### GET /productos/parametros/:id
Ejemplo de ruta que demuestra el uso de parámetros en la URL (req.params) y query string (req.query).

### POST /productos/parametros
Ejemplo de ruta que demuestra el uso de parámetros en el cuerpo de la petición (req.body) y query string (req.query).

## Códigos de estado HTTP

### Rangos de códigos HTTP

Los códigos de estado HTTP se dividen en cinco rangos principales:

#### 1xx - Informacionales
Indican que la petición fue recibida y el proceso continúa. Ejemplos:
- 100 Continue: El servidor ha recibido los headers y el cliente debe continuar enviando el cuerpo.

#### 2xx - Exitosos
Indican que la petición fue recibida, entendida y procesada correctamente. Ejemplos:
- 200 OK: La petición fue exitosa.
- 201 Created: El recurso fue creado exitosamente (usado en POST).

#### 3xx - Redirección
Indican que se necesita una acción adicional para completar la petición. Ejemplos:
- 301 Moved Permanently: El recurso se movió permanentemente.
- 302 Found: Redirección temporal.

#### 4xx - Error del cliente
Indican que hubo un error en la petición del cliente. Ejemplos:
- 400 Bad Request: La petición tiene sintaxis incorrecta o parámetros inválidos.
- 404 Not Found: El recurso solicitado no existe.

#### 5xx - Error del servidor
Indican que el servidor falló al procesar una petición válida. Ejemplos:
- 500 Internal Server Error: Error genérico del servidor.

### Códigos implementados en este servidor

- **200 OK**: Usado en GET, PUT y DELETE exitosos
- **201 Created**: Usado en POST cuando se crea un producto exitosamente
- **400 Bad Request**: Usado cuando faltan datos requeridos o son inválidos (nombre vacío, precio inválido, etc.)
- **404 Not Found**: Usado cuando se intenta acceder, actualizar o eliminar un producto que no existe
- **500 Internal Server Error**: Usado cuando ocurre un error inesperado en el servidor

## Preguntas y respuestas

### ¿En qué casos se utiliza cada tipo de petición HTTP?

**GET**: Se utiliza para obtener o consultar recursos sin modificar el estado del servidor. Es una operación de solo lectura. Ejemplo: Obtener la lista de productos, buscar un producto específico.

**POST**: Se utiliza para crear nuevos recursos en el servidor. Es una operación que modifica el estado del servidor agregando nuevos datos. Ejemplo: Crear un nuevo producto, registrar un usuario.

**PUT**: Se utiliza para actualizar un recurso existente de manera completa o parcial. Si el recurso no existe, puede crearlo (dependiendo de la implementación). Ejemplo: Actualizar los datos de un producto existente.

**DELETE**: Se utiliza para eliminar un recurso existente del servidor. Ejemplo: Eliminar un producto de la base de datos.

**PATCH**: (No implementado en este proyecto) Se utiliza para actualizaciones parciales de un recurso, similar a PUT pero solo modifica los campos especificados.

### ¿Cómo debe estructurarse un endpoint según la operación?

La estructura de un endpoint REST debe seguir convenciones claras:

**GET (Lectura)**:
- Formato: `GET /recurso` o `GET /recurso/:id`
- No debe modificar datos
- Puede usar query strings para filtros: `GET /productos?categoria=Electrónicos`
- Respuesta: 200 OK con los datos solicitados

**POST (Creación)**:
- Formato: `POST /recurso`
- Recibe datos en el cuerpo de la petición (req.body)
- Crea un nuevo recurso
- Respuesta: 201 Created con el recurso creado

**PUT (Actualización)**:
- Formato: `PUT /recurso/:id`
- Recibe el ID en la URL (req.params) y los datos a actualizar en el cuerpo (req.body)
- Actualiza el recurso completo o parcialmente
- Respuesta: 200 OK con el recurso actualizado, o 404 si no existe

**DELETE (Eliminación)**:
- Formato: `DELETE /recurso/:id`
- Recibe el ID en la URL (req.params)
- Elimina el recurso especificado
- Respuesta: 200 OK con confirmación, o 404 si no existe

**Buenas prácticas**:
- Usar nombres de recursos en plural: `/productos` en lugar de `/producto`
- Usar sustantivos, no verbos: `/productos` en lugar de `/obtenerProductos`
- Mantener URLs jerárquicas y lógicas
- Usar códigos de estado HTTP apropiados
- Retornar respuestas en formato JSON consistente

### ¿Cuál fue el mayor reto en la creación de este servidor?

El mayor reto fue implementar un manejo robusto de errores y validaciones que garantizara que el servidor respondiera correctamente en todos los escenarios posibles. Esto incluyó:

1. **Validación de datos**: Asegurar que todos los campos requeridos estén presentes y sean válidos antes de procesar la petición. Por ejemplo, validar que el nombre no esté vacío, que el precio sea un número positivo, etc.

2. **Manejo de casos límite**: Gestionar situaciones como intentar actualizar o eliminar un producto que no existe, lo cual requiere verificar la existencia del recurso antes de realizar la operación.

3. **Códigos de estado apropiados**: Seleccionar y usar los códigos HTTP correctos según el contexto de cada operación (201 para creación, 400 para errores de validación, 404 para recursos no encontrados, 500 para errores del servidor).

4. **Estructura de respuestas consistente**: Mantener un formato JSON uniforme en todas las respuestas, tanto en casos de éxito como de error, para facilitar el consumo de la API por parte del cliente.

5. **Procesamiento de diferentes tipos de parámetros**: Implementar correctamente el manejo de parámetros en la URL (req.params), query string (req.query) y cuerpo de la petición (req.body), asegurándose de que cada tipo se use en el contexto adecuado.

## Pruebas realizadas

Realicé una serie de pruebas exhaustivas para verificar que todos los endpoints funcionan correctamente. A continuación, detallo las pruebas que ejecuté:

### Prueba 1: GET /productos (sin filtros)
Probé obtener la lista completa de productos sin aplicar ningún filtro. El servidor respondió correctamente con código 200 OK, devolviendo los 3 productos iniciales (Laptop, Mouse y Teclado) junto con la información de parámetros recibidos.

### Prueba 2: GET /productos con query string
Verifiqué el funcionamiento de los filtros mediante query string. Probé filtrar por categoría "Accesorios" y el servidor devolvió correctamente solo los productos que pertenecen a esa categoría (Mouse y Teclado), confirmando que el filtrado funciona adecuadamente.

### Prueba 3: POST /productos (crear producto válido)
Creé un nuevo producto llamado "Monitor" con precio 300 y categoría "Electrónicos". El servidor respondió con código 201 Created y devolvió el producto creado con un ID asignado automáticamente (ID 4). La respuesta incluyó todos los parámetros recibidos tanto del body como de query y params.

### Prueba 4: POST /productos (error - validación)
Probé crear un producto con nombre vacío para verificar que las validaciones funcionan correctamente. El servidor respondió con código 400 Bad Request y un mensaje de error claro indicando que el nombre es requerido y no puede estar vacío, confirmando que las validaciones están implementadas correctamente.

### Prueba 5: PUT /productos/:id (actualizar producto existente)
Actualicé el precio del producto con ID 1 (Laptop) de 1200 a 1150. El servidor respondió con código 200 OK y devolvió el producto actualizado con el nuevo precio, manteniendo los demás campos sin cambios.

### Prueba 6: PUT /productos/:id (error - producto no encontrado)
Intenté actualizar un producto con ID 999 que no existe. El servidor respondió correctamente con código 404 Not Found y un mensaje indicando que el producto no fue encontrado, validando el manejo de errores para recursos inexistentes.

### Prueba 7: DELETE /productos/:id (eliminar producto)
Eliminé el producto con ID 2 (Mouse). El servidor respondió con código 200 OK y devolvió la información del producto eliminado, confirmando que la eliminación se realizó correctamente.

### Prueba 8: DELETE /productos/:id (error - producto no encontrado)
Intenté eliminar un producto con ID 999 que no existe. El servidor respondió con código 404 Not Found, validando nuevamente el manejo de errores para operaciones sobre recursos inexistentes.

### Prueba 9: GET /productos/parametros/:id (ejemplo de parámetros)
Probé la ruta de ejemplo que demuestra el uso de parámetros en la URL (req.params) y query string (req.query). Envié una petición a `/productos/parametros/5?categoria=Test&orden=asc` y el servidor devolvió correctamente ambos tipos de parámetros, mostrando cómo se procesan req.params y req.query simultáneamente.

### Prueba 10: POST /productos/parametros (ejemplo de body y query)
Probé la ruta de ejemplo que demuestra el uso de parámetros en el cuerpo de la petición (req.body) y query string (req.query). Envié una petición POST con datos en el body (nombre y precio) y un parámetro en la query string (categoria). El servidor procesó y devolvió correctamente ambos tipos de parámetros, confirmando que el manejo de req.body y req.query funciona adecuadamente.

### Prueba 11: Verificación del estado después de cambios
Realicé una petición GET final para verificar el estado de los productos después de todas las operaciones. Confirmé que:
- El producto con ID 1 (Laptop) tenía el precio actualizado a 1150
- El producto con ID 2 (Mouse) había sido eliminado correctamente
- El producto con ID 4 (Monitor) había sido creado exitosamente
- El producto con ID 3 (Teclado) permanecía sin cambios

### Resultado de las pruebas
Todas las pruebas fueron exitosas. El servidor responde correctamente a todas las peticiones, maneja adecuadamente los diferentes tipos de parámetros (params, query, body), implementa validaciones apropiadas, devuelve los códigos de estado HTTP correctos según cada situación, y mantiene la consistencia en el formato de las respuestas JSON. El servidor está completamente funcional y listo para su uso.

## Estructura del proyecto

```
servidor-rest-funcional/
├── server.js          # Archivo principal del servidor
├── package.json       # Configuración y dependencias del proyecto
└── README.md          # Este archivo
```

## Tecnologías utilizadas

- Node.js
- Express.js

## Autor

**Magdalena Inalaf**

- GitHub: [@MagdaIG](https://github.com/MagdaIG)
- LinkedIn: [minalaf](https://www.linkedin.com/in/minalaf/)
- Página web: [inalaf.ca](https://inalaf.ca/)
- Email: magda.inalaf@gmail.com

