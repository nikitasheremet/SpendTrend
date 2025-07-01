export var DateFormat;
(function (DateFormat) {
    DateFormat["YYYY_MM_DD"] = "YYYY-MM-DD";
    DateFormat["DD_MMMM_YYYY"] = "DD-MMMM-YYYY";
})(DateFormat || (DateFormat = {}));
export function formatDate(date, format) {
    const dateObject = new Date(date);
    switch (format) {
        case DateFormat.YYYY_MM_DD:
            return dateObject.toISOString().split('T')[0];
        case DateFormat.DD_MMMM_YYYY:
            return dateObject.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        default:
            return dateObject.toString();
    }
}
