import {
  BindCardWrapper,
  CardConfirmButton,
  StyledPasswordInput,
} from "pages/setting/profile/profileComponets";
import React, { useEffect, useState } from "react";
import UserApi from "api/userApi";
import { validateResponse } from "api/apiUtils";
import { useDispatch } from "react-redux";
import { fetchUserAction } from "redux/reduxActions/userActions";
import { trans } from "i18n";

function EmailChangeCard() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const dispatch = useDispatch();

  const sendRequest = (password: string) => {
    UserApi.bindEmail({ token, password })
      .then((resp) => {
        if (validateResponse(resp)) {
          dispatch(fetchUserAction());
        }
      })
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailChangeToken = urlParams.get("emailChangeToken");
    if(emailChangeToken) {
      setToken(emailChangeToken)
    }
  }, [])
  return (
    <BindCardWrapper>
      <StyledPasswordInput
        passInputConf={{
          label: trans("profile.password").slice(0, -1),
          placeholder: trans("profile.inputCurrentPassword"),
        }}
        onChange={(value) => {
          setPassword(value);
        }}
      />
      <CardConfirmButton buttonType="primary" disabled={!password} onClick={() => sendRequest(password)}>
        {trans("profile.submit")}
      </CardConfirmButton>
    </BindCardWrapper>
  );
}

export default EmailChangeCard;
