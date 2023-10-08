/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosRequestConfig } from "axios";
import MockAdapter from "axios-mock-adapter";
import { pathToRegexp, match } from "path-to-regexp";

type MockEvent =
  | "onGet"
  | "onPost"
  | "onPut"
  | "onPatch"
  | "onDelete"
  | "onAny";

export type MockHandler = (req: MockRequest) => Promise<MockResponse>;

type Params = [string, MockHandler];

export interface MockResponse {
  status: number;
  body: unknown;
  headers?: {
    [key: string]: string;
  };
}

export interface MockRequest {
  config: AxiosRequestConfig;
  params: any;
  messageIns: any;
}

function mockRequest(event: MockEvent, ...[path, handler]: Params) {
  return function (mockIns: MockAdapter, messageIns: unknown) {
    mockIns[event](pathToRegexp(path)).reply(async (config) => {
      let data: any;
      try {
        data = JSON.parse(config.data);
      } catch (_) {
        data = config.data;
      }
      const url = (config.baseURL || "/").slice(0, -1) + config.url;
      const matchParams = match(path, { decode: decodeURIComponent })(url);
      const response = await handler({
        config: {
          ...config,
          data,
        },
        params: matchParams ? matchParams.params : {},
        messageIns,
      });
      mockIns.resetHistory();
      if (import.meta.env.DEV) {
        console.warn(
          `[PROXY]: ${config.method?.toUpperCase()} - "${
            config.url
          }" (Request intercepted!) \nRequest: `,
          config,
          "\nResponse: ",
          response,
        );
      }
      return [response.status, response.body, response.headers];
    });
  };
}

export const mocker = {
  get: (...params: Params) => mockRequest("onGet", ...params),
  post: (...params: Params) => mockRequest("onPost", ...params),
  put: (...params: Params) => mockRequest("onPut", ...params),
  patch: (...params: Params) => mockRequest("onPatch", ...params),
  delete: (...params: Params) => mockRequest("onDelete", ...params),
  all: (...params: Params) => mockRequest("onAny", ...params),
};
