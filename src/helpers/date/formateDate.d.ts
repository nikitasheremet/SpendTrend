export declare enum DateFormat {
    YYYY_MM_DD = "YYYY-MM-DD",
    DD_MMMM_YYYY = "DD-MMMM-YYYY"
}
export declare function formatDate(date: Date | string | number, format: DateFormat): string;
