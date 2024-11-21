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
}

export default UrlsService;