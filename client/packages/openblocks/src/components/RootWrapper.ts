import styled from "styled-components";

const WrapperContainer = styled.div<{ headerColor?: string }>`
  --antd-wave-shadow-color: ${(props) => props.headerColor || "#3377ff"};
  --adm-color-primary: ${(props) => props.headerColor || "#1677ff"};
  --adm-color-primary-link: ${(props) => props.headerColor || "#4965f2"};
  --adm-color-primary-disabled: ${(props) => props.headerColor ? props.headerColor + "10" : "#dbe1fd"};
  .ant-spin-dot-item {
    background-color: ${(props) => props.headerColor || "#3377ff"};
  }
  .ant-menu-vertical .ant-menu-item::after,
  .ant-menu-vertical-left .ant-menu-item::after,
  .ant-menu-vertical-right .ant-menu-item::after,
  .ant-menu-inline .ant-menu-item::after {
    border-right: 3px solid ${(props) => props.headerColor || "#3377ff"};
  }
  .ant-menu-item-selected {
    color: ${(props) => props.headerColor || "#3377ff"};
  }
  .ant-menu-light .ant-menu-item:hover,
  .ant-menu-light .ant-menu-item-active,
  .ant-menu-light .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
  .ant-menu-light .ant-menu-submenu-active,
  .ant-menu-light .ant-menu-submenu-title:hover {
    color: ${(props) => props.headerColor || "#3377ff"};
  }
  .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
    background-color: ${(props) => props.headerColor || "#3377ff"}10;
  }
  .ant-menu-item:active,
  .ant-menu-submenu-title:active {
    background: ${(props) => props.headerColor || "#3377ff"}10;
  }
  .ant-btn-default {
    background: var(--adm-color-primary-link) !important;
    border: 1px solid var(--adm-color-primary-link) !important;
  }
  .ant-btn-default:disabled {
    background: var(--adm-color-primary-disabled) !important;
    border: 1px solid var(--adm-color-primary-disabled) !important;
  }
  .ant-input:focus,
  .ant-input-focused {
    border: 1px solid ${(props) => props.headerColor || "#3377ff"};
    box-shadow: 0 0 0 2px ${(props) => props.headerColor || "#3377ff"}10;
  }
  .ant-input-affix-wrapper-focused {
    border-color: ${(props) => props.headerColor || "#3377ff"} !important;
    box-shadow: 0 0 0 2px ${(props) => props.headerColor || "#3377ff"}10 !important;
  }
  .ant-input-affix-wrapper > input:focus {
    border: none;
  }
  #icon-application-home-active_svg__a stop {
    stop-color: ${(props) => props.headerColor || "var(--adm-color-primary-link)"} !important;
  }
  .sidebar-item-active {
    background: ${(props) => props.headerColor ? props.headerColor + "10" : "#ebf0f7"} !important;
    color: ${(props) => props.headerColor || "var(--adm-color-primary-link)"} !important;
  }
`;

export default WrapperContainer;
