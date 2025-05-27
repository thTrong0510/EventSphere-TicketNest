import React, { createContext, useState } from 'react';

// Khởi tạo context
export const UserContext = createContext();

// Tạo Provider
export const UserProvider = ({ children }) => {
    // Có thể lấy thông tin user từ login hoặc API sau này
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
