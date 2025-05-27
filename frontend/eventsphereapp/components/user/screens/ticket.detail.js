import { View, Text, Button, StyleSheet, SafeAreaView, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function TicketDetail({ route }) {
    const { ticket } = route.params;
    const qrValue = `ticket-${ticket.eventName}`;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafd' }}>
            <View style={styles.container}>
                <Text style={styles.title}>Chi tiết vé</Text>
                <QRCode value={qrValue} size={200} />
                <Text style={styles.code}>Mã QR để check-in</Text>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    code: { marginTop: 16, fontSize: 16 },
});
