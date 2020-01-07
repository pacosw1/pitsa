exports.clientes = [
  {
    type: "input",
    name: "Empresa",
    placeholder: "Empresa"
  },
  {
    type: "select",
    name: "Vendedor",
    route: "vendedores",
    placeholder: "Vendedor"
  },
  {
    type: "input",
    name: "Calle",
    placeholder: "Calle"
  },
  {
    type: "input",
    name: "Colonia",
    placeholder: "Colonia"
  },
  {
    type: "input",
    name: "Planta",
    placeholder: "Planta"
  },
  {
    type: "input",
    name: "NumProvedor",
    placeholder: " # Provedor"
  },
  {
    type: "input",
    name: "Ciudad",
    placeholder: "Ciudad"
  },
  {
    type: "input",
    name: "Estado",
    placeholder: "Estado"
  },
  {
    type: "input",
    name: "CP",
    placeholder: "Codigo Postal"
  },
  {
    type: "input",
    name: "Telefono",
    placeholder: "Telefono"
  },
  {
    type: "input",
    name: "RFC",
    placeholder: "RFC"
  },
  {
    type: "input",
    name: "Pais",
    placeholder: "Pais"
  }
  // {
  //   type: "select",
  //   name: "Status",
  //   route: undefined,
  //   placeholder: "Status"
  // }
];

exports.vendedores = [
  { name: "Nombre", type: "input", placeholder: "Nombre" },
  { name: "Zona", type: "input", placeholder: "Zona" },
  { type: "input", name: "Telefono", placeholder: "Telefono" }
];
exports.parametros = ["Descripcion", "Precio"];
exports.unidades = [
  { name: "Unidad", placeholder: "Unidad", type: "input" },
  { name: "Descripcion", type: "input", placeholder: "descripcion" }
];

exports.cotizaciones = [
  { name: "Folio", placeholder: "Folio", type: "input" },
  { name: "Fecha", placeholder: "Fecha", type: "input" },
  {
    name: "Cliente",
    placeholder: "Cliente",
    type: "select",
    route: "clientes"
  },
  {
    name: "Status",
    placeholder: "Estatus",
    type: "select",
    route: "status",
    isStatic: true
  },
  { name: "Planta", placeholder: "Planta", type: "input" },
  { name: "Concepto", placeholder: "Concepto", type: "input" },
  { name: "Total", placeholder: "Total", type: "input" }
];
exports.proovedores = [
  "RazonSocial",
  "Direccion",
  "Colonia",
  "Poblacion",
  "Estado",
  "Telefono",
  "RFC",
  "Atencion",
  "Fax",
  "Vendedor",
  "Status",
  "CP"
];

exports.status = [
  { value: 0, placeholder: "Cancelada por Cliente" },
  { value: 1, placeholder: "En proceso" },
  { value: 2, placeholder: "Perdida" },
  { value: 3, placeholder: "Aprobada" }
];
