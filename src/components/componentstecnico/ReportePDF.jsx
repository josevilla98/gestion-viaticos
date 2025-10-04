// src/components/componentestecnico/ReportePDF.jsx
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import logocmi from "../Imagenes/Logocmi.png"; // Ajusta ruta según tu proyecto

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, alignItems: "center" },
  logo: { width: 80, height: 40 },
  title: { fontSize: 16, fontWeight: "bold", textAlign: "center", flex: 1 },
  section: { marginBottom: 15 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  bold: { fontWeight: "bold" },
  gastosDia: { marginBottom: 10, padding: 6, border: "1px solid #ccc", borderRadius: 4 },
  imageContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 5 },
  facturaImage: { width: 80, height: 80, marginRight: 5, marginBottom: 5, border: "1px solid #000" },
});

const ReportePDF = ({ datos, dias }) => (
  <Document>
    <Page style={styles.page}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Image src={logocmi} style={styles.logo} />
        <Text style={styles.title}>Reporte de Gastos de Salida</Text>
      </View>

      {/* Info usuario */}
      <View style={styles.section}>
        <Text style={styles.bold}>👤 Técnico:</Text>
        <Text>Nombre: {datos.usuario?.nombre || "N/A"}</Text>
        <Text>Código: {datos.usuario?.codigo || "N/A"}</Text>
        <Text>Rol: {datos.usuario?.rol || "N/A"}</Text>
        <Text>Distribuidora: {datos.usuario?.distribuidora || "N/A"}</Text>
      </View>

      {/* Info general */}
      <View style={styles.section}>
        <Text style={styles.bold}>📌 Datos Generales</Text>
        <Text>Fecha inicio: {datos.fechaInicio}</Text>
        <Text>Kilometraje inicial: {datos.kmInicio}</Text>
        <Text>Kilometraje final: {datos.kmFinal}</Text>
        <Text>Vehículo: {datos.carro}</Text>
        <Text>Distribuidoras visitadas: {datos.distribuidorasSeleccionadas?.join(", ")}</Text>
        <Text>Total General: Q {datos.totalGeneral}</Text>
      </View>

      {/* Gastos día por día */}
      <View style={styles.section}>
        <Text style={styles.bold}>📅 Detalle por día</Text>
        {dias.map((d, i) => (
          <View key={i} style={styles.gastosDia}>
            <Text style={styles.bold}>{d.nombre}</Text>
            <Text> - Desayuno: Q {d.desayuno}</Text>
            <Text> - Almuerzo: Q {d.almuerzo}</Text>
            <Text> - Cena: Q {d.cena}</Text>
            <Text> - Hospedaje: Q {d.hospedaje}</Text>
            <Text> - Otros: Q {d.otros}</Text>
            {/* Facturas */}
            {d.imagenes?.length > 0 && (
              <View style={styles.imageContainer}>
                {d.imagenes.map((img, j) => (
                  <Image key={j} src={img} style={styles.facturaImage} />
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default ReportePDF;
