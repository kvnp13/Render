const soap = require("soap");
const http = require("http");

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

const xml = `
<definitions name="ProductoService"
  xmlns="http://schemas.xmlsoap.org/wsdl/"
  xmlns:tns="http://example.com/producto"
  xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
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
      <soap:address location="http://localhost:4000/soap"/>
    </port>
  </service>
</definitions>
`;

const server = http.createServer((req, res) => {});
server.listen(4000, () => {
  soap.listen(server, "/soap", servicio, xml);
  console.log("Servicio SOAP disponible en http://localhost:4000/soap?wsdl");
});
