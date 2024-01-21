import { CommonGrayLabel, FormInput, PasswordInput } from "openblocks-design";
import {
  AuthBottomView,
  ConfirmButton,
  FormWrapperMobile,
  LoginCardTitle,
  LoginLogoStyle,
  StyledLoginButton,
  StyledRouteLink,
} from "pages/userAuth/authComponents";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import UserApi from "api/userApi";
import { useRedirectUrl } from "util/hooks";
import { checkEmailValid } from "util/stringUtils";
import { UserConnectionSource } from "@openblocks-ee/constants/userConstants";
import { trans } from "i18n";
import { AuthContext, useAuthSubmit, useInputMask } from "pages/userAuth/authUtils";
import { ThirdPartyAuth } from "pages/userAuth/thirdParty/thirdPartyAuth";
import { AUTH_REGISTER_URL, AUTH_PASSWORD_RECOVERY_URL } from "constants/routesURL";
import { useLocation } from "react-router-dom";

const AccountLoginWrapper = styled(FormWrapperMobile)`
  display: flex;
  flex-direction: column;
  margin-bottom: 106px;
`;

function createInputLabel({ label, type, mask }: any, cap = true): string {
  const LABEL = label && (cap ? label[0].toUpperCase() + label.slice(1) : label)
  const EMAIL = cap ? "Email" : "email"
  const USERNAME = cap ? "Username" : "username"
  if(type.length > 1 && !mask) {
    return `${EMAIL}/${LABEL || USERNAME}`
  }
  return LABEL || EMAIL
}

export default function FormLogin() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const redirectUrl = useRedirectUrl();
  const { systemConfig, inviteInfo } = useContext(AuthContext);
  const invitationId = inviteInfo?.invitationId;
  const authId = systemConfig?.form.id;
  const location = useLocation();

  const { onSubmit, loading } = useAuthSubmit(
    source =>
      UserApi.formLogin({
        register: false,
        loginId: account,
        password: password,
        invitationId: invitationId,
        source: source ?? UserConnectionSource.email,
        authId,
      }),
    false,
    redirectUrl
  );

  const { customProps } = systemConfig.form.rawConfig

  const { ref, check, unmask } = useInputMask(customProps.mask || "email")

  return (
    <>
      <LoginCardTitle>{trans("userAuth.login")}</LoginCardTitle>
      {systemConfig.form.enableLogin && (
        <AccountLoginWrapper>
          <FormInput
            inputRef={customProps.mask ? ref : undefined}
            className="form-input"
            label={createInputLabel(customProps) + ":"}
            onChange={(value, valid) => setAccount(valid ? (customProps.mask ? unmask(value) : value) : "")}
            placeholder={trans("userAuth.inputEmail", { label: createInputLabel(customProps, false) })}
            checkRule={{
              check: (value) => customProps.mask ? check(value) : customProps.type.includes("username") || checkEmailValid(value),
              errorMsg: trans("userAuth.inputValidEmail", { label: createInputLabel(customProps, false) }),
            }}
          />
          <PasswordInput
            className="form-input"
            onChange={(value) => setPassword(value)}
            valueCheck={() => [true, ""]}
          />
          { customProps.allowUpdate.includes("password") &&
            customProps.type.includes("email") &&
            customProps.smtp && (
            <StyledRouteLink style={{ marginBottom: 16, marginTop: -20 }} to={{ pathname: AUTH_PASSWORD_RECOVERY_URL, state: location.state }}>
              {trans("userAuth.recoveryPassword")}
            </StyledRouteLink>
          )}
          <ConfirmButton loading={loading} disabled={!account || !password} onClick={() => onSubmit()}>
            {trans("userAuth.login")}
          </ConfirmButton>
        </AccountLoginWrapper>
      )}
      <AuthBottomView>
      {systemConfig.form.rawConfig.oauth.map((o: OauthProps) => (
        <OauthButton {...o} key={o.name} onClick={onSubmit}/>
      )) }
        <ThirdPartyAuth invitationId={invitationId} authGoal="login" />
      </AuthBottomView>
      {systemConfig.form.enableRegister && systemConfig.form.enableLogin && (
        <StyledRouteLink to={{ pathname: AUTH_REGISTER_URL, state: location.state }}>
          {trans("userAuth.register")}
        </StyledRouteLink>
      )}
    </>
  );
}

type OauthProps = {
    name: string
    customName: string
    customIconUrl: string
    defaultIconUrl: string
    defaultName: string
  }

const oauthLoginLabel = (name: string) => trans("userAuth.signInLabel", { name });

function OauthButton({ onClick, name, customName, customIconUrl, defaultIconUrl, defaultName }: OauthProps & { onClick: (provider: string) => void }) {
  return (
    <StyledLoginButton onClick={() => onClick(name)}>
      <LoginLogoStyle alt={customName || defaultName} src={customIconUrl || defaultIconUrl} title={customName || defaultName} />
      <CommonGrayLabel className="auth-label">{oauthLoginLabel(customName || defaultName)}</CommonGrayLabel>
    </StyledLoginButton>
  );
}