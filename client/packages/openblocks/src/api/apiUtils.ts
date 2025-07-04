import { ApiResponse } from "api/apiResponses";
import { API_STATUS_CODES, ERROR_CODES, SERVER_ERROR_CODES } from "constants/apiConstants";
import {
  createMessage,
  ERROR_0,
  ERROR_401,
  ERROR_404,
  ERROR_500,
  SERVER_API_TIMEOUT_ERROR,
} from "constants/messages";
import { AUTH_BIND_URL, OAUTH_REDIRECT } from "constants/routesURL";
import log from "loglevel";
import history from "util/history";
import { message } from "antd";
import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { trans } from "i18n";
import StoreRegistry from "redux/store/storeRegistry";
import { logoutAction } from "redux/reduxActions/userActions";

const executeActionRegex = /query\/execute/;
const timeoutErrorRegex = /timeout of (\d+)ms exceeded/;
export const axiosConnectionAbortedCode = "ECONNABORTED";

type AxiosRequestConfigWithTimer = InternalAxiosRequestConfig & { timer: number };

export type AxiosResponseWithTimer = AxiosResponse<ApiResponse> & {
  config: AxiosRequestConfigWithTimer;
};

function isAxiosResponseWithTimer(
  response: AxiosResponse<ApiResponse>
): response is AxiosResponseWithTimer {
  return response?.config && "timer" in response.config;
}

export type AxiosErrorWithTimer = AxiosError<ApiResponse> & {
  config: AxiosRequestConfigWithTimer;
};

function isAxiosErrorWithTimer(error: any): error is AxiosErrorWithTimer {
  return axios.isAxiosError(error) && !!error?.config && "timer" in error.config;
}

const makeExecuteActionResponse = (response: any) => {
  if (isAxiosResponseWithTimer(response)) {
    return {
      ...response,
      data: {
        ...(response?.data ?? {}),
        runTime: Number((performance.now() - response?.config.timer).toFixed()),
      },
    };
  }
  return response;
};

const notAuthRequiredPath = (requestUrl: string | undefined) => {
  const pathName = window.location.pathname;
  return (
    /^\/404/.test(pathName) ||
    /^\/user\/auth\/\w+/.test(pathName) ||
    /^\/invite\/\w+/.test(pathName) ||
    (requestUrl && /^\/auth\/logout\w*/.test(requestUrl))
  );
};

const notNeedBindPath = () => {
  const pathName = window.location.pathname;
  return pathName === AUTH_BIND_URL || pathName === OAUTH_REDIRECT;
};

export const apiRequestInterceptor = (config: InternalAxiosRequestConfig): AxiosRequestConfigWithTimer => ({
  ...config,
  timer: performance.now(),
});

export const apiSuccessResponseInterceptor = (response: AxiosResponse): AxiosResponse => {
  if (response?.config?.url?.match(executeActionRegex)) {
    return makeExecuteActionResponse(response);
  }
  return response;
};

/**
 * Axios interceptor that handles all API failure responses globally.
 * This function processes various types of errors and standardizes error handling across the application.
 * It handles network issues, timeouts, authentication, authorization, and other API-specific errors.
 * 
 * @param error - The error object from Axios request
 * @returns A rejected promise with standardized error format or resolved response in specific cases
 */
