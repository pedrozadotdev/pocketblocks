import { BASE_URL, SETTING } from "constants/routesURL";
import { useSelector } from "react-redux";
import { getUser } from "redux/selectors/usersSelectors";
import { currentOrgAdminOrDev } from "util/permissionUtils";
import history from "util/history";
import { Redirect, Route, Switch } from "react-router-dom";
import SettingHome from "./settingHome";

export function Setting() {
  const user = useSelector(getUser);
  if (!currentOrgAdminOrDev(user)) {
    history.push(BASE_URL);
  }

  return (
    <Switch>
      <Route path={`${SETTING}/:setting`} component={SettingHome} />
      <Route exact path={SETTING}>
        <Redirect to={`${SETTING}/theme`} />
      </Route>
    </Switch>
  );
}

export default Setting;
