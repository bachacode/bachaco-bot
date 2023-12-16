exports.paginate = function (array, pageSize) {
    const paginatedObject = {
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
    for (let i = 0; i < array.length; i += paginatedObject.pageSize) {
        const page = array.slice(i, i + paginatedObject.pageSize);
        paginatedObject.data.push(page);
    }
    return paginatedObject;
};
