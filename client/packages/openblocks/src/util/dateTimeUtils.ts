import moment from "moment";

export const TIME_FORMAT = "HH:mm:ss";
export const TIME_12_FORMAT = "HH:mm:ss:a";
export const TIME_FORMAT_MINUTES = "HH:mm"
export const DATE_FORMAT = "YYYY-MM-DD";
export const DATE_FORMAT_EN = "MM/DD/YYYY";
export const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
export const DATE_TIME_12_FORMAT = "YYYY-MM-DD HH:mm:ss:a";
export const TIMESTAMP_FORMAT = "x";
export const DateParser = [DATE_TIME_FORMAT, DATE_TIME_12_FORMAT, DATE_FORMAT, TIMESTAMP_FORMAT, DATE_FORMAT_EN];
export const TimeParser = [TIME_12_FORMAT, TIME_FORMAT, TIMESTAMP_FORMAT];
export type PickerMode = "date" | "week" | "month" | "quarter" | "year";

/**
 * timestamp to date string
 * @param timestamp timestamp milliseconds
 * @param timeFormat default value is "YYYY-MM-DD HH:mm"
 * @returns string YYYY-MM-DD HH:mm
 */
export function formatTimestamp(timestamp: number, timeFormat: string = "YYYY-MM-DD HH:mm"): string {
  return moment.unix(timestamp / 1000).format(timeFormat);
}

/**
 * timestamp to human readable string
 * - if timestamp is less than *intervalMillis* ms from now, transform to a time description related to now;
 * - otherwise return the absolute time string
 *
 * @param timestamp timestamp milliseconds
 * @param intervalMillis default value is an hour
 * @param timeFormat default value is "YYYY-MM-DD HH:mm"
 * @returns readable string
 */
export function timestampToHumanReadable(
  timestamp?: number,
  intervalMillis: number = 3600000,
  timeFormat: string = "YYYY-MM-DD HH:mm"
): string {
  if (!timestamp) {
    return "";
  }
  const now = Date.now();
  let timeInfo;
  if (now - new Date(timestamp).getTime() <= intervalMillis) {
    timeInfo = moment(timestamp).fromNow();
  } else {
    timeInfo = moment(timestamp).format(timeFormat);
  }
  return timeInfo;
}
