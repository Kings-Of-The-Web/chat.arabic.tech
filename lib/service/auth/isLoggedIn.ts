'use client';

import { Cookies } from '../../helpers/Cookies';

/**
 * Checks if a user is logged in by looking for the ArabicTech_User cookie
 * @returns App.User | null - The user object if logged in, null otherwise
 */
export function isLoggedIn(): App.User | null {
    try {
        // Get the ArabicTech_User cookie
        const userCookieValue = Cookies.get('ArabicTech_User');

        console.log('User cookie value:', userCookieValue);
        if (!userCookieValue) {
            return null;
        }

        // Parse the cookie value to get the user object
        try {
            const user = JSON.parse(userCookieValue) as App.User;

            // Validate that the user object has the required properties
            if (!user || !user.username) {
                return null;
            }

            return user;
        } catch (error) {
            console.error('Error parsing user cookie:', error);
            return null;
        }
    } catch (error) {
        console.error('Error checking if user is logged in:', error);
        return null;
    }
}
