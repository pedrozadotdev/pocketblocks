import { message } from "antd";
import { TacoButton } from "openblocks-design";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateAppMetaAction } from "redux/reduxActions/applicationActions";
import styled from "styled-components";
import { timestampToHumanReadable } from "util/dateTimeUtils";
import { HomeRes } from "./HomeLayout";
import { HomeResTypeEnum } from "../../types/homeRes";
import { updateFolder } from "../../redux/reduxActions/folderActions";
import {
  handleAppEditClick,
  handleAppViewClick,
  handleFolderViewClick,
  HomeResInfo,
} from "../../util/homeResUtils";
import { HomeResOptions } from "./HomeResOptions";
import { trans } from "../../i18n";
import { checkIsMobile } from "util/commonUtils";
import history from "util/history";
import { APPLICATION_VIEW_URL } from "constants/routesURL";
import { TypographyText } from "../../components/TypographyText";
import { useParams } from "react-router-dom";
import { ApplicationDocIcon } from "openblocks-design";
import { AppIcon } from "../../components/AppIcon";

const EditButton = styled(TacoButton)`
  width: 52px;
  height: 24px;
  padding: 5px 12px;
  margin-right: 12px;
  @media screen and (max-width: 500px) {
    display: none;
  }
`;

const ExecButton = styled(TacoButton)`
  width: 52px;
  height: 24px;
  padding: 5px 12px;
  margin-right: 24px;
  background: #fafbff;
  border: 1px solid var(--adm-color-primary-50);
  border-radius: 4px;
  font-weight: 500;
  color: var(--adm-color-primary-link);

  :hover {
    background: #f9fbff;
    border: 1px solid var(--adm-color-primary-link);
    color: var(--adm-color-primary-link);
  }

  @media screen and (max-width: 500px) {
    margin-right: 0;
    display: none;
  }
`;

const Wrapper = styled.div`
  height: 67px;
  padding: 0 6px;
  border-radius: 8px;
  margin-bottom: -1px;
  margin-top: 1px;

  :hover {
    background-color: #f5f7fa;
  }
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  border-bottom: 1px solid #f5f5f6;
  padding: 0 10px;

  path[fill="#2693FF"] {
    fill: var(--adm-color-primary-BB) !important;
  }

  button {
    opacity: 0;
  }

  :hover {
    button {
      opacity: 1;
    }
  }

  @media screen and (max-width: 500px) {
    button {
      opacity: 1;
    }

    padding: 0;
  }
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 14px;
  white-space: nowrap;
  width: 284px;
  height: 100%;
  flex-grow: 1;
  cursor: pointer;
  overflow: hidden;
  padding-right: 12px;

  :hover {
    .ant-typography {
      color: var(--adm-color-primary-BB);
    }
  }

  .ant-typography {
    padding: 2px 2px 8px 2px;
  }
`;

const AppTimeOwnerInfoLabel = styled.div`
  font-size: 13px;
  color: #8b8fa3;
  line-height: 15px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const OperationWrapper = styled.div`
  display: flex;
  align-items: center;
  @media screen and (max-width: 500px) {
    > svg {
      display: none;
    }
  }
`;

const MONTH_MILLIS = 30 * 24 * 60 * 60 * 1000;

export function HomeResCard(props: {
  res: HomeRes;
  onMove: (res: HomeRes) => void;
}) {
  const { res, onMove } = props;
  const [appNameEditing, setAppNameEditing] = useState(false);
  const dispatch = useDispatch();

  const { folderId } = useParams<{ folderId: string }>();

  const subTitle = trans("home.resCardSubTitle", {
    time: timestampToHumanReadable(
      res.lastModifyTime,
      MONTH_MILLIS,
      trans("home.resCardSubTitleTimeFormat")
    ),
  });

  const resInfo = HomeResInfo[res.type];

  if (!resInfo) {
    return null;
  }

  const Icon = resInfo.icon;

  return (
    <Wrapper>
      <Card>
        {res.type === HomeResTypeEnum.Application && (
          <AppIcon appIconUrl={res.appIconUrl} size={24}>
            <ApplicationDocIcon />
          </AppIcon>
        )}
        {Icon && res.type !== HomeResTypeEnum.Application && (
          <Icon
            width={"24px"}
            height={"24px"}
            style={{ marginRight: "10px", flexShrink: 0 }}
          />
        )}
        <CardInfo
          onClick={(e) => {
            if (appNameEditing) {
              return;
            }
            if (res.type === HomeResTypeEnum.Folder) {
              handleFolderViewClick(res.id);
            } else {
              if (checkIsMobile(window.innerWidth)) {
                history.push(APPLICATION_VIEW_URL(res.id, "view"));
                return;
              }
              res.isEditable
                ? handleAppEditClick(e, res.id)
                : handleAppViewClick(res.id);
            }
          }}
        >
          <TypographyText
            value={res.name}
            editing={appNameEditing}
            onChange={(value) => {
              if (!value.trim()) {
                message.warn(trans("home.nameCheckMessage"));
                return;
              }
              if (res.type === HomeResTypeEnum.Folder) {
                dispatch(updateFolder({ id: res.id, name: value }));
              } else {
                dispatch(
                  updateAppMetaAction({
                    applicationId: res.id,
                    name: value,
                    folderId: folderId,
                  })
                );
              }
              setAppNameEditing(false);
            }}
          />
          <AppTimeOwnerInfoLabel title={subTitle}>
            {subTitle}
          </AppTimeOwnerInfoLabel>
        </CardInfo>
        <OperationWrapper>
          {res.isEditable && (
            <EditButton
              onClick={(e) => handleAppEditClick(e, res.id)}
              buttonType="primary"
            >
              {trans("edit")}
            </EditButton>
          )}
          <ExecButton
            onClick={() =>
              res.type === HomeResTypeEnum.Folder
                ? handleFolderViewClick(res.id)
                : handleAppViewClick(res.id)
            }
          >
            {trans("view")}
          </ExecButton>
          <HomeResOptions
            res={res}
            onRename={() => setAppNameEditing(true)}
            onMove={(res) => onMove(res)}
          />
        </OperationWrapper>
      </Card>
    </Wrapper>
  );
}
