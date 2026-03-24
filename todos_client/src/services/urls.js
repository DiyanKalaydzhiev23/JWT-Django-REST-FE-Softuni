class UrlsService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    getCategoriesListUrl() {
        return `${this.baseUrl}/todos/categories/`;
    }

    getTodosListUrl() {
        return `${this.baseUrl}/todos/`;
    }

    getTodoDetailsUrl(id) {
        return `${this.baseUrl}/todos/${id}/`;
    }

    getTodoUpdateUrl(id) {
        return `${this.baseUrl}/todos/${id}/`;
    }

    getTodoCreateUrl() {
        return `${this.baseUrl}/todos/`;
    }

    getLoginUrl() {
        return `${this.baseUrl}/auth/login/`;
    }

    getRegisterUrl() {
        return `${this.baseUrl}/auth/register/`;
    }

    getLogoutUrl() {
        return `${this.baseUrl}/auth/logout/`;
    }

    // STEP 4: URL for refreshing an expired access token using the refresh token
    getRefreshTokenUrl() {
        return `${this.baseUrl}/auth/token/refresh/`;
    }

    // STEP 13: URL for fetching all users (used to populate the assignee picker)
    getUsersListUrl() {
        return `${this.baseUrl}/auth/users/`;
    }
}

export default UrlsService;