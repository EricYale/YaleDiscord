class CoursetableManager {
    constructor() {
        this.requestCourseData();
    }

    requestCourseData = async () => {
        const query = `
        {
            listings(where: {season_code: {_eq: "202403"}, subject: {_eq: "CPSC"}}) {
                course_code
                course {
                    title
                }
            }
        }`;

        const data = await fetch("https://api.coursetable.com/ferry/v1/graphql", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: {},
            }),
        });
        const body = await data.json();
        const listings = body.data.listings;
        const uniqueListings = listings.filter(
            (item, pos) => listings.indexOf(item) === pos
        );
        this.listingsCache = uniqueListings;
    }

    getCourseData = () => {
        return this.listingsCache;
    }

    getCourseInfoForCourse = (courseCode) => {
        const data = this.listingsCache.find((item) => item.course_code === courseCode);
        if(!data) return null;
        return data;
    }
}

module.exports = CoursetableManager;
