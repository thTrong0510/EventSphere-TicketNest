import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import ManageEventsScreen from '../../managers/organizer/manage.events.screen';
import CreateEventScreen from '../../managers/organizer/create.event.screen';
import StatisticsScreen from '../../managers/statistics.screen';
import UserInfoScreen from '../../share/user.info';
import MessageListScreen from '../../share/message.list';
import ChatScreen from '../../share/chat';
import EventDetailScreen from '../../managers/organizer/details.event.screen';




const Tab = createBottomTabNavigator();
const ChatStack = createNativeStackNavigator();

function ChatStackScreen() {
    return (
        <ChatStack.Navigator>
            <ChatStack.Screen name="MessageList" component={MessageListScreen} />
            <ChatStack.Screen name="Chat" component={ChatScreen} />
        </ChatStack.Navigator>
    );
}

const EventStack = createNativeStackNavigator();

function EventStackScreen() {
    return (
        <EventStack.Navigator>
            <EventStack.Screen name="ManageEvents" component={ManageEventsScreen} />
            <EventStack.Screen name="DetailsEvent" component={EventDetailScreen} />
        </EventStack.Navigator>
    );
}

export default function OrganizerNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#1E90FF',
                tabBarInactiveTintColor: 'gray',
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Statistics':
                            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                            break;
                        case 'CreateEvent':
                            iconName = focused ? 'add-circle' : 'add-circle-outline';
                            break;
                        case 'ManageEvents':
                            iconName = focused ? 'calendar' : 'calendar-outline';
                            break;
                        case 'MessagesTab':
                            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                            break;
                        case 'UserInfo':
                            iconName = focused ? 'person' : 'person-outline';
                            break;
                        default:
                            iconName = 'alert-circle-outline';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Statistics" component={StatisticsScreen} options={{ title: 'Thống kê' }} />
            <Tab.Screen name="CreateEvent" component={CreateEventScreen} options={{ title: 'Tạo sự kiện' }} />
            <Tab.Screen name="EventsTab" component={EventStackScreen} options={{ title: 'Quản lý sự kiện' }} />
            <Tab.Screen name="MessagesTab" component={ChatStackScreen} options={{ title: 'Tin nhắn' }} />
            <Tab.Screen name="UserInfo" component={UserInfoScreen} options={{ title: 'Tài khoản' }} />
        </Tab.Navigator>
    );
}
