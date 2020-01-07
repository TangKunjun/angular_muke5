import { differenceInYears, isDate, isFuture, isValid} from "date-fns";

export const isValidDate = (val: string): boolean => {
    const date = new Date(val);
    return isDate(date) &&
        isValid(date) &&
        !isFuture(date) &&  // 如果不是未来的日期
        differenceInYears(Date.now(), date) < 150; // 和当前的时间小于150年
}
