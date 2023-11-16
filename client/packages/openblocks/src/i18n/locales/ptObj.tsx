/* eslint-disable only-ascii/only-ascii */
import { enObj } from "./enObj";
import { I18nObjects } from "./types";

export const ptObj: I18nObjects = {
  ...enObj,
  editorTutorials: {
    mockScript: "return new Promise(r => {\n  setTimeout(() => r([\n    { name: \"Ron Cormier\", avatar: \"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1199.jpg\", city: \"Port Isadore\", email: \"Letitia.Luettgen39@yahoo.com\", createAt: \"2022-11-01T10:29:17.119Z\", id: 1 },\n    { name: \"Glen Quitzon\", avatar: \"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/729.jpg\", city: \"Sporerside\", email: \"Candice_Schimmel@yahoo.com\", createAt: \"2022-11-01T16:42:37.766Z\", id: 2 },\n    { name: \"Tamara Kreiger III\", avatar: \"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/992.jpg\", city: \"West Maryam\", email: \"Margie_Lynch@gmail.com\", createAt: \"2022-11-01T19:58:12.285Z\", id: 3 },\n    { name: \"Edgar Stokes\", avatar: \"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/25.jpg\", city: \"North Richland Hills\", email: \"Jan77@gmail.com\", createAt: \"2022-11-01T23:39:32.720Z\", id: 4 },\n  ]), 500)\n})",
    data: (code) => (
      <>
        O componente e os dados da consulta estão listados aqui, os quais podem ser referenciados por
        {code("{{ }}")}. Por exemplo: {code("{{table1.selectedRow}}")}.
      </>
    ),
    compProperties: (code) => (
      <>
        Quando um componente é selecionado, as propriedades dele são mostradas no painel direito
        {code("{{query1.data}}")}. Para referenciar os dados já consultados, você pode usar na caixa de texto
        {code("{{ }}")}
        o seguinte JavaScript.
      </>
    ),
  },
};
