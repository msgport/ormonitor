import axios from 'axios';

const API_SERVER = "http://localhost:8000/api"

class Requests {
    constructor() {
        this.instance = axios.create({
            baseURL: API_SERVER,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async get(endpoint, params = {}) {
        try {
            const response = await this.instance.get(endpoint, { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async post(endpoint, data = {}) {
        try {
            const response = await this.instance.post(endpoint, data);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async put(endpoint, data = {}) {
        try {
            const response = await this.instance.put(endpoint, data);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    handleError(error) {
        console.error('API error: ', error);
        if (error.response) {
            throw error.response.data;
        } else {
            throw error;
        }
    }
}

const requests = new Requests();

export default requests;