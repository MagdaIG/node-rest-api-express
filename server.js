const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let productos = [
  { id: 1, nombre: 'Laptop', precio: 1200, categoria: 'Electrónicos' },
  { id: 2, nombre: 'Mouse', precio: 25, categoria: 'Accesorios' },
  { id: 3, nombre: 'Teclado', precio: 50, categoria: 'Accesorios' }
];

let nextId = 4;

app.get('/productos', (req, res) => {
  try {
    const { categoria, precioMin, precioMax } = req.query;
    let productosFiltrados = [...productos];

    if (categoria) {
      productosFiltrados = productosFiltrados.filter(p => 
        p.categoria.toLowerCase() === categoria.toLowerCase()
      );
    }

    if (precioMin) {
      productosFiltrados = productosFiltrados.filter(p => 
        p.precio >= parseFloat(precioMin)
      );
    }

    if (precioMax) {
      productosFiltrados = productosFiltrados.filter(p => 
        p.precio <= parseFloat(precioMax)
      );
    }

    res.status(200).json({
      estado: 'exito',
      mensaje: 'Lista de productos obtenida correctamente',
      datos: {
        productos: productosFiltrados,
        total: productosFiltrados.length,
        parametrosRecibidos: {
          query: req.query,
          params: req.params
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      estado: 'error',
      mensaje: 'Error interno del servidor',
      error: error.message
    });
  }
});

app.post('/productos', (req, res) => {
  try {
    const { nombre, precio, categoria } = req.body;

    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({
        estado: 'error',
        mensaje: 'El nombre del producto es requerido y no puede estar vacío',
        codigo: 400
      });
    }

    if (!precio || precio <= 0) {
      return res.status(400).json({
        estado: 'error',
        mensaje: 'El precio es requerido y debe ser mayor a 0',
        codigo: 400
      });
    }

    if (!categoria || categoria.trim() === '') {
      return res.status(400).json({
        estado: 'error',
        mensaje: 'La categoría del producto es requerida',
        codigo: 400
      });
    }

    const nuevoProducto = {
      id: nextId++,
      nombre: nombre.trim(),
      precio: parseFloat(precio),
      categoria: categoria.trim()
    };

    productos.push(nuevoProducto);

    res.status(201).json({
      estado: 'exito',
      mensaje: 'Producto creado correctamente',
      datos: {
        producto: nuevoProducto,
        parametrosRecibidos: {
          body: req.body,
          query: req.query,
          params: req.params
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      estado: 'error',
      mensaje: 'Error interno del servidor al crear el producto',
      error: error.message
    });
  }
});

app.put('/productos/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, precio, categoria } = req.body;

    const productoIndex = productos.findIndex(p => p.id === id);

    if (productoIndex === -1) {
      return res.status(404).json({
        estado: 'error',
        mensaje: `Producto con ID ${id} no encontrado`,
        codigo: 404
      });
    }

    if (nombre !== undefined && nombre.trim() === '') {
      return res.status(400).json({
        estado: 'error',
        mensaje: 'El nombre del producto no puede estar vacío',
        codigo: 400
      });
    }

    if (precio !== undefined && precio <= 0) {
      return res.status(400).json({
        estado: 'error',
        mensaje: 'El precio debe ser mayor a 0',
        codigo: 400
      });
    }

    const productoActualizado = {
      ...productos[productoIndex],
      ...(nombre && { nombre: nombre.trim() }),
      ...(precio && { precio: parseFloat(precio) }),
      ...(categoria && { categoria: categoria.trim() })
    };

    productos[productoIndex] = productoActualizado;

    res.status(200).json({
      estado: 'exito',
      mensaje: 'Producto actualizado correctamente',
      datos: {
        producto: productoActualizado,
        parametrosRecibidos: {
          params: req.params,
          body: req.body,
          query: req.query
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      estado: 'error',
      mensaje: 'Error interno del servidor al actualizar el producto',
      error: error.message
    });
  }
});

app.delete('/productos/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const productoIndex = productos.findIndex(p => p.id === id);

    if (productoIndex === -1) {
      return res.status(404).json({
        estado: 'error',
        mensaje: `Producto con ID ${id} no encontrado`,
        codigo: 404
      });
    }

    const productoEliminado = productos.splice(productoIndex, 1)[0];

    res.status(200).json({
      estado: 'exito',
      mensaje: 'Producto eliminado correctamente',
      datos: {
        productoEliminado: productoEliminado,
        parametrosRecibidos: {
          params: req.params,
          query: req.query
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      estado: 'error',
      mensaje: 'Error interno del servidor al eliminar el producto',
      error: error.message
    });
  }
});

app.get('/productos/parametros/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { categoria, orden } = req.query;

    res.status(200).json({
      estado: 'exito',
      mensaje: 'Ejemplo de ruta con parámetros',
      datos: {
        parametrosUrl: {
          id: id,
          tipo: 'req.params'
        },
        parametrosQuery: {
          categoria: categoria,
          orden: orden,
          tipo: 'req.query',
          todosLosQuery: req.query
        },
        informacion: 'Esta ruta demuestra el uso de parámetros en la URL (params) y query string (query)'
      }
    });
  } catch (error) {
    res.status(500).json({
      estado: 'error',
      mensaje: 'Error interno del servidor',
      error: error.message
    });
  }
});

app.post('/productos/parametros', (req, res) => {
  try {
    const { nombre, precio } = req.body;
    const { categoria } = req.query;

    res.status(200).json({
      estado: 'exito',
      mensaje: 'Ejemplo de ruta que procesa parámetros del cuerpo y query string',
      datos: {
        parametrosBody: {
          nombre: nombre,
          precio: precio,
          tipo: 'req.body',
          todosLosBody: req.body
        },
        parametrosQuery: {
          categoria: categoria,
          tipo: 'req.query',
          todosLosQuery: req.query
        },
        informacion: 'Esta ruta demuestra el uso de parámetros en el cuerpo de la petición (body) y query string (query)'
      }
    });
  } catch (error) {
    res.status(500).json({
      estado: 'error',
      mensaje: 'Error interno del servidor',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor REST funcionando en http://localhost:${PORT}`);
  console.log(`Endpoints disponibles:`);
  console.log(`  GET    /productos`);
  console.log(`  POST   /productos`);
  console.log(`  PUT    /productos/:id`);
  console.log(`  DELETE /productos/:id`);
  console.log(`  GET    /productos/parametros/:id`);
  console.log(`  POST   /productos/parametros`);
});

