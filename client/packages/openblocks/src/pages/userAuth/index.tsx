import { AUTH_LOGIN_URL, AUTH_REGISTER_URL, USER_AUTH_URL } from "constants/routesURL";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
import { selectSystemConfig } from "redux/selectors/configSelectors";
import { AuthContext } from "pages/userAuth/authUtils";
import UserRegister from "pages/userAuth/register";
import { AuthRoutes } from "@openblocks-ee/constants/authConstants";
import { AuthLocationState } from "constants/authConstants";
import { ProductLoading } from "components/ProductLoading";
import styled from "styled-components";

const WrapperContainer = styled.div<{ headerColor?: string }>`
a {
  color: ${(props) => props.headerColor || "#3377ff"}D0;
}
a:hover {
  color: ${(props) => props.headerColor || "#3377ff"};
}
.ant-btn-default[disabled], .ant-btn-default[disabled]:hover, .ant-btn-default[disabled]:focus, .ant-btn-default[disabled]:active {
  border: 1px solid ${(props) => props.headerColor || "#3377ff"}10;
  background: ${(props) => props.headerColor || "#3377ff"}40;
}
.ant-btn-default {
  background: ${(props) => props.headerColor || "#3377ff"}F0;
  border: 1px solid ${(props) => props.headerColor || "#3377ff"}30;
}
.ant-btn-default:hover {
  background: ${(props) => props.headerColor || "#3377ff"};
  border: 1px solid ${(props) => props.headerColor || "#3377ff"}80;
}
`;

export default function UserAuth() {
  const location = useLocation<AuthLocationState>();
  const systemConfig = useSelector(selectSystemConfig);
  if (!systemConfig) {
    return <ProductLoading hideHeader />;
  }
  const { customProps: { setupAdmin } } = systemConfig.form.rawConfig
  return (
    <WrapperContainer headerColor={systemConfig.branding?.headerColor}>
      <AuthContext.Provider
        value={{
          systemConfig: systemConfig,
          inviteInfo: location.state?.inviteInfo,
          thirdPartyAuthError: location.state?.thirdPartyAuthError,
        }}
      >
        <Switch location={location}>
          <Redirect exact from={USER_AUTH_URL} to={setupAdmin ? AUTH_REGISTER_URL : AUTH_LOGIN_URL} />
          <Route key={AUTH_REGISTER_URL} exact path={AUTH_REGISTER_URL} component={UserRegister} />
          {AuthRoutes.map((route) => setupAdmin ? (
            <Redirect key={route.path} exact from={route.path} to={AUTH_REGISTER_URL} />
          ) : (
            <Route key={route.path} exact path={route.path} component={route.component} />
          ))}
        </Switch>
      </AuthContext.Provider>
    </WrapperContainer>
  );
}
