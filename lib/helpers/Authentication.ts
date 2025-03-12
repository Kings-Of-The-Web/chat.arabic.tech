export class Authentication {
    /**
     * Generates a unique browser fingerprint based on various browser characteristics
     * @returns Promise<string> A unique identifier for the browser
     */
    public static async generateFingerprint(): Promise<string> {
        if (typeof window === 'undefined') {
            return 'server-side';
        }

        const components = [
            navigator.userAgent,
            navigator.language,
            new Date().getTimezoneOffset(),
            screen.width + 'x' + screen.height,
            screen.colorDepth,
            navigator.hardwareConcurrency,
            navigator.deviceMemory,
            navigator.platform,
        ];

        // Add canvas fingerprinting
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
            canvas.width = 200;
            canvas.height = 50;

            // Add some drawing operations that might vary between browsers/devices
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillStyle = '#f60';
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = '#069';
            ctx.fillText('Browser Fingerprint', 2, 15);
            ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
            ctx.fillText('Browser Fingerprint', 4, 17);

            components.push(canvas.toDataURL());
        }

        // Combine all components and create a hash
        const fingerprint = components.join('###');

        // Use a simple hash function
        const hash = await this.hashString(fingerprint);
        return hash;
    }

    /**
     * Creates a SHA-256 hash of the input string
     * @param str String to hash
     * @returns Promise<string> Hashed string
     */
    private static async hashString(str: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
}
