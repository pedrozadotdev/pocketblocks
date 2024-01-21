import { message } from "antd";
import { HelpText } from "components/HelpText";
import { ColorSelect, CustomModal, TacoButton } from "openblocks-design";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useShallowEqualSelector } from "util/hooks";
import { Level1SettingPageContent, Level1SettingPageTitle } from "../styled";
import { trans } from "i18n";
import { Prompt } from "react-router";
import history from "util/history";
import { Location } from "history";
import {
  HeadNameWrapper,
  ProfileImageWrapper,
  StyledFormInput,
  StyledProfileImage,
} from "../profile/profileComponets";
import { checkHexColor, checkUrlValid, useSelector } from "index.sdk";
import { getBrandingConfig } from "redux/selectors/configSelectors";
import _ from "lodash";

import { ReactComponent as BrowserSVG } from "./Browser.svg";
import { getUser } from "redux/selectors/usersSelectors";
import { useDispatch } from "react-redux";
import { setCustomConfigAction } from "@openblocks-ee/redux/reduxActions/configActions";

import { Logo, LogoWithName } from "@openblocks-ee/assets/images";

const AdvancedSettingContent = styled.div`
  .section-title {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
    min-width: 288px;
  }
`;

const ImageWrapper = styled.div`
  height: 72px;

  div {
    border-radius: 10px !important;
  }

  path {
    fill: #000 !important;
  }

  svg,
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px !important;
  }
`;

const BrowserContainer = styled.div<{ headerColor?: string }>`
  position: relative;
  padding-right: 30px;

  .branding-name-tab {
    position: absolute;
    top: 19px;
    left: 124px;
    font-weight: 500;
    max-width: 195px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .branding-name-header {
    position: absolute;
    top: 65px;
    left: 65px;
    font-weight: 600;
    font-size: 15px;
    color: #fff;
    max-width: 620px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .branding-favicon {
    position: absolute;
    width: 16px;
    height: 16px;
    top: 20px;
    left: 102px;
  }

  svg {
    width: 100%;
    height: 100%;
  }

  .branding-favicon svg {
    path {
      fill: #000 !important;
    }
  }

  .branding-logo {
    position: absolute;
    height: 29px;
    top: 63px;
    left: 29px;
  }

  .profile-image {
    position: absolute;
    width: 29.5px;
    height: 29.5px;
    top: 62px;
    right: 59px;
    border-radius: 50%;
  }

  .preview-header-color {
    fill: ${({ headerColor }) => headerColor || "#6885FA"};
  }
`;

const SaveButton = styled(TacoButton)`
  padding: 4px 8px;
  min-width: 84px;
  height: 32px;
`;

let locationInfo: Location | Location<unknown> | null = null;

