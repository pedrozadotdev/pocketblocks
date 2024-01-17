import { all, call, put, takeLatest } from "redux-saga/effects";
import { ReduxAction, ReduxActionErrorTypes, ReduxActionTypes } from "constants/reduxActionConstants";
import { AxiosResponse } from "axios";
import { validateResponse } from "api/apiUtils";
import log from "loglevel";
import ConfigApi, { ConfigResponse } from "api/configApi";
import { transToSystemConfig } from "@openblocks-ee/constants/configConstants";
import { CustomConfigPayload } from "../reduxActions/configActions";
import message from "antd/lib/message";

export function* fetchConfigSaga() {
  try {
    const response: AxiosResponse<ConfigResponse> = yield call(ConfigApi.fetchConfig);
    const isValidResponse: boolean = validateResponse(response);
    if (isValidResponse) {
      yield put({
        type: ReduxActionTypes.FETCH_SYS_CONFIG_SUCCESS,
        payload: transToSystemConfig(response.data.data),
      });
    }
  } catch (error) {
    log.error("fail to fetch config:", error);
    yield put({
      type: ReduxActionErrorTypes.FETCH_SYS_CONFIG_ERROR,
    });
  }
}

export function* setCustomConfigSaga(action: ReduxAction<CustomConfigPayload>) {
  try {
    const response: AxiosResponse<ConfigResponse> = yield ConfigApi.setCustomConfig(
      action.payload
    );
    const isValidResponse: boolean = validateResponse(response);

    if (isValidResponse) {
      action.payload.onSuccess?.()
      yield put({
        type: ReduxActionTypes.FETCH_SYS_CONFIG_SUCCESS,
        payload: transToSystemConfig(response.data.data),
      });
    }
  } catch (error: any) {
    log.error("update customConfig error: ", error);
    message.error(error.message);
  }
}

export default function* configSagas() {
  yield all([
    takeLatest(ReduxActionTypes.FETCH_SYS_CONFIG_INIT, fetchConfigSaga),
    takeLatest(ReduxActionTypes.SET_CUSTOM_SETTING, setCustomConfigSaga),
  ]);
}
