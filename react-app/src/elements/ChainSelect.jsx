import React from 'react';
import { AppConstants } from '../AppConstants';
import PropTypes from 'prop-types';

const ChainSelect = ({ selectedChain, handleChange }) => {
    const options = Object.keys(AppConstants.ChainIds).map((key) => ({
        value: AppConstants.ChainIds[key],
        label: AppConstants.ChainLabels[key]
    }));

    return (
        <div>
            <label htmlFor="dropdown">Choose an option: </label>
            <select
                id="dropdown"
                value={selectedChain}
                onChange={handleChange}
                style={{ padding: "5px", margin: "10px 0" }}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {selectedChain && <p>You selected: {selectedChain}</p>}
        </div>
    )
}
ChainSelect.propTypes = {
    selectedChain: PropTypes.string,
    handleChange: PropTypes.func
};

export default ChainSelect