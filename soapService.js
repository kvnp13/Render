const soap = require("soap");
const http = require("http");

// Lista de productos
const productos = [
  { id: 1, nombre: "Laptop", precio: 1200 },
  { id: 2, nombre: "Mouse", precio: 25 },
];

// Definición del servicio SOAP
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
      <soap:address location="http://0.0.0.0:${process.env.PORT || 4000}/soap"/>
    </port>
  </service>
</definitions>

`;

// Crear servidor HTTP
const server = http.createServer((req, res) => {});

// Configurar y iniciar el servidor SOAP
const port = process.env.PORT || 10000;
server.listen(PORT, "0.0.0.0", () => {
    soap.listen(server, "/soap", servicio, xml);
    console.log(`Servicio SOAP disponible en http://0.0.0.0:${PORT}/soap`);
  });
