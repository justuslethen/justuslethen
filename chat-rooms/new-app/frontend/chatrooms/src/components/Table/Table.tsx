import styles from './Table.module.css';
import { t } from '../../i18n.ts';

interface TableProps {
    table: string[][]; // table prop as 2D array of strings
}

const Table = (props: TableProps) => {
    if (!props.table || props.table.length === 0) {
        return <div className={styles.tableContainer}>{t("table.empty")}</div>;
    }

    return (
        <div className={styles.tableContainer}>
            {props.table.map((rowItem, rowIndex) => {
                return (
                    <div key={rowIndex} className={styles.tableRow}>
                        {rowItem.map((colData, colIndex) => {
                            return (
                                <div key={colIndex} className={styles.tableCol}>
                                    {colData}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default Table;