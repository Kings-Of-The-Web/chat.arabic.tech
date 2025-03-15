'use client';

export class Cookies {
    /**
     * Gets a cookie value by name
     * @param name The name of the cookie
     * @returns string | undefined The cookie value if found
     */
    public static get(name: string): string | undefined {
        if (typeof window === 'undefined') {
            // Server-side - return undefined when running on server
            return undefined;
        }

        // Client-side
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop()?.split(';').shift();
        }
        return undefined;
    }

    /**
     * Sets a cookie with the given name and value
     * @param name The name of the cookie
     * @param value The value to store
     * @param options Optional cookie settings
     */
    public static set(
        name: string,
        value: string,
        options: {
            expires?: Date;
            path?: string;
            domain?: string;
            secure?: boolean;
            sameSite?: 'Strict' | 'Lax' | 'None';
        } = {}
    ): void {
        if (typeof window === 'undefined') {
            // Server-side - do nothing when running on server
            return;
        }

        // Client-side
        let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

        if (options.expires) {
            cookieString += `; expires=${options.expires.toUTCString()}`;
        }

        if (options.path) {
            cookieString += `; path=${options.path}`;
        } else {
            cookieString += `; path=/`;
        }

        if (options.domain) {
            cookieString += `; domain=${options.domain}`;
        }

        if (options.secure) {
            cookieString += '; secure';
        }

        if (options.sameSite) {
            cookieString += `; samesite=${options.sameSite.toLowerCase()}`;
        }

        document.cookie = cookieString;
    }

    /**
     * Removes a cookie by name
     * @param name The name of the cookie to remove
     * @param path Optional path of the cookie
     * @param domain Optional domain of the cookie
     */
    public static remove(name: string, path?: string, domain?: string): void {
        if (typeof window === 'undefined') {
            // Server-side - do nothing when running on server
            return;
        }

        // Client-side
        // Set expiration to past date to remove cookie
        this.set(name, '', {
            expires: new Date(0),
            path: path || '/',
            domain: domain,
        });
    }

    /**
     * Checks if a cookie exists
     * @param name The name of the cookie
     * @returns boolean True if cookie exists
     */
    public static exists(name: string): boolean {
        return this.get(name) !== undefined;
    }
}
