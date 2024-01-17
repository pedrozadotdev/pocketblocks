import { BrandingConfig, PblAuthConfig } from "@openblocks-ee/constants/configConstants";
import { ReduxActionTypes } from "constants/reduxActionConstants";
import { ExternalEditorContextState } from "util/context/ExternalEditorContext";

export const fetchConfigAction = () => {
  return {
    type: ReduxActionTypes.FETCH_SYS_CONFIG_INIT,
  };
};

export const setEditorExternalStateAction = (state: Partial<ExternalEditorContextState>) => {
  return {
    type: ReduxActionTypes.SET_EDITOR_EXTERNAL_STATE,
    payload: state,
  };
};

export interface CustomConfigPayload {
  data: {
    branding?: BrandingConfig
    auths?: PblAuthConfig
  }
  onSuccess?: () => void
}

export const setCustomConfigAction = (state: CustomConfigPayload) => {
  return {
    type: ReduxActionTypes.SET_CUSTOM_SETTING,
    payload: state
  }
}
