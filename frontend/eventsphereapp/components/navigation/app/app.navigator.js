// src/navigation/AdminOrganizerNavigator.js
import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserNavigator from '../user/user.navigator';
import AdminNavigator from '../admin/admin.navigator';
import OrganizerNavigator from '../organizer/organizer.navigator';
import { UserContext } from '../../context/user.context';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {

    const { user } = useContext(UserContext);
    const role = user.role;

    if (role === 'user') {
        return <UserNavigator />
    }
    else if (role === 'admin') {
        return <AdminNavigator />
    }
    else {
        return <OrganizerNavigator />
    }
}