import ReactPDF, { Font, Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Order, OrderedItem } from "@/types";

Font.register({
  family: "Roboto",
  src: `https://fonts.gstatic.com/s/roboto/v16/zN7GBFwfMP4uA6AR0HCoLQ.ttf`
});

// 📌 Styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  container: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  h1: {
    fontSize: 24,
    marginBottom: 5,
  },
  h3: {
    fontSize: 16,
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  cell: {
    padding: 6,
    flexGrow: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
  cellLast: {
    padding: 6,
    flexGrow: 1,
  },
  total: {
    textAlign: "right",
    fontWeight: "bold",
    marginTop: 4,
  },
});

// 📄 COMPONENT
export default function InvoiceDocument({ data }: { data: Order }) {
  return (
    <Document>
      <Page size="A4">
        <View>
           <View style={styles.header}>
            <View>
              <Text style={styles.h1}>FAKTURA</Text>
              <Text>Faktura č.: {data.date}</Text>
            </View>

            <View>
              <Text style={{ fontSize: 18 }}>Hydroocann Natural s.r.o.</Text>
              <Text>Korunní 2569/108</Text>
              <Text>Vinohrady</Text>
              <Text>101 00 Praha</Text>
              <Text>Česká republika</Text>
              <Text>IČO: 09706381</Text>
            </View>
          </View>

         
          
          <View style={styles.section}>
            <Text style={styles.h3}>Příjemce:</Text>
            <Text>
              {data.user.name} {data.user.surname}
            </Text>
            <Text>{data.user.address}</Text>
            <Text>{data.user.postalCode} {data.user.city}</Text>
            <Text>{data.user.country}</Text>
            <Text>
              {data.user.city}, {data.user.postalCode}
            </Text>
            <Text>Česká republika</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.h3}>Produkty:</Text>

            <View style={styles.tableHeader}>
              <Text style={styles.cell}>Popis produktu</Text>
              <Text style={styles.cell}>Varianta</Text>
              <Text style={styles.cell}>Příchuť</Text>
              <Text style={styles.cell}>Množství</Text>
              <Text style={styles.cellLast}>Cena</Text>
            </View>

            {data.orderedProducts && data.orderedProducts.map((item:OrderedItem, index: number) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.cell}>{item.name}</Text>
                <Text style={styles.cell}>{item.variant || "-"}</Text>
                <Text style={styles.cell}>{item.terpens || "-"}</Text>
                <Text style={styles.cell}>{item.quantity}</Text>
                <Text style={styles.cellLast}>
                  {item.price - (item.price / 100) * data.couponValue} Kč
                </Text>
              </View>
            ))}
          </View>

          
          <View style={styles.section}>
            {Number(data.couponValue) > 0 && (
  <Text style={styles.total}>Sleva: {data.couponValue} %</Text>
)}
            <Text style={styles.total}>
              Doprava: {data.free_del  ? "Zdarma" : "89 Kč"}
            </Text>

            <Text style={styles.total}>Celkem: {data.total} Kč</Text>
          </View> 
          <Text>Hello</Text>
        </View>
      </Page>
    </Document>
  );
}
