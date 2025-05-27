import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, SafeAreaView, Platform } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import DropDownPicker from 'react-native-dropdown-picker';

const screenWidth = Dimensions.get('window').width;

const allRevenueData = {
    2023: {
        1: {
            "music": [2000000, 2200000, 2500000],
            "seminar": [1500000, 1600000, 1700000],
            "sport": [1800000, 1900000, 2000000],
        },
        2: {
            "music": [2300000, 2400000, 2500000],
            "seminar": [1700000, 1750000, 1800000],
            "sport": [1900000, 1950000, 2000000],
        }
    },
    2024: {
        1: {
            "music": [3000000, 3200000, 3400000],
            "seminar": [2000000, 2100000, 2200000],
            "sport": [2500000, 2600000, 2700000],
        },
        2: {
            "music": [3500000, 3600000, 3700000],
            "seminar": [2300000, 2400000, 2500000],
            "sport": [2800000, 2900000, 3000000],
        }
    },
    2025: {
        1: {
            "music": [5000000, 5500000, 6000000],
            "seminar": [2000000, 2200000, 1800000],
            "sport": [3000000, 3500000, 3200000],
        },
        2: {
            "music": [6000000, 6200000, 6500000],
            "seminar": [2500000, 2400000, 2300000],
            "sport": [3000000, 3000000, 3000000],
        }
    }
};

const allTicketSalesData = {
    2023: {
        1: {
            "music": [80, 90, 100],
            "seminar": [40, 45, 50],
            "sport": [60, 65, 70]
        },
        2: {
            "music": [100, 110, 120],
            "seminar": [60, 65, 70],
            "sport": [80, 85, 90]
        }
    },
    2024: {
        1: {
            "music": [120, 130, 140],
            "seminar": [70, 75, 80],
            "sport": [90, 95, 100]
        },
        2: {
            "music": [140, 150, 160],
            "seminar": [80, 85, 90],
            "sport": [100, 105, 110]
        }
    },
    2025: {
        1: {
            "music": [160, 170, 180],
            "seminar": [80, 90, 85],
            "sport": [100, 110, 105]
        },
        2: {
            "music": [190, 200, 210],
            "seminar": [100, 95, 105],
            "sport": [120, 130, 140]
        }
    }
};

const allInterestData = {
    2023: {
        1: { "music": 20, "seminar": 10, "sport": 15 },
        2: { "music": 22, "seminar": 12, "sport": 18 }
    },
    2024: {
        1: { "music": 35, "seminar": 25, "sport": 20 },
        2: { "music": 38, "seminar": 27, "sport": 22 }
    },
    2025: {
        1: { "music": 50, "seminar": 30, "sport": 20 },
        2: { "music": 52, "seminar": 28, "sport": 20 }
    }
};



const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,
    labelColor: () => '#000',
    style: { borderRadius: 16 },
    propsForDots: { r: "5", strokeWidth: "2", stroke: "#1E90FF" }
};

