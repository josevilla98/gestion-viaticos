import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import logocmi from "../Imagenes/Logocmi.png"; // 👈 tu logo

// 🎨 Estilos
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 40,
  },
  section: {
    marginBottom: 10,
  },
  titulo: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  table: {
    display: "table",
    width: "auto",
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    border: "1px solid #000",
    padding: 4,
    flexGrow: 1,
    fontSize: 10,
  },
});

const ReportPDF = ({ datos, dias }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text>Reporte de Gastos</Text>
        <Image src={logocmi} style={styles.logo} />
      </View>

      {/* DATOS GENERALES */}
      <View style={styles.section}>
        <Text style={styles.titulo}>Datos Generales</Text>
        <Text>Fecha inicio: {datos.fechaInicio}</Text>
        <Text>Kilometraje inicial: {datos.kmInicio}</Text>
        <Text>Kilometraje final: {datos.kmFinal}</Text>
        <Text>Carro: {datos.carro}</Text>
        <Text>Distribuidoras: {datos.distribuidorasSeleccionadas?.join(", ")}</Text>
        <Text>Total de gastos: Q {datos.totalGeneral}</Text>
      </View>

      {/* DATOS DE USUARIO */}
      <View style={styles.section}>
        <Text style={styles.titulo}>Usuario</Text>
        <Text>Nombre: {datos.usuario?.nombre}</Text>
        <Text>Código: {datos.usuario?.codigo}</Text>
        <Text>Rol: {datos.usuario?.rol}</Text>
        <Text>Distribuidora: {datos.usuario?.distribuidora}</Text>
      </View>

      {/* TABLA DE GASTOS */}
      <View style={styles.section}>
        <Text style={styles.titulo}>Detalle de Gastos</Text>
        <View style={styles.table}>
          {/* Encabezados */}
          <View style={styles.row}>
            <Text style={styles.cell}>Día</Text>
            <Text style={styles.cell}>Desayuno</Text>
            <Text style={styles.cell}>Almuerzo</Text>
            <Text style={styles.cell}>Cena</Text>
            <Text style={styles.cell}>Hospedaje</Text>
            <Text style={styles.cell}>Otros</Text>
          </View>
          {/* Filas */}
          {dias.map((d, i) => (
            <View style={styles.row} key={i}>
              <Text style={styles.cell}>{d.nombre}</Text>
              <Text style={styles.cell}>Q {d.desayuno}</Text>
              <Text style={styles.cell}>Q {d.almuerzo}</Text>
              <Text style={styles.cell}>Q {d.cena}</Text>
              <Text style={styles.cell}>Q {d.hospedaje}</Text>
              <Text style={styles.cell}>Q {d.otros}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default ReportPDF;
