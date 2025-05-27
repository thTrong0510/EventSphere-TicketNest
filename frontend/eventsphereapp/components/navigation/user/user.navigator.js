import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../../user/screens/home';
import EventDetailScreen from '../../user/screens/event.detail';
import ReviewScreen from '../../user/screens/review';
import ChatScreen from '../../share/chat';
import EventListScreen from '../../user/screens/event.list';
import TicketScreen from '../../user/screens/tickets';
import TicketDetail from '../../user/screens/ticket.detail';
import TicketCheckoutScreen from '../../user/screens/ticket.checkout';
import NotificationsScreen from '../../user/screens/notification';
import { Ionicons } from '@expo/vector-icons';
import EventScreen from '../../user/screens/events';
import MessageListScreen from '../../share/message.list';
import UserInfoScreen from '../../share/user.info';
import TrendingEventsScreen from '../../share/trending.events';
import CustomHeader from '../../layout/custom.header';

const HomeStack = createNativeStackNavigator();
function HomeStackScreen() {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="Home" options={{ header: () => <CustomHeader title={"Trang Chủ"} /> }} component={HomeScreen} />
            <HomeStack.Screen name="EventDetail" options={{ title: "Chi tiết sự kiện" }} component={EventDetailScreen} />
            <HomeStack.Screen name="Review" component={ReviewScreen} options={{ title: "Đánh giá sự kiện" }} />
            <HomeStack.Screen name="Chat" component={ChatScreen} />
            <HomeStack.Screen name="UserInfo" component={UserInfoScreen} options={{ title: "Thông tin tài khoản" }} />
            <HomeStack.Screen name="Checkout" component={TicketCheckoutScreen} options={{ title: "Thanh toán" }} />
        </HomeStack.Navigator>
    );
}

const ChatStack = createNativeStackNavigator();
function ChatStackScreen() {
    return (
        <ChatStack.Navigator>
            <ChatStack.Screen name="MessageList" component={MessageListScreen}
                options={{ header: () => <CustomHeader title={"Tin nhắn"} /> }}
            />
            <ChatStack.Screen name="Chat" component={ChatScreen} />
            <ChatStack.Screen name="UserInfo" component={UserInfoScreen} options={{ title: "Thông tin tài khoản" }} />
        </ChatStack.Navigator>
    );
}

const EventStack = createNativeStackNavigator();
function EventStackScreen() {
    return (
        <EventStack.Navigator>
            <EventStack.Screen name="EventsList" component={EventListScreen}
                options={{ header: () => <CustomHeader title={"Danh sách sự kiện"} /> }}
            />
            <EventStack.Screen name="EventDetail" component={EventDetailScreen} options={{ title: "Chi tiết sự kiện" }} />
            <EventStack.Screen name="Events" component={EventScreen} options={{ title: "Sự kiện" }} />
            <EventStack.Screen name="Checkout" component={TicketCheckoutScreen} options={{ title: "Thanh toán" }} />
            <EventStack.Screen name="UserInfo" component={UserInfoScreen} options={{ title: "Thông tin tài khoản" }} />
        </EventStack.Navigator>
    );
}

const TicketStack = createNativeStackNavigator();
function TicketStackScreen() {
    return (
        <TicketStack.Navigator>
            <TicketStack.Screen name="MyTickets" component={TicketScreen}
                options={{ header: () => <CustomHeader title={"Vé của tôi"} /> }}
            />
            <TicketStack.Screen name="TicketDetail" component={TicketDetail} options={{ title: "Chi tiết vé" }} />
            <TicketStack.Screen name="UserInfo" component={UserInfoScreen} options={{ title: "Thông tin tài khoản" }} />
        </TicketStack.Navigator>
    );
}

const NotificationStack = createNativeStackNavigator();
function NotificationStackScreen() {
    return (
        <NotificationStack.Navigator>
            <NotificationStack.Screen name="Notifications" component={NotificationsScreen}
                options={{ header: () => <CustomHeader title={"Thông báo"} /> }}
            />
            <NotificationStack.Screen name="UserInfo" component={UserInfoScreen} options={{ title: "Thông tin tài khoản" }} />
        </NotificationStack.Navigator>
    );
}


const Stack = createNativeStackNavigator();
export default function UserNavigator() {

    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false, // ẩn tiêu đề trên header
                tabBarShowLabel: false, // ẩn tên dưới icon
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'HomeTab') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'EventsTab') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'TicketsTab') {
                        iconName = focused ? 'ticket' : 'ticket-outline';
                    } else if (route.name === 'NotificationsTab') {
                        iconName = focused ? 'notifications' : 'notifications-outline';
                    } else if (route.name === 'MessagesTab') {
                        iconName = focused ? 'chatbubble' : 'chatbubble-outline';
                    }

                    return <Ionicons name={iconName} size={24} color={color} />;
                },
                tabBarActiveTintColor: '#3478f6',
                tabBarInactiveTintColor: '#888',
            })}
        >
            <Tab.Screen name="HomeTab" component={HomeStackScreen} />
            <Tab.Screen name="NotificationsTab" component={NotificationStackScreen} />
            <Tab.Screen name="EventsTab" component={EventStackScreen} />
            <Tab.Screen name="TicketsTab" component={TicketStackScreen} />
            <Tab.Screen name="MessagesTab" component={ChatStackScreen} />
        </Tab.Navigator>
    );
}
