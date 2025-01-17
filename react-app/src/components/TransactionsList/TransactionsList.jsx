import React from 'react'
import PropTypes from 'prop-types'

const TransactionsList = ({ hashes, isFetchingHashes, url }) => {
    return (
        <div>
            {isFetchingHashes ? (
                <p>Fetching transactions...</p>
            ) : (
                <ul>
                    {hashes?.map((hash, index) => (
                        <li key={index}>
                            <a href={`${url}/tx/${hash}`}>
                                {hash}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
TransactionsList.propTypes = {
    hashes: PropTypes.array,
    isFetchingHashes: PropTypes.bool,
    url: PropTypes.string
}

export default TransactionsList