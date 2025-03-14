export async function createUser(userData: App.User): Promise<App.User> {
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Failed to create user');
        }

        const user: App.User = await response.json();
        console.log('User created:', user);
        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}
