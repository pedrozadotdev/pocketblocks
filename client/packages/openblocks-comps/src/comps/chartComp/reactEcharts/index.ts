import * as echarts from "echarts";
import { EChartsReactProps, EChartsOption, EChartsInstance } from "./types";
import EChartsReactCore from "./core";
import * as locales from "../../../i18n/comps/locales/echarts";

Object.keys(locales).forEach((l) => {
  echarts.registerLocale(
    l.toUpperCase(),
    locales[l as keyof typeof locales] as any
  );
});

/**
 * reference: https://github.com/hustcc/echarts-for-react
 * add exception-catch for setOption
 * if query isn't successfully loaded, chart will fail to load and can't reload
 */
export type { EChartsReactProps, EChartsOption, EChartsInstance };

// export the Component the echarts Object.
export default class EChartsReact extends EChartsReactCore {
  constructor(props: EChartsReactProps) {
    super(props);

    // initialize as echarts package
    this.echarts = echarts;
  }
}
