/**
 *
 * @param {any[]} array
 * @param {number} pageSize
 * @returns
 */
const paginate = (array, pageSize) => {
    const pages = {
        data: [],
        pageSize,
        currentPage: 0,
        getCurrentPageData() {
            return this.data[this.currentPage];
        },
        goPreviousPage() {
            if (this.currentPage > 0) {
                this.currentPage--;
            }
        },
        goNextPage() {
            if (this.currentPage < this.data.length) {
                this.currentPage++;
            }
        }
    };
    for (let i = 0; i < array.length; i += pages.pageSize) {
        const page = array.slice(i, i + pages.pageSize);
        pages.data.push(page);
    }
    return pages;
};

module.exports = paginate;