export const apiFailureResponseInterceptor = (error: any) => {

  // Check if browser is offline and return a network connectivity error
  if (!window.navigator.onLine) {
    return Promise.reject({
      ...error,
      message: createMessage(ERROR_0),
    });
  }

  // Handle null/undefined error cases
  if (!error) {
    return Promise.reject(error);
  }

  // Handle cancelled requests (e.g., user cancelled the request)
  if (axios.isCancel(error)) {
    return Promise.reject(error);
  }

  // Handle request timeout errors
  // ECONNABORTED is Axios's code for timeout/abort
  if (
    error.code === axiosConnectionAbortedCode &&
    error.message &&
    error.message.match(timeoutErrorRegex)
  ) {
    return Promise.reject({
      ...error,
      message: createMessage(SERVER_API_TIMEOUT_ERROR),
      code: ERROR_CODES.REQUEST_TIMEOUT,
    });
  }

  // Process errors for requests that include timing information
  if (isAxiosErrorWithTimer(error)) {
    if (error.response) {
      // Handle authentication errors (401) first
      // Skip auth check for certain paths like login, 404, etc.
      if (!notAuthRequiredPath(error.config?.url)) {
        if (error.response.status === API_STATUS_CODES.REQUEST_NOT_AUTHORISED) {
          // Log out user and redirect to login page
          StoreRegistry.getStore().dispatch(
            logoutAction({
              notAuthorised: true,
            })
          );
          return Promise.reject({
            code: ERROR_CODES.REQUEST_NOT_AUTHORISED,
            message: trans("apiMessage.authenticationFail"),
            show: true,
          });
        }
      }

      // Handle 404 errors for apps and redirect to apps page
      if (error.response.status === API_STATUS_CODES.RESOURCE_NOT_FOUND) {
        const path = window.location.pathname;
        // Check if the current path is an app path
        if (path.startsWith('/apps/') && path !== '/apps/module') {
          return Promise.reject({
            ...error,
            code: ERROR_CODES.PAGE_NOT_FOUND,
            message: createMessage(ERROR_404),
            show: true,
          })
        }
      }

      // Handle forbidden errors (403)
      // if (error.response.status === API_STATUS_CODES.SERVER_FORBIDDEN) {
      //   history.push(ALL_APPLICATIONS_URL);
      //   return Promise.reject({
      //     code: ERROR_CODES.SERVER_ERROR,
      //     message: createMessage(ERROR_403),
      //     show: true, 
      //   });
      // }


      // Handle 500 server errors
      if (error.response.status === API_STATUS_CODES.SERVER_ERROR) {
        return Promise.reject({
          ...error,
          code: ERROR_CODES.SERVER_ERROR,
          message: createMessage(ERROR_500),
        });
      }

      // Handle account binding requirement
      // Redirect to binding page if account needs to be bound (except on binding page)
      if (error.response?.data?.code === SERVER_ERROR_CODES.NEED_BIND && !notNeedBindPath()) {
        history.push(AUTH_BIND_URL);
        return Promise.reject({
          code: ERROR_CODES.SERVER_ERROR,
          message: trans("apiMessage.verifyAccount"),
          show: false,
        });
      }

      // Handle enterprise edition feature restrictions
      if (
        error.response?.data?.code === SERVER_ERROR_CODES.CURRENT_EDITION_NOT_SUPPORT_THIS_FEATURE
      ) {
        const errMsg = error.response.data?.message ?? trans("apiMessage.functionNotSupported");
        message.destroy(); // Clear any existing messages
        message.error(errMsg);
        return Promise.reject({ message: errMsg });
      }

      // Special handling for query execution endpoints
      // Add execution timing information to the response
      if (error.config && error.config?.url?.match(executeActionRegex)) {
        return makeExecuteActionResponse(error.response);
      }

      // For other error responses, resolve with the response
      // This allows individual API calls to handle specific error cases
      return Promise.resolve(error.response);
    } else if (error.request) {
      // Request was made but no response received
      log.error(error.request);
    } else {
      // Error occurred while setting up the request
      log.error("Error", error.message);
    }
  }
  // Log any unhandled error configurations
  log.debug(error.config);
  return Promise.resolve(error);
};

/**
 * transforn server errors to client error codes
 */
const getErrorMessage = (code: number) => {
  switch (code) {
    case 401:
      return createMessage(ERROR_401);
    case 500:
      return createMessage(ERROR_500);
    case 0:
      return createMessage(ERROR_0);
  }
};

/**
 * validates if response does have any errors
 * throw an error if no valid response is recieved
 */
export function validateResponse(response: AxiosResponse<ApiResponse>): true | never {
  if (doValidResponse(response)) {
    return true;
  } else {
    throw Error(response.data.message);
  }
}

export function doValidResponse(response: AxiosResponse<ApiResponse>) {
  if (!response) {
    throw Error(getErrorMessage(0));
  }
  if (!response.data && !response.status) {
    throw Error(getErrorMessage(0));
  }
  if (!response.data && response.status) {
    throw Error(getErrorMessage(response.status));
  }
  return response.data.success;
}
