export async function getUsersByIds(usernames: string[]): Promise<App.User[]> {
    try {
        // Send all usernames as a query parameter
        const queryParams = new URLSearchParams();
        usernames.forEach((id) => queryParams.append('ids', id));

        const response = await fetch(`/api/users?${queryParams.toString()}`);

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        const users: App.User[] = await response.json();
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}
