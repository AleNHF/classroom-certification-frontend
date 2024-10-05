export interface TableComponentProps {
    headers: string[];
    rows: Array<{ [key: string]: string | React.ReactNode }>;
}