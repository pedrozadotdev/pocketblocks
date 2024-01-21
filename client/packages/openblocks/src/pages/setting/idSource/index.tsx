import React, { useEffect, useState } from "react";
import { trans } from "i18n";
import {
  Level1SettingPageContentWithList,
  Level1SettingPageTitleWithBtn,
} from "pages/setting/styled";
import Column from "antd/lib/table/Column";
import {
  SpanStyled,
  TableStyled,
} from "pages/setting/idSource/styledComponents";
import { message } from "antd";
import { validateResponse } from "api/apiUtils";
import { LocalAuth, OauthAuth } from "constants/configConstants";
import { GeneralLoginIcon } from "assets/icons";
import ConfigApi from "api/configApi";
import CreateModal from "./createModal";
import { HelpText as RawHelpText } from "components/HelpText";
import LinkPlusButton from "components/LinkPlusButton";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setCustomConfigAction } from "redux/reduxActions/configActions";

interface AuthItems {
  local?: LocalAuth;
  oauths: OauthAuth[];
}

const HelpText = styled(RawHelpText)`
  button {
    height: 19px;
  }
`;

export const IdSourceHome = () => {
  const [configs, setConfigs] = useState<AuthItems>();
  const [fetching, setFetching] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectItem, setSelectItem] = useState<any>();
  const dispatch = useDispatch();
  useEffect(() => {
    getConfigs();
  }, []);

  const getConfigs = () => {
    setFetching(true);
    ConfigApi.fetchConfig()
      .then((resp) => {
        if (validateResponse(resp)) {
          const { customProps, oauth, enable } = resp.data.data
            .authConfigs?.[0] as any;

          const auths: AuthItems = {
            ...(enable
              ? {
                  local: {
                    label: customProps.label,
                    inputMask: customProps.mask,
                  },
                }
              : {}),
            oauths: oauth,
          };
          setConfigs(auths);
        }
      })
      .catch((e) => {
        message.error(e.message);
      })
      .finally(() => {
        setFetching(false);
      });
  };

  return (
    <Level1SettingPageContentWithList>
      <Level1SettingPageTitleWithBtn>
        {trans("idSource.title")}
      </Level1SettingPageTitleWithBtn>
      <HelpText
        style={{
          marginTop: -20,
          marginLeft: 12,
          marginBottom: 12,
          display: "flex",
        }}
      >
        <span style={{ marginRight: 3 }}>
          {trans("idSource.titleHelpStart")}
        </span>
        <LinkPlusButton
          onClick={() => window.open("/_/#/settings/auth-providers", "_blank")}
        >
          PocketBase
        </LinkPlusButton>
        <span style={{ marginLeft: 3 }}>{trans("idSource.titleHelpEnd")}</span>
      </HelpText>
      <TableStyled
        tableLayout={"auto"}
        scroll={{ x: "100%" }}
        pagination={false}
        rowKey="name"
        loading={fetching}
        dataSource={[
          ...(configs?.local
            ? [
                {
                  name: "local",
                  ...configs?.local,
                },
              ]
            : []),
          ...(configs?.oauths || []),
        ]}
        onRow={(record) => ({
          onClick: () => {
            setSelectItem(record);
            setModalVisible(true);
          },
        })}
      >
        <Column
          title={trans("idSource.loginType")}
          dataIndex="name"
          key="name"
          render={(value, record: any) => (
            <SpanStyled disabled={false}>
              {
                <img
                  src={
                    value === "local" ? GeneralLoginIcon : record.defaultIconUrl
                  }
                  alt={value}
                />
              }
              <span>
                {value === "local"
                  ? trans("idSource.local")
                  : record.defaultName}
              </span>
            </SpanStyled>
          )}
        />
      </TableStyled>
      <CreateModal
        key={modalVisible + ""}
        modalVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
        item={selectItem}
        submit={(item) => {
          dispatch(
            setCustomConfigAction({
              data: {
                auths: {
                  local:
                    item.name === "local"
                      ? {
                          label: item.label,
                          inputMask: item.inputMask,
                        }
                      : configs?.local,
                  ...configs?.oauths.reduce(
                    (result, { name, customIconUrl, customName }) => ({
                      ...result,
                      [name]: {
                        customName,
                        customIconUrl,
                      },
                    }),
                    {}
                  ),
                  ...(item.name !== "local"
                    ? {
                        [item.name]: {
                          customName: item.customName,
                          customIconUrl: item.customIconUrl,
                        },
                      }
                    : {}),
                },
              },
              onSuccess: () => {
                message.success(trans("advanced.saveSuccess"));
                setModalVisible(false);
                getConfigs();
              },
            })
          );
        }}
      />
    </Level1SettingPageContentWithList>
  );
};
