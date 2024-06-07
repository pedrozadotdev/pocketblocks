import { UserConnectionSource } from "@openblocks-ee/constants/userConstants";
import { useSelector } from "react-redux";
import { getUser } from "redux/selectors/usersSelectors";
import { selectSystemConfig } from "redux/selectors/configSelectors";
import EmailCard from "pages/setting/profile/emailCard";
import PasswordCard from "pages/setting/profile/passwordCard";
import UsernameCard from "pages/setting/profile/usernameCard";
import {
  getConnectedName,
  HeadNameFiled,
  ProfileInfoItem,
  ProfileModalCardProps,
} from "pages/setting/profile/profileComponets";
import { useInputMask } from "pages/userAuth/authUtils"
import { trans } from "i18n";
import { useEffect, useState } from "react";
import { TacoInput } from "openblocks-design";

export function ProfileInfoCard(props: ProfileModalCardProps) {
  const user = useSelector(getUser);
  const { setModalContent, setTitle, setShowBackLink } = props;
  const hasPass = user.hasPassword;
  const email = getConnectedName(user, UserConnectionSource.email);
  const systemConfig = useSelector(selectSystemConfig);

  const { type, mask, allowUpdate, label, smtp } = systemConfig?.form.rawConfig.customProps

  const [provider, setProvider] = useState("")

  useEffect(() => {
    const p = localStorage.getItem("pbl_provider");
    if(p) { setProvider(p) }
  }, [])

  const { ref, initialValue } = useInputMask(mask || "")
  const username = user.connections?.find(c => c.source === UserConnectionSource.email)?.rawUserInfo?.username as string | undefined
  return (
    <>
      <HeadNameFiled />
      { type.includes("email") && (
        <ProfileInfoItem
          key="email"
          titleLabel="Email:"
          infoLabel={trans("profile.loginAfterBind", { name: trans("profile.email") })}
          value={email}
          actionButtonConfig={{
            label: trans("profile.change"),
            onClick: () => {
              setModalContent(<EmailCard />);
              setTitle(trans("profile.change") + " Email");
              setShowBackLink(true);
            },
            hidden: !!provider || !allowUpdate.includes("email") || !smtp
          }}
        /> )
      } 
      
      { !provider && type.includes("username") && (
        <>
          { mask && (
            <TacoInput
              ref={ref}
              style={{ display: "none" }}
              value={ username || "" }
            />
          )}
          <ProfileInfoItem
            key="username"
            titleLabel={(label ? label[0].toUpperCase() + label.slice(1) : "Username") + ":"}
            value={mask ? initialValue : username}
            actionButtonConfig={{
              label: trans("profile.change"),
              onClick: () => {
                setModalContent(<UsernameCard />);
                setTitle(trans("profile.change") + " " + (label ? label[0].toUpperCase() + label.slice(1) : "Username"));
                setShowBackLink(true);
              },
              hidden: !allowUpdate.includes("username")
            }}
          />
        </>
      )}
      { !provider && (
        <ProfileInfoItem
          key="password"
          titleLabel={trans("profile.password")}
          infoLabel={
            hasPass ? trans("profile.alreadySetPassword") : trans("profile.setPassPlaceholder")
          }
          actionButtonConfig={{
            label: trans("profile.change"),
            onClick: () => {
              setModalContent(<PasswordCard hasPass={hasPass} />);
              setTitle(hasPass ? trans("profile.modifyPassword") : trans("profile.setPassword"));
              setShowBackLink(true);
            },
            hidden: !allowUpdate.includes("password"),
          }}
        />
      )}
    </>
  );
}
