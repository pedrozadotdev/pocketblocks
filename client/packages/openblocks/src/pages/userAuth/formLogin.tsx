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
import { checkEmailValid, checkPhoneValid } from "util/stringUtils";
import { UserConnectionSource } from "@openblocks-ee/constants/userConstants";
import { trans } from "i18n";
import { AuthContext, useAuthSubmit } from "pages/userAuth/authUtils";
import { ThirdPartyAuth } from "pages/userAuth/thirdParty/thirdPartyAuth";
import { AUTH_REGISTER_URL } from "constants/routesURL";
import { useLocation } from "react-router-dom";

const AccountLoginWrapper = styled(FormWrapperMobile)`
  display: flex;
  flex-direction: column;
  margin-bottom: 106px;
`;

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

  return (
    <>
      <LoginCardTitle>{trans("userAuth.login")}</LoginCardTitle>
      {systemConfig.form.enableLogin ? (
        <AccountLoginWrapper>
          <FormInput
            className="form-input"
            label={((systemConfig.form.rawConfig.customProps.label as string).split("").map((l, i) => !i ? l.toUpperCase() : l).join("") || "Email") + ":"}
            onChange={(value, valid) => setAccount(valid ? value : "")}
            placeholder={trans("userAuth.inputEmail", { label: systemConfig.form.rawConfig.customProps.label || "email" })}
            checkRule={{
              check: (value) => checkPhoneValid(value) || checkEmailValid(value),
              errorMsg: trans("userAuth.inputValidEmail", { label: systemConfig.form.rawConfig.customProps.label || "email" }),
            }}
          />
          <PasswordInput
            className="form-input"
            onChange={(value) => setPassword(value)}
            valueCheck={() => [true, ""]}
          />
          <ConfirmButton loading={loading} disabled={!account || !password} onClick={onSubmit}>
            {trans("userAuth.login")}
          </ConfirmButton>
        </AccountLoginWrapper>
      ) : null}
      <AuthBottomView>
      {systemConfig.form.rawConfig.oauth.map((o: OauthProps) => (
        <OauthButton {...o} key={o.type} onClick={onSubmit}/>
      )) }
        <ThirdPartyAuth invitationId={invitationId} authGoal="login" />
      </AuthBottomView>
      {systemConfig.form.enableRegister && (
        <StyledRouteLink to={{ pathname: AUTH_REGISTER_URL, state: location.state }}>
          {trans("userAuth.register")}
        </StyledRouteLink>
      )}
    </>
  );
}

type OauthProps = {
  type: string
  oauth_custom_name?: string
  oauth_icon_url?: string
}

const oauthLoginLabel = (name: string) => trans("userAuth.signInLabel", { name: name });

function OauthButton({ onClick, type, oauth_custom_name, oauth_icon_url }: OauthProps & { onClick: (provider: string) => void }) {
  return (
    <StyledLoginButton onClick={() => onClick(type)}>
      <LoginLogoStyle alt={oauth_custom_name} src={oauth_icon_url} title={oauth_custom_name} />
      <CommonGrayLabel className="auth-label">{oauthLoginLabel(oauth_custom_name ?? "")}</CommonGrayLabel>
    </StyledLoginButton>
  );
}