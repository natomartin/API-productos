import express from 'express';
import fs, { read, writeFileSync } from "fs";
import bodyParser from "body-parser";

const app = express()
app.use(bodyParser.json())

const readData= () =>{
    try{
        const data = fs.readFileSync("./db.json");
        return (JSON.parse(data))
    }catch(error){
        console.log(error)
    }
};
const writeData = (data) =>{
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error) {
        console.log(error)
    }
}

app.get("/", (req,res)=>{
    res.send("API Productos!")
});

app.get("/productos/list",(req, res)=>{
    const data=readData();
    res.json(data.productos)
});

app.get("/productos/searchById/:id",(req, res)=>{
    const data=readData();
    const id=parseInt(req.params.id);
    const producto = data.productos.find((producto) => producto.id===id);
    res.json(producto);
});

app.post("/productos/new", (req, res) => {
    const data = readData();
    const body = req.body;
    const maxId = data.productos.length > 0 ? Math.max(...data.productos.map(p => p.id)) : 0;
    const newProducto = {
        id: maxId + 1,
        nombre: body.nombre,
        precio: body.precio,
        stock: body.stock,
        descripcion: body.descripcion
    };
    data.productos.push(newProducto);
    writeData(data, res);
    res.json(newProducto);
});


app.put("/productos/update/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const productoIndex = data.productos.findIndex((producto) => producto.id === id);

    if (productoIndex !== -1) {
        data.productos[productoIndex] = {
            ...data.productos[productoIndex],
            ...body,
        };
        writeData(data);
        res.json({ message: "Producto actualizado correctamente" });
    } else {
        res.status(404).json({ message: "Producto no encontrado" });
    }
});



app.delete("/productos/delete/:id", (req,res)=>{
    const data=readData();
    const id=parseInt(req.params.id);
    const productoIndex=data.productos.findIndex((producto)=>producto.id===id);
    data.productos.splice(productoIndex, 1);
    writeData(data);
    res.json({message:"Si"})
});

app.listen(3000, ()=> {
    console.log('Server listening on port 3000')
})

