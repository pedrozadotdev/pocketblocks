import React, { useContext, useEffect, useState } from "react";
import {
  AuthContainer,
  ConfirmButton,
  FormWrapperMobile,
  LoginCardTitle,
  StyledRouteLinkLogin,
} from "pages/userAuth/authComponents";
import { FormInput, PasswordInput } from "openblocks-design";
import { AUTH_LOGIN_URL } from "constants/routesURL";
import UserApi from "api/userApi";
import { checkEmailValid } from "util/stringUtils";
import styled from "styled-components";
import { requiresUnAuth } from "./authHOC";
import { useLocation } from "react-router-dom";
import { trans } from "i18n";
import { AuthContext, checkPassWithMsg, useAuthSubmit } from "pages/userAuth/authUtils";

const StyledFormInput = styled(FormInput)`
  margin-bottom: 16px;
`;

const StyledPasswordInput = styled(PasswordInput)`
  margin-bottom: 16px;
`;

const RecoveryContent = styled(FormWrapperMobile)`
  display: flex;
  flex-direction: column;

  button {
    margin: 20px 0 16px 0;
  }
`;

function UserRecoveryPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const location = useLocation();
  const { systemConfig } = useContext(AuthContext);
  const { loading, onSubmit } = useAuthSubmit(
    () =>
      UserApi.formLogin({
        resetToken: token,
        register: false,
        loginId: email,
        authId: "RESET_PASSWORD",
        password
      }),
    false,
    "/user/auth/login"
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get("resetToken");
    if(resetToken) {
      setToken(resetToken)
    }
  }, [])
  
    const { customProps } = systemConfig.form.rawConfig

  if (!customProps.allowUpdate.includes("password")) {
    return null;
  }

  return (
    <AuthContainer title={trans("userAuth.recoveryPassword")} type="large">
      <RecoveryContent>
        <LoginCardTitle>{token ? trans("userAuth.recoveryPasswordChangeTitle") : trans("userAuth.recoveryPasswordSendTitle")}</LoginCardTitle>
        {!token ? (
          <StyledFormInput
            className="form-input"
            label="Email:"
            onChange={(value, valid) => setEmail(valid ? value : "")}
            placeholder={trans("userAuth.inputEmail", { label: "email" })}
            checkRule={{
              check: (value) => checkEmailValid(value),
              errorMsg: trans("userAuth.inputValidEmail", { label: "email" }),
            }}
          />
        ) : (
          <StyledPasswordInput
            className="form-input"
            valueCheck={checkPassWithMsg}
            onChange={(value, valid) => setPassword(valid ? value : "")}
            doubleCheck
          />
        )}
        <ConfirmButton
          disabled={token ? !password : !email}
          onClick={onSubmit}
          loading={loading}
        >
          {token ? trans("userAuth.recoveryPasswordChangeBtn") : trans("userAuth.recoveryPasswordSendBtn")}
        </ConfirmButton>
        <StyledRouteLinkLogin to={{ pathname: AUTH_LOGIN_URL, state: location.state }}>
          {trans("userAuth.userLogin")}
        </StyledRouteLinkLogin>
      </RecoveryContent>
    </AuthContainer>
  );
}

export default requiresUnAuth(UserRecoveryPassword);
