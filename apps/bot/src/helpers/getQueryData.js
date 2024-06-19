/**
 *
 * @param {string} query
 * @returns {{url:string, queryIndex: number}}
 */
const getQueryData = (query) => {
    let queryIndex, url;

    if (query.includes('&list=') && query.includes('watch?v=')) {
        url = query.replace(/watch\?v=[^&]+/, 'playlist').replace(/playlist&/, 'playlist?');

        if (query.includes('&index=')) {
            queryIndex = query.match(/&index=(\d+)/)[1];
            query = query.replace(/&index=\d+/, '');
        }
    } else {
        url = query;
    }

    return {
        url,
        queryIndex
    };
};

export default getQueryData;
