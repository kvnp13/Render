const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let productos = [
  { id: 1, nombre: "Laptop", precio: 1200 },
  { id: 2, nombre: "Mouse", precio: 25 },
];

// Obtener todos los productos
app.get("/productos", (req, res) => {
  res.json(productos);
});

// Obtener un producto por ID
app.get("/productos/:id", (req, res) => {
  const producto = productos.find((p) => p.id == req.params.id);
  producto ? res.json(producto) : res.status(404).send("No encontrado");
});

// Agregar un producto
app.post("/productos", (req, res) => {
  const nuevoProducto = { id: productos.length + 1, ...req.body };
  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

// Eliminar un producto
app.delete("/productos/:id", (req, res) => {
  productos = productos.filter((p) => p.id != req.params.id);
  res.status(204).send();
});

app.listen(PORT, () => console.log(`Servidor REST en http://localhost:${PORT}`));