export function BrandingSettings() {
  const dispatch = useDispatch();
  const brandingConfig = useShallowEqualSelector(getBrandingConfig);
  const currentUser = useSelector(getUser);
  const [branding, setBranding] = useState(brandingConfig);
  const [canLeave, setCanLeave] = useState(false);

  useEffect(() => {
    if (canLeave) {
      history.push((locationInfo as Location)?.pathname);
    }
  }, [canLeave]);

  const handleSave = () =>
    dispatch(
      setCustomConfigAction({
        data: {
          branding,
        },
        onSuccess: () => {
          message.success(trans("advanced.saveSuccess"));
        },
      })
    );

  const isNotChange =
    JSON.stringify(brandingConfig) === JSON.stringify(branding);

  return (
    <Level1SettingPageContent>
      <Prompt
        message={(location) => {
          locationInfo = location;

          if (!canLeave && isNotChange) {
            setCanLeave(true);
          }
          if (canLeave) {
            return true;
          }
          CustomModal.confirm({
            title: trans("theme.leaveTipTitle"),
            content: trans("theme.leaveTipContent"),
            okText: trans("theme.leaveTipOkText"),
            onConfirm: () => {
              setCanLeave(true);
            },
          });
          return false;
        }}
        when={!isNotChange}
      />
      <Level1SettingPageTitle>{trans("branding.title")}</Level1SettingPageTitle>
      <AdvancedSettingContent>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: 288, marginRight: 30 }}>
            <div className="section-title" style={{ marginBottom: -13 }}>
              {trans("branding.brandNameTitle")}
            </div>
            <div className="section-content" style={{ maxWidth: 288 }}>
              <StyledFormInput
                label={String.fromCharCode(173)}
                initialValue={branding?.brandName}
                resetEmptyToValue={brandingConfig?.brandName}
                onChange={(value) =>
                  setBranding((b) => ({
                    ...b,
                    brandName: value || brandingConfig?.brandName,
                  }))
                }
                placeholder={trans("branding.brandNamePlaceholder")}
              />
            </div>
            <div className="section-title">{trans("branding.logoTitle")}</div>
            <div className="section-content">
              <HeadNameWrapper>
                <ImageWrapper>
                  <ProfileImageWrapper>
                    <StyledProfileImage
                      key={branding?.logo + "logo"}
                      size={72}
                      source={branding?.logo}
                      svg={!branding?.logo && <Logo />}
                      userName=""
                    />
                  </ProfileImageWrapper>
                </ImageWrapper>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <StyledFormInput
                    initialValue={branding?.logo}
                    label={String.fromCharCode(173)}
                    onChange={(value, valid) =>
                      valid &&
                      setBranding((b) => ({
                        ...b,
                        logo: value,
                      }))
                    }
                    placeholder={trans("branding.logoPlaceholder")}
                    checkRule={{
                      check: (value) => !value || checkUrlValid(value),
                      errorMsg: trans("branding.urlCheck"),
                    }}
                  />
                  <HelpText style={{ marginTop: -16 }}>
                    {trans("branding.logoHelp")}
                  </HelpText>
                </div>
              </HeadNameWrapper>
            </div>
            <div className="section-title">
              {trans("branding.faviconTitle")}
            </div>
            <div className="section-content">
              <HeadNameWrapper>
                <ImageWrapper>
                  <ProfileImageWrapper>
                    <StyledProfileImage
                      key={branding?.favicon + "favicon"}
                      size={72}
                      source={branding?.favicon}
                      svg={!branding?.favicon && <Logo />}
                      userName=""
                    />
                  </ProfileImageWrapper>
                </ImageWrapper>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <StyledFormInput
                    initialValue={branding?.favicon}
                    label={String.fromCharCode(173)}
                    onChange={(value, valid) =>
                      valid &&
                      setBranding((b) => ({
                        ...b,
                        favicon: value,
                      }))
                    }
                    placeholder={trans("branding.faviconPlaceholder")}
                    checkRule={{
                      check: (value) => !value || checkUrlValid(value),
                      errorMsg: trans("branding.urlCheck"),
                    }}
                  />
                  <HelpText style={{ marginTop: -16 }}>
                    {trans("branding.faviconHelp")}
                  </HelpText>
                </div>
              </HeadNameWrapper>
            </div>
            <div className="section-title">
              {trans("branding.headColorTitle")}
            </div>
            <div className="section-content">
              <HeadNameWrapper>
                <div style={{ height: "72px" }}>
                  <ColorSelect
                    size={72}
                    borderRadius={10}
                    changeColor={_.debounce(
                      (v) =>
                        setBranding((b) => ({
                          ...b,
                          headerColor: v,
                        })),
                      500,
                      {
                        leading: true,
                        trailing: true,
                      }
                    )}
                    color={branding?.headerColor || "#2c2c2c"}
                    trigger="hover"
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <StyledFormInput
                    initialValue={branding?.headerColor}
                    resetEmptyToValue="#2c2c2c"
                    label={String.fromCharCode(173)}
                    onChange={(value, valid) =>
                      valid &&
                      setBranding((b) => ({
                        ...b,
                        headerColor: value,
                      }))
                    }
                    placeholder={trans("branding.headColorPlaceholder")}
                    checkRule={{
                      check: (value) => !value || checkHexColor(value),
                      errorMsg: trans("branding.hexColorCheck"),
                    }}
                  />
                  <HelpText style={{ marginTop: -16 }}>
                    {trans("branding.headColorHelp")}
                  </HelpText>
                </div>
              </HeadNameWrapper>
            </div>
            <SaveButton
              buttonType="primary"
              disabled={isNotChange}
              onClick={() => handleSave()}
            >
              {trans("advanced.saveBtn")}
            </SaveButton>
          </div>
          <BrowserContainer headerColor={branding?.headerColor || "#2c2c2c"}>
            <div className="branding-name-tab">{branding?.brandName}</div>
            {branding?.logo && (
              <div className="branding-name-header">{branding?.brandName}</div>
            )}
            {branding?.favicon ? (
              <img
                className="branding-favicon"
                src={branding?.favicon}
                alt="favicon"
              />
            ) : (
              <div className="branding-favicon">
                <Logo />
              </div>
            )}
            {branding?.logo ? (
              <img className="branding-logo" src={branding?.logo} alt="logo" />
            ) : (
              <div className="branding-logo">
                <LogoWithName />
              </div>
            )}
            <img
              className="profile-image"
              src={currentUser.avatarUrl}
              alt="logo"
            />
            <BrowserSVG style={{ width: 750, height: 500 }} />
          </BrowserContainer>
        </div>
      </AdvancedSettingContent>
    </Level1SettingPageContent>
  );
}
