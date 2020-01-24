let Joi = require("@hapi/joi");

exports.clientesSchema = Joi.object({
  __v: Joi.number(),
  _id: Joi.string(),
  // Status: Joi.number(),
  Vendedor: Joi.string()
    .alphanum()
    .length(24)
    .required(),
  Empresa: Joi.string()
    .min(3)
    .max(100)
    .required(),
  Direccion: Joi.string()
    .min(3)
    .max(100)
    .required(),
  ID: Joi.string(),
  Planta: Joi.string()
    .min(3)
    .max(20)
    .required(),
  NumProvedor: Joi.string()
    .min(1)
    .max(20),

  // Ciudad: Joi.string()
  //   .min(3)
  //   .max(20)
  //   .required(),

  // Estado: Joi.string()
  //   .min(3)
  //   .max(20)
  //   .required(),

  // CP: Joi.number()
  //   .min(10000)
  //   .max(99999)
  //   .required(),
  // Telefono: Joi.string(),

  // RFC: Joi.string()
  //   .alphanum()
  //   .max(20)
  //   .required(),

  Pais: Joi.string()
    .min(2)
    .max(20)
    .required()
});

exports.cotizSchema = Joi.object({
  ID: Joi.number(),
  __v: Joi.number(),
  _id: Joi.string(),

  Fecha: Joi.date().required(),
  Concepto: Joi.string()
    .min(3)
    .max(30)
    .required(),
  // Total: Joi.number()
  //   .min(0)
  //   .required(),
  Cliente: Joi.object().required(),
  Vendedor: Joi.string()
    .length(24)
    .required(),
  Status: Joi.number()
    .min(0)
    .max(5)
    .required()
});

exports.ordenSchema = Joi.object({
  __v: Joi.number(),
  _id: Joi.string(),
  ID: Joi.number(),
  Parts: Joi.array(),
  Status: Joi.number()
    .min(0)
    .max(2)
    .required(),

  Pedido: Joi.string()
    .min(1)
    .max(20)
    .required(),
  Moneda: Joi.string()
    .length(3)
    .required(),
  CotID: Joi.number().required(),
  Encargado: Joi.string()
    .min(1)
    .max(20)
    .required(),
  Concepto: Joi.string()
    .min(1)
    .max(20)
    .required(),
  Fecha: Joi.date().required(),
  Entrega: Joi.date().required(),
  CondPago: Joi.string().required(),
  Planta: Joi.number()
    .min(0)
    .max(1)
    .required(),
  Cliente: Joi.object().required(),
  Dossier: Joi.number().required(),
  Vendedor: Joi.string()
    .length(24)
    .required(),
  IVA: Joi.number()
    .min(0)
    .max(100)
    .required(),
  Importe: Joi.number().required(),

  Enviar: {
    Cliente: Joi.string()
      .min(3)

      .required(),
    Direccion: Joi.string()
      .min(3)

      .required()
  }
});

exports.remShcmea = Joi.object({
  __v: Joi.number(),
  _id: Joi.string(),
  ID: Joi.number(),
  Parts: Joi.array(),
  Pedido: Joi.string()
    .min(1)
    .max(20)
    .required(),
  Moneda: Joi.string()
    .length(3)
    .required(),
  OT: Joi.object().required(),

  Concepto: Joi.string()
    .min(1)
    .max(20)
    .required(),
  Fecha: Joi.date().required(),
  Planta: Joi.number()
    .min(0)
    .max(1)
    .required(),
  Cliente: Joi.object().required(),

  Vendedor: Joi.string()
    .length(24)
    .required(),

  Importe: Joi.number().required(),

  Enviar: {
    Cliente: Joi.string()
      .min(3)

      .required(),
    Direccion: Joi.string()
      .min(3)
      .required()
  }
});

exports.vendedorSchema = Joi.object({
  __v: Joi.number(),
  _id: Joi.string(),
  Nombre: Joi.string()
    .min(1)
    .max(20)
    .required(),
  Zona: Joi.string()
    .min(4)
    .max(20)
    .required(),
  Telefono: Joi.string()
    .min(10)
    .max(20)
    .required()
});

exports.remisiones = [
  { name: "ID", placeholder: "Folio" },

  { placeholder: "Fecha", name: "Fecha" },
  {
    placeholder: "Cliente",
    name: "Cliente"
  },
  { type: "input", placeholder: "Importe", name: "Importe" },
  { type: "input", placeholder: "Pedido", name: "Pedido" },
  { type: "input", placeholder: "Concepto", name: "Concepto" }
];
exports.clientes = [
  {
    type: "input",
    name: "Empresa",
    placeholder: "Empresa"
  },
  { type: "input", name: "ID", placeholder: "Folio" },
  {
    type: "select",
    name: "Vendedor",
    route: "vendedores",
    placeholder: "Vendedor"
  },
  // {
  //   type: "input",
  //   name: "Calle",
  //   placeholder: "Calle"
  // },
  // {
  //   type: "input",
  //   name: "Colonia",
  //   placeholder: "Colonia"
  // },
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
  // {
  //   type: "input",
  //   name: "Ciudad",
  //   placeholder: "Ciudad"
  // },
  // {
  //   type: "input",
  //   name: "Estado",
  //   placeholder: "Estado"
  // },
  // {
  //   type: "input",
  //   name: "CP",
  //   placeholder: "Codigo Postal"
  // },
  // {
  //   type: "input",
  //   name: "Telefono",
  //   placeholder: "Telefono"
  // },
  // {
  //   type: "input",
  //   name: "RFC",
  //   placeholder: "RFC"
  // },
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

exports.ordenes = [
  { name: "ID", placeholder: "Folio" },

  { type: "input", placeholder: "Fecha", name: "Fecha" },
  {
    type: "select",
    placeholder: "Cliente",
    name: "Cliente",
    route: "clientes"
  },
  { type: "input", placeholder: "Importe", name: "Importe" },
  { type: "input", placeholder: "Pedido", name: "Pedido" },
  { type: "input", placeholder: "Concepto", name: "Concepto" },
  { type: "input", placeholder: "Condiciones", name: "CondPago" },
  { type: "input", placeholder: "Fecha Limite", name: "Entrega" }

  // {
  //   type: "select",
  //   placeholder: "vendedor",
  //   name: "Vendedor",
  //   route: "vendedores"
  // }
];

exports.cotizaciones = [
  { name: "ID", placeholder: "Folio" },
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
  { name: "Concepto", placeholder: "Concepto", type: "input" }
  // { name: "V", placeholder: "Total", type: "input" }
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
