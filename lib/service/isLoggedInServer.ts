import { cookies } from 'next/headers';

/**
 * Server-side function to check if a user is logged in by looking for the ArabicTech_User cookie
 * @returns App.User | null - The user object if logged in, null otherwise
 */
export function isLoggedInServer(): App.User | null {
    try {
        // Get the cookie store
        const cookieStore = cookies();

        // Get the ArabicTech_User cookie
        const userCookie = cookieStore.get('ArabicTech_User');

        if (!userCookie || !userCookie.value) {
            return null;
        }

        // Parse the cookie value to get the user object
        try {
            const user = JSON.parse(userCookie.value) as App.User;

            // Validate that the user object has the required properties
            if (!user || !user.userId) {
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
