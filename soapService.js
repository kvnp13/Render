const http = require("http");
const soap = require("soap");

const productos = [
  { id: 1, nombre: "Laptop", precio: 1200 },
  { id: 2, nombre: "Mouse", precio: 25 },
];

const servicio = {
  ProductoService: {
    ProductoPort: {
      obtenerProducto: (args) => {
        return productos.find((p) => p.id == args.id) || { mensaje: "No encontrado" };
      },
    },
  },
};

// XML del WSDL
const xml = `
<definitions name="ProductoService"
  xmlns="http://schemas.xmlsoap.org/wsdl/"
  xmlns:tns="http://example.com/producto"
  xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  targetNamespace="http://example.com/producto">
  
  <message name="obtenerProductoRequest">
    <part name="id" type="xsd:int"/>
  </message>
  
  <message name="obtenerProductoResponse">
    <part name="nombre" type="xsd:string"/>
    <part name="precio" type="xsd:float"/>
  </message>
  
  <portType name="ProductoPort">
    <operation name="obtenerProducto">
      <input message="tns:obtenerProductoRequest"/>
      <output message="tns:obtenerProductoResponse"/>
    </operation>
  </portType>
  
  <binding name="ProductoBinding" type="tns:ProductoPort">
    <soap:binding style="rpc" transport="http://schemas.xmlsoap.org/soap/http"/>
    <operation name="obtenerProducto">
      <soap:operation soapAction="obtenerProducto"/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
    </operation>
  </binding>
  
  <service name="ProductoService">
    <port name="ProductoPort" binding="tns:ProductoBinding">
      <soap:address location="https://render-1-z54t.onrender.com/soap"/>
    </port>
  </service>
</definitions>
`;

const PORT = process.env.PORT || 4000; // Asegurar que PORT no esté vacío

// Crear el servidor HTTP correctamente manejando solicitudes
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Servidor SOAP corriendo correctamente\n");
});

// Hacer que el servicio SOAP escuche correctamente
server.listen(PORT, "0.0.0.0", () => {
  soap.listen(server, "/soap", servicio, xml);
  console.log(`Servicio SOAP disponible en http://0.0.0.0:${PORT}/soap`);
});
