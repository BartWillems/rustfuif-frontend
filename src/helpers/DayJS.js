import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

const DayJS = dayjs.extend(relativeTime).extend(duration);

export default DayJS;
