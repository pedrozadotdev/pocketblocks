//window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
import { ReactComponent as LogoIcon } from "./logo.svg";
import { ReactComponent as LogoWithNameIcon } from "./logo-with-name.svg";
import { useSelector } from "react-redux";
import { getBrandingConfig } from "../../redux/selectors/configSelectors";

export { default as favicon } from "./favicon.ico";

export const Logo = (props: { branding?: boolean }) => {
  const brandingConfig = useSelector(getBrandingConfig);
  if(props.branding && brandingConfig?.logo) {
    return <img src={brandingConfig.logo} alt="LOGO" style={{ maxHeight: 24 }}/>
  }
  return <LogoIcon />;
};
export const LogoWithName = (props: { branding?: boolean }) => {
  const brandingConfig = useSelector(getBrandingConfig);
  if(props.branding && brandingConfig?.logo) {
    return (
      <div style={{ display: "flex", color: "white", fontSize: 16, fontWeight: "bold" }}>
        <img src={brandingConfig.logo} alt="LOGO" style={{ maxHeight: 24 }}/>
        <span style={{ marginLeft: 8 }}>{brandingConfig.brandName || ""}</span>
      </div>
    )
  }
  return <LogoWithNameIcon />;
};
