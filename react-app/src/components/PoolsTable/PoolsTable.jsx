import React from "react";
import PropTypes from "prop-types";
import { AppConstants } from "../../AppConstants";
import './PoolsTable.css';
const PoolsTable = ({ pools, isFetchingPools }) => {

    if (isFetchingPools) {
        return <p>Fetching pools...</p>
    }
    return (
        <div className="pools-table-container">
            <table className="pools-table">
                <thead>
                    <tr>
                        {AppConstants.TABLE_HEADERS.map((header) => (
                            <th key={header} className="table-header">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {pools?.pools?.map((row, rowIndex) => (
                        <tr key={rowIndex} className="table-row">
                            {AppConstants.TABLE_KEYS.map((col, colIndex) => (
                                 <td key={colIndex} className="table-cell">
                                    {row.pool_info[col]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
PoolsTable.propTypes = {
    pools: PropTypes.object,
    isFetchingPools: PropTypes.bool,
}
export default PoolsTable;