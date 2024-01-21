import { useState } from "react";
import { CustomModalStyled, TacoInputStyled } from "../theme/styledComponents";
import { trans } from "i18n";
import styled from "styled-components";
import {
  HeadNameWrapper,
  ProfileImageWrapper,
  StyledFormInput,
  StyledProfileImage,
} from "../profile/profileComponets";
import { checkUrlValid } from "util/stringUtils";
import { HelpText } from "components/HelpText";
import LinkPlusButton from "@openblocks-ee/components/LinkPlusButton";

const ModalContent = styled.div`
  .section-title {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
    display: flex;
    flex-direction: row;

    span {
      margin-right: 5px;
    }
    button {
      margin-top: 5px;

      span {
        color: var(--adm-color-primary);
      }

      span:hover {
        color: var(--adm-color-text) !important;
      }
    }
  }

  .section-content {
    margin-bottom: 16px;
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
    width: 75%;
    height: 75%;
    object-fit: cover;
    border-radius: 10px !important;
  }
`;

type CreateModalProp = {
  item: any;
  closeModal: () => void;
  modalVisible: boolean;
  submit: (item: any) => void;
};

function CreateModal(props: CreateModalProp) {
  const { item, submit, closeModal, modalVisible } = props;
  const [editItem, setEditItem] = useState(item);

  function handleOk() {
    submit(editItem);
  }

  return (
    <CustomModalStyled
      width="450px"
      title={
        trans("idSource.modalTitle") +
        (item?.defaultName || trans("idSource.local"))
      }
      visible={modalVisible}
      onOk={handleOk}
      okButtonProps={{
        disabled: JSON.stringify(item) === JSON.stringify(editItem),
      }}
      onCancel={closeModal}
      destroyOnClose
      draggable={true}
    >
      {item && (
        <>
          {item.name === "local" ? (
            <ModalContent>
              <div className="section-title">
                {trans("idSource.customLabelLabel")}
              </div>
              <div className="section-content">
                <TacoInputStyled
                  defaultValue={editItem.label}
                  placeholder={trans("idSource.customLabelPlaceholder")}
                  onChange={(e) => {
                    setEditItem((item: any) => ({
                      ...item,
                      label: e.target.value,
                    }));
                  }}
                />
              </div>
              <div className="section-title">
                <span>{trans("idSource.inputMaskLabel")}</span>
                <LinkPlusButton
                  onClick={() =>
                    window.open(
                      "https://github.com/eduardoborges/use-mask-input",
                      "_blank"
                    )
                  }
                >
                  {trans("idSource.useMaskInputLink")}
                </LinkPlusButton>
              </div>
              <div className="section-content">
                <TacoInputStyled
                  defaultValue={editItem.inputMask}
                  placeholder={trans("idSource.inputMaskPlaceholder")}
                  onChange={(e) => {
                    setEditItem((item: any) => ({
                      ...item,
                      inputMask: e.target.value,
                    }));
                  }}
                />
              </div>
            </ModalContent>
          ) : (
            <ModalContent>
              <div className="section-title">
                {trans("idSource.customIconUrlLabel")}
              </div>
              <div className="section-content">
                <HeadNameWrapper style={{ padding: 0 }}>
                  <ImageWrapper>
                    <ProfileImageWrapper>
                      <StyledProfileImage
                        key={editItem.customIconUrl}
                        size={72}
                        source={
                          editItem.customIconUrl
                            ? editItem.customIconUrl
                            : editItem.defaultIconUrl
                        }
                        userName=""
                      />
                    </ProfileImageWrapper>
                  </ImageWrapper>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <StyledFormInput
                      initialValue={editItem.customIconUrl}
                      label={String.fromCharCode(173)}
                      onChange={(value, valid) =>
                        valid &&
                        setEditItem((item: any) => ({
                          ...item,
                          customIconUrl: value,
                        }))
                      }
                      placeholder={trans("idSource.customIconUrlPlaceholder")}
                      checkRule={{
                        check: (value) => !value || checkUrlValid(value),
                        errorMsg: trans("idSource.customIconUrlCheckMsg"),
                      }}
                    />
                    <HelpText style={{ marginTop: -16 }}>
                      {trans("idSource.customIconUrlHelp")}
                    </HelpText>
                  </div>
                </HeadNameWrapper>
              </div>
              <div className="section-title">
                {trans("idSource.customNameLabel")}
              </div>
              <div className="section-content">
                <TacoInputStyled
                  defaultValue={editItem.customName}
                  placeholder={trans("idSource.customNamePlaceholder")}
                  onChange={(e) => {
                    setEditItem((item: any) => ({
                      ...item,
                      customName: e.target.value,
                    }));
                  }}
                />
              </div>
            </ModalContent>
          )}
        </>
      )}
    </CustomModalStyled>
  );
}

export default CreateModal;
