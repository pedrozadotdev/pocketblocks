import React, { useContext, useState } from "react";
import {
  AuthContainer,
  ConfirmButton,
  FormWrapperMobile,
  LoginCardTitle,
  StyledRouteLinkLogin,
  TermsAndPrivacyInfo,
} from "pages/userAuth/authComponents";
import { FormInput, PasswordInput } from "openblocks-design";
import { AUTH_LOGIN_URL } from "constants/routesURL";
import UserApi from "api/userApi";
import { useRedirectUrl } from "util/hooks";
import { checkEmailValid } from "util/stringUtils";
import styled from "styled-components";
import { requiresUnAuth } from "./authHOC";
import { useLocation } from "react-router-dom";
import { UserConnectionSource } from "@openblocks-ee/constants/userConstants";
import { trans } from "i18n";
import { AuthContext, checkPassWithMsg, useAuthSubmit, useInputMask } from "pages/userAuth/authUtils";

const StyledFormInput = styled(FormInput)`
  margin-bottom: 16px;
`;

const StyledPasswordInput = styled(PasswordInput)`
  margin-bottom: 16px;
`;

const RegisterContent = styled(FormWrapperMobile)`
  display: flex;
  flex-direction: column;

  button {
    margin: 20px 0 16px 0;
  }
`;

const TermsAndPrivacyInfoWrapper = styled.div`
  margin-bottom: 80px;
  @media screen and (max-width: 640px) {
    margin: 10px 0 64px 0;
  }
`;

function disableBtn(type: string, username: string, email: string) {
  if(type === "username" && !username) return true
  if(type === "email" && !email) return true
  if(type === "both" && (!email || !username)) return true
  return false
}

function UserRegister() {
  const [submitBtnDisable, setSubmitBtnDisable] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const redirectUrl = useRedirectUrl();
  const location = useLocation();
  const { systemConfig, inviteInfo } = useContext(AuthContext);
  const authId = systemConfig.form.id;
  const { loading, onSubmit } = useAuthSubmit(
    () =>
      UserApi.formLogin({
        register: true,
        loginId: `${email}\n${username}`,
        password: password,
        invitationId: inviteInfo?.invitationId,
        source: UserConnectionSource.email,
        authId,
      }),
    false,
    redirectUrl
  );
  
    const { customProps } = systemConfig.form.rawConfig
    const { ref, check, unmask } = useInputMask(customProps.mask || "email")

  if (!systemConfig || !systemConfig.form.enableRegister) {
    return null;
  }

  return (
    <AuthContainer title={trans("userAuth.register")} type="large">
      <RegisterContent>
        <LoginCardTitle>{trans("userAuth.registerByEmail")}</LoginCardTitle>
        {customProps.type !== "email" ? (
          <StyledFormInput
            inputRef={customProps.mask ? ref : undefined}
            className="form-input"
            label={((customProps.label as string).split("").map((l, i) => !i ? l.toUpperCase() : l).join("") || "Username") + ":"}
            onChange={(value, valid) => setUsername(valid ? (customProps.mask ? unmask(value) : value) : "")}
            placeholder={trans("userAuth.inputEmail", { label: customProps.label || "username" })}
            checkRule={{
              check: (value) => customProps.mask ? check(value) : true,
              errorMsg: trans("userAuth.inputValidEmail", { label: customProps.label || "username" }),
            }}
          />
        ) : null}
        {customProps.type !== "username" ? (
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
        ) : null}
        <StyledPasswordInput
          className="form-input"
          valueCheck={checkPassWithMsg}
          onChange={(value, valid) => setPassword(valid ? value : "")}
          doubleCheck
        />
        <ConfirmButton
          disabled={disableBtn(customProps.type, username, email) || !password || submitBtnDisable}
          onClick={onSubmit}
          loading={loading}
        >
          {trans("userAuth.register")}
        </ConfirmButton>
        <TermsAndPrivacyInfoWrapper>
          <TermsAndPrivacyInfo onCheckChange={(e) => setSubmitBtnDisable(!e.target.checked)} />
        </TermsAndPrivacyInfoWrapper>
        <StyledRouteLinkLogin to={{ pathname: AUTH_LOGIN_URL, state: location.state }}>
          {trans("userAuth.userLogin")}
        </StyledRouteLinkLogin>
      </RegisterContent>
    </AuthContainer>
  );
}

export default requiresUnAuth(UserRegister);
