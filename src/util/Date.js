import { utcToZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import { ja } from "date-fns/esm/locale";

export const japDate = (date, pattern) => {
	const timeZone = "Asia/Tokyo";
	const zonedDate = utcToZonedTime(date, timeZone);
	return format(zonedDate, pattern, {
		locale: ja
	});
};
