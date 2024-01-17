import Api from "./api";
import { AxiosPromise } from "axios";
import { ApiResponse } from "./apiResponses";
import { ConfigResponseData } from "constants/configConstants";
import { CustomConfigPayload } from "redux/reduxActions/configActions";

export interface ConfigResponse extends ApiResponse {
  data: ConfigResponseData;
}

class ConfigApi extends Api {
  static configURL = "/v1/configs";
  static customConfigURL = "/v1/configs/custom-configs"

  static fetchConfig(): AxiosPromise<ConfigResponse> {
    return Api.get(ConfigApi.configURL);
  }

  static setCustomConfig(request: CustomConfigPayload): AxiosPromise<ConfigResponse> {
    return Api.put(ConfigApi.customConfigURL, request.data)
  }
}

export default ConfigApi;
