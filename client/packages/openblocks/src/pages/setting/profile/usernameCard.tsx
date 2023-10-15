import {
  BindCardWrapper,
  CardConfirmButton,
  StyledFormInput,
} from "pages/setting/profile/profileComponets";
import React, { useState } from "react";
import UserApi from "api/userApi";
import { message } from "antd";
import { validateResponse } from "api/apiUtils";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAction } from "redux/reduxActions/userActions";
import { trans } from "i18n";
import { selectSystemConfig } from "redux/selectors/configSelectors";
import { useInputMask } from "pages/userAuth/authUtils"

function UsernameCard() {
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const config = useSelector(selectSystemConfig);
  const { label, mask } = config?.form.rawConfig.customProps

  const updateUsername = (username: string) => {
    UserApi.updateUser({ username })
      .then((resp) => {
        if (validateResponse(resp)) {
          message.success(trans("profile.bindingSuccess", { sourceName: label ? label[0] + label.slice(1) : "Username" }));
          dispatch(fetchUserAction());
        }
      })
      .catch((e) => {
        message.error(e.message);
      });
  };

  const { ref, check, unmask } = useInputMask(mask || "")

  return (
    <BindCardWrapper>
      <StyledFormInput
        inputRef={ref}
        mustFill
        label={label ? label[0] + label.slice(1) : "Username"}
        onChange={(value, valid) => setUsername(valid ? (mask ? unmask(value) : value) : "")}
        placeholder={trans("userAuth.inputEmail", { label: label || "username" })}
        checkRule={{
          check: (value) => !mask || check(value),
          errorMsg: trans("userAuth.inputValidEmail", { label: label || "username" }),
        }}
      />
      <CardConfirmButton buttonType="primary" disabled={!username} onClick={() => updateUsername(username)}>
        {trans("profile.submit")}
      </CardConfirmButton>
    </BindCardWrapper>
  );
}

export default UsernameCard;
