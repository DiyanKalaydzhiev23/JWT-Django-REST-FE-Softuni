import Cookies from "universal-cookie/es6";

const cookies = new Cookies();

class HttpService {
    defaultHeaders = {
        'Content-Type': 'application/json',
        'X-CSRFToken': cookies.get('csrftoken'),
    }

    // STEP 5: Accept refreshTokenUrl so HttpService can autonomously refresh expired tokens
    constructor(storageService, refreshTokenUrl) {
        this.storageService = storageService;
        this._refreshTokenUrl = refreshTokenUrl;
        // STEP 6: Track whether a token refresh is already in progress to avoid multiple simultaneous refresh requests
        this._refreshPromise = null;
    }

    // STEP 3
    get defaultOptions() {
        const accessToken = this.storageService.get('accessToken'); // Fetch the JWT token
        const authorizationToken = accessToken
            ? { 'Authorization': `Bearer ${accessToken}` } // Use 'Bearer' for JWT
            : {};

        return {
            headers: {
                ...this.defaultHeaders, // Any predefined headers
                ...authorizationToken, // Add the authorization token if available
            },
        };
    }


    // STEP 7: Build fetch options and the full URL with query params
    _buildRequestParts(method, url, body, query) {
        const bodyOptions = body
            ? {body: JSON.stringify(body)}
            : {};
        const options = {
            ...this.defaultOptions,
            method: method,
            ...bodyOptions,
        };

        const queryParams = query
            ? Object.keys(query)
                .filter(key => query[key])
                .map(key => `${key}=${query[key]}`)
                .join('&')
            : '';

        const queryString = queryParams
            ? `?${queryParams}`
            : '';

        return { options, fullUrl: `${url}${queryString}` };
    }

    // STEP 8: Attempt to refresh the access token using the stored refresh token.
    //         Uses a single promise so concurrent 401s don't fire multiple refresh requests.
    async _refreshAccessToken() {
        if (this._refreshPromise) {
            return this._refreshPromise;
        }

        this._refreshPromise = (async () => {
            const refreshToken = this.storageService.get('refreshToken');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const refreshUrl = this._refreshTokenUrl;
            const response = await fetch(refreshUrl, {
                method: 'POST',
                headers: this.defaultHeaders,
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (!response.ok) {
                // STEP 9: Refresh token is also expired/invalid — clear stored tokens
                this.storageService.set('accessToken', null);
                this.storageService.set('refreshToken', null);
                throw new Error('Refresh token expired');
            }

            const { access } = await response.json();
            this.storageService.set('accessToken', access);
            return access;
        })();

        try {
            return await this._refreshPromise;
        } finally {
            this._refreshPromise = null;
        }
    }

    // STEP 10: The request method now detects 401 responses, refreshes the token, and retries once
    async request(method, url, body, query) {
        const { options, fullUrl } = this._buildRequestParts(method, url, body, query);

        const response = await fetch(fullUrl, options);

        // STEP 11: If the server says 401 Unauthorized, try refreshing the access token and retry
        if (response.status === 401) {
            try {
                await this._refreshAccessToken();
            } catch (e) {
                // Refresh failed — return the original 401 response
                return await response.json();
            }

            // Retry the original request with the new access token
            const { options: retryOptions } = this._buildRequestParts(method, url, body, query);
            const retryResponse = await fetch(fullUrl, retryOptions);
            return await retryResponse.json();
        }

        return await response.json();
    }

    async get(url, query) {
        return this.request('get', url, null, query);
    }

    async post(url, body) {
        return this.request('post', url, body);
    }

    async put(url, body) {
        return this.request('put', url, body);
    }

    // STEP 14: PATCH method for partial updates (e.g. updating only assignees on a todo)
    async patch(url, body) {
        return this.request('PATCH', url, body);
    }
}

export default HttpService;