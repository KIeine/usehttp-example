import axios from 'axios';

export const HTTP_STATUS = {
    SUCCESS: 200,
    NO_DATA: 204,
    BAD_REQUEST: 400,
    NOT_LOGGED_IN: 401,
    NOT_AUTHORIZED: 403,
    NOT_FOUND: 404,
    VALIDATION_ERROR: 422,
    SERVER_ERROR: 500,
};

export const SERVICE_STATE = {
    SUCCESS: Symbol('SUCCESS'),
    NO_DATA: Symbol('NO_DATA'),
    BAD_REQUEST: Symbol('NOT_AUTHORIZED'),
    NOT_AUTHORIZED: Symbol('NOT_AUTHORIZED'),
    NOT_FOUND: Symbol('NOT_FOUND'),
    VALIDATION_ERROR: Symbol('VALIDATION_ERROR'),
    SERVER_ERROR: Symbol('SERVER_ERROR'),
};

const HTTP_STATUS_TO_SERVICE_STATUS = {
    [HTTP_STATUS.SUCCESS]: SERVICE_STATE.SUCCESS,
    [HTTP_STATUS.NO_DATA]: SERVICE_STATE.NO_DATA,
    [HTTP_STATUS.BAD_REQUEST]: SERVICE_STATE.BAD_REQUEST,
    [HTTP_STATUS.NOT_AUTHORIZED]: SERVICE_STATE.NOT_AUTHORIZED,
    [HTTP_STATUS.NOT_FOUND]: SERVICE_STATE.NOT_FOUND,
    [HTTP_STATUS.VALIDATION_ERROR]: SERVICE_STATE.VALIDATION_ERROR,
    [HTTP_STATUS.SERVER_ERROR]: SERVICE_STATE.SERVER_ERROR,
};

const getState = (status) => HTTP_STATUS_TO_SERVICE_STATUS[status] || null;

const getServiceResponse = (state, data = null) => ({
    state,
    data,
});

const onError = (error) => {
    if (!error.response) {
        // Something happened in setting up the request and triggered an Error
        // or no response was received
        // hence we rethrow this error.
        throw error;
    }

    const { status } = error.response;

    switch (status) {
        case HTTP_STATUS.BAD_REQUEST:
            return getServiceResponse(getState(status));
        case HTTP_STATUS.NOT_AUTHORIZED:
            return getServiceResponse(getState(status));
        case HTTP_STATUS.NOT_FOUND:
            return getServiceResponse(getState(status));
        case HTTP_STATUS.VALIDATION_ERROR:
            return getServiceResponse(getState(status));
        case HTTP_STATUS.SERVER_ERROR:
            return getServiceResponse(getState(status));
        default: {
            // we cannot handle this response status
            // hence we rethrow this error.
            throw error;
        }
    }
};

export const HTTP = {
    post: async (path, options) => {
        try {
            const response = await axios.post(path, options);

            return getServiceResponse(getState(response.status), response.data);
        } catch (error) {
            return onError(error);
        }
    },
    get: async (path, options) => {
        try {
            const response = await axios.get(path, options);
            return getServiceResponse(getState(response.status), response.data);
        } catch (error) {
            return onError(error);
        }
    },
    put: async (path, options) => {
        try {
            const response = await axios.put(path, options);
            return getServiceResponse(getState(response.status), response.data);
        } catch (error) {
            return onError(error);
        }
    },
};

export const getQueryParams = (params) => {
    const url = new URL('http://mock.com');
    Object.keys(params).forEach((param) => {
        const value = params[param];
        if (value) {
            url.searchParams.append(param, value);
        }
    });

    return url.searchParams.toString();
};

export const getPathWithQuery = (path, query) => {
    const queryString = getQueryParams(query);
    return queryString ? `${path}?${queryString}` : path;
};
