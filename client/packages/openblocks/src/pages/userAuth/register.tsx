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
import { AuthContext, checkPassWithMsg, useAuthSubmit, useInputMask, getLoginTitle } from "pages/userAuth/authUtils";

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

const disableBtn = (customProps: any, username: string, email: string, name: string) =>
  customProps.setupAdmin
    ? !email
    : !name || 
      (customProps.localAuthInfo.requireEmail && !email) ||
      (customProps.type.includes("username") && !username)


function UserRegister() {
  const [submitBtnDisable, setSubmitBtnDisable] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
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
        loginId: `${email}\n${username}\n${name}`,
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
    <AuthContainer title={getLoginTitle(inviteInfo?.createUserName, systemConfig.branding?.brandName)}>
      <RegisterContent>
        <LoginCardTitle>{trans(customProps.setupAdmin ? "userAuth.registerAdmin" : "userAuth.registerByEmail")}</LoginCardTitle>
        {customProps.type.includes("username") && !customProps.setupAdmin && (
          <StyledFormInput
            inputRef={customProps.mask ? ref : undefined}
            className="form-input"
            mustFill
            label={((customProps.label as string).split("").map((l, i) => !i ? l.toUpperCase() : l).join("") || "Username") + ":"}
            onChange={(value, valid) => setUsername(valid ? (customProps.mask ? unmask(value) : value) : "")}
            placeholder={trans("userAuth.inputEmail", { label: customProps.label || "username" })}
            checkRule={{
              check: (value) => customProps.mask ? check(value) : true,
              errorMsg: trans("userAuth.inputValidEmail", { label: customProps.label || "username" }),
            }}
          />
        )}
        {(customProps.type.includes("email") || customProps.setupAdmin) && (
          <StyledFormInput
            className="form-input"
            label="Email:"
            mustFill={customProps.localAuthInfo.requireEmail || customProps.setupAdmin}
            onChange={(value, valid) => setEmail(valid ? value : "")}
            placeholder={trans("userAuth.inputEmail", { label: "email" })}
            checkRule={{
              check: (value) => (
                !(customProps.localAuthInfo.requireEmail || customProps.setupAdmin || value) ||
                checkEmailValid(value)
              ),
              errorMsg: trans("userAuth.inputValidEmail", { label: "email" }),
            }}
          />
        )}
        {!customProps.setupAdmin && (
          <StyledFormInput
            className="form-input"
            label={trans("userAuth.name")}
            mustFill
            onChange={(value, valid) => setName(valid ? value : "")}
            placeholder={trans("userAuth.inputEmail", { label: trans("userAuth.name").toLowerCase().slice(0, -1) })}
            checkRule={{
              check: (value) => value.split(" ").filter(v => v).length >= 2,
              errorMsg: trans("userAuth.inputValidName"),
            }}
          />
        )}
        <StyledPasswordInput
          className="form-input"
          mustFill
          valueCheck={value => checkPassWithMsg(value, customProps.setupAdmin ? 10 : customProps.localAuthInfo.minPasswordLength)}
          onChange={(value, valid) => setPassword(valid ? value : "")}
          doubleCheck
        />
        <ConfirmButton
          disabled={disableBtn(customProps, username, email, name) || !password || submitBtnDisable}
          onClick={onSubmit}
          loading={loading}
        >
          {trans("userAuth.register")}
        </ConfirmButton>
        <TermsAndPrivacyInfoWrapper>
          <TermsAndPrivacyInfo onCheckChange={(e) => setSubmitBtnDisable(!e.target.checked)} />
        </TermsAndPrivacyInfoWrapper>
        { !customProps.setupAdmin &&
          (
            <StyledRouteLinkLogin to={{ pathname: AUTH_LOGIN_URL, state: location.state }}>
              {trans("userAuth.userLogin")}
            </StyledRouteLinkLogin>
          )
        }
      </RegisterContent>
    </AuthContainer>
  );
}

export default requiresUnAuth(UserRegister);
