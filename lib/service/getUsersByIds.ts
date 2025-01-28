export async function getUsersByIds(userIds: string[]): Promise<App.User[]> {
  try {
    // Send all userIds as a query parameter
    const queryParams = new URLSearchParams();
    userIds.forEach(id => queryParams.append('ids', id));
    
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