export default function StatisticsScreen() {
    const [yearOpen, setYearOpen] = useState(false);
    const [yearValue, setYearValue] = useState(2025);
    const [yearItems, setYearItems] = useState([
        { label: '2023', value: 2023 },
        { label: '2024', value: 2024 },
        { label: '2025', value: 2025 }
    ]);


    const [monthOpen, setMonthOpen] = useState(false);
    const [monthValue, setMonthValue] = useState(1);
    const [monthItems, setMonthItems] = useState([
        { label: 'Tháng 1', value: 1 },
        { label: 'Tháng 2', value: 2 }
    ]);

    const [eventTypeOpen, setEventTypeOpen] = useState(false);
    const [eventTypeValue, setEventTypeValue] = useState("all");
    const [eventTypeItems, setEventTypeItems] = useState([
        { label: 'Tất cả', value: 'all' },
        { label: 'Âm nhạc', value: 'music' },
        { label: 'Hội thảo', value: 'seminar' },
        { label: 'Thể thao', value: 'sport' }
    ]);

    const revenue = allRevenueData[yearValue]?.[monthValue];
    const ticket = allTicketSalesData[yearValue]?.[monthValue];
    const interest = allInterestData[yearValue]?.[monthValue];

    const getAggregatedData = (type) => {
        if (!type || type === "all") {
            const defaultData = [0, 0, 0];
            for (const key in revenue) {
                revenue[key].forEach((val, i) => defaultData[i] += val);
            }
            return defaultData;
        }
        return revenue?.[type] || [0, 0, 0];
    };

    const getTicketData = () => {
        if (!ticket) return [0, 0, 0];
        if (eventTypeValue === "all") {
            const result = [0, 0, 0];
            for (const key in ticket) {
                ticket[key].forEach((val, i) => result[i] += val);
            }
            return result;
        }
        return ticket?.[eventTypeValue] || [0, 0, 0];
    };

    const getPieData = () => {
        if (!interest) return [];
        return [
            { name: "Âm nhạc", population: interest.music || 0, color: "#F00", legendFontColor: "#333", legendFontSize: 14 },
            { name: "Hội thảo", population: interest.seminar || 0, color: "#0F0", legendFontColor: "#333", legendFontSize: 14 },
            { name: "Thể thao", population: interest.sport || 0, color: "#00F", legendFontColor: "#333", legendFontSize: 14 }
        ];
    };

    const revenueData = {
        labels: ["Tuần 1", "Tuần 2", "Tuần 3"],
        datasets: [{ data: getAggregatedData(eventTypeValue) }]
    };

    const ticketSalesData = {
        labels: ["Sự kiện A", "Sự kiện B", "Sự kiện C"],
        datasets: [{ data: getTicketData() }]
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafd', paddingTop: Platform.OS === 'android' ? 25 : 0 }}>
            <View style={styles.filterContainer}>
                <Text style={styles.header}>📅 Bộ lọc</Text>

                <Text style={styles.pickerLabel}>Năm:</Text>
                <DropDownPicker
                    open={yearOpen}
                    value={yearValue}
                    items={yearItems}
                    setOpen={setYearOpen}
                    setValue={setYearValue}
                    setItems={setYearItems}
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownBox}
                    zIndex={3000}
                    zIndexInverse={1000}
                />

                <Text style={styles.pickerLabel}>Tháng:</Text>
                <DropDownPicker
                    open={monthOpen}
                    value={monthValue}
                    items={monthItems}
                    setOpen={setMonthOpen}
                    setValue={setMonthValue}
                    setItems={setMonthItems}
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownBox}
                    zIndex={2000}
                    zIndexInverse={2000}
                />

                <Text style={styles.pickerLabel}>Loại sự kiện:</Text>
                <DropDownPicker
                    open={eventTypeOpen}
                    value={eventTypeValue}
                    items={eventTypeItems}
                    setOpen={setEventTypeOpen}
                    setValue={setEventTypeValue}
                    setItems={setEventTypeItems}
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownBox}
                    zIndex={1000}
                    zIndexInverse={3000}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.header}>📈 Báo cáo doanh thu</Text>
                <LineChart
                    data={revenueData}
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                />

                <Text style={styles.header}>🎫 Vé đã bán</Text>
                <BarChart
                    data={ticketSalesData}
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={chartConfig}
                    style={styles.chart}
                />

                <Text style={styles.header}>🔥 Mức độ quan tâm</Text>
                <PieChart
                    data={getPieData()}
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={chartConfig}
                    accessor={"population"}
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                    style={styles.chart}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: 16,
    },
    header: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 8,
        color: '#222'
    },
    chart: {
        borderRadius: 12,
        marginBottom: 24
    },
    filterContainer: {
        paddingHorizontal: 16,
        paddingBottom: 8,
        backgroundColor: '#f9fafd',
        zIndex: 9999
    },
    pickerLabel: {
        fontWeight: '500',
        marginTop: 8,
        marginBottom: 4,
        color: '#444'
    },
    dropdown: {
        borderColor: '#ccc',
        marginBottom: 10,
        zIndex: 1000
    },
    dropdownBox: {
        borderColor: '#ccc'
    }
});
