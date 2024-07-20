import React, { useEffect, useState } from "react";
import style from "./stylesheets/EditProfilePage.module.scss";
import { useParams } from "react-router-dom";
import { faArrowRight, faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import Input from "./Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CourseListing = ({ listing, isAdded, onCourseClicked }) => {
    const code = listing.course_code;
    const title = listing.course.title;
    return (
        <div className={style.course_listing} onClick={() => onCourseClicked(listing)}>
            <span className={style.code}>{code}</span>
            <span className={style.bullet}>•</span>
            <span className={style.title}>{title}</span>
            <FontAwesomeIcon className={style.icon} icon={isAdded ? faCheck : faPlus} />
        </div>
    );
}

const EditProfilePage = () => {
    const { token } = useParams();
    const [data, setData] = useState(null);
    const [myCourses, setMyCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const fetchedData = await fetch("/api/courses");
            const body = await fetchedData.json();
            await setData(body);
        })();
    }, []);


    const removeCourse = (listing) => {
        setMyCourses(myCourses.filter(i => i !== listing.course_code));
    }

    const addCourse = (listing) => {
        if(myCourses.includes(listing.course_code)) return;
        setMyCourses([...myCourses, listing.course_code]);
        setSearchTerm("");
    }

    const listings = data && searchTerm && data
        .filter(i => !myCourses.includes(i.course_code))
        .filter(i => {
            if(i.course_code.toLowerCase().includes(searchTerm.toLowerCase())) return true;
            if(i.course.title.toLowerCase().includes(searchTerm.toLowerCase())) return true;
            return false;
        })
        .map(listing => (
        <CourseListing listing={listing} onCourseClicked={addCourse} />
    ));

    const myCoursesElems = myCourses.map(courseCode => {
        const listing = data.find(i => i.course_code === courseCode);
        return <CourseListing listing={listing} isAdded onCourseClicked={removeCourse} />;
    });

    const confirm = async () => {
        setLoading(true);
        const response = await fetch(`/api/updateSeason`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                courses: myCourses,
                token,
            }),
        });
        if(!response.ok) {
            const code = await response.text();
            window.location.href = `/error/${code}`;
            return;
        }
        window.location.href = "/success";
    };

    if(!token) {
        return (
            <div id={style.edit_profile_page}>
                <h2>Invalid link</h2>
                <p>You've come to an invalid URL. No token specified.</p>
                <div className={style.divider} />
                <a href="/">
                    <Button primary large iconRight icon={faArrowRight}>Go home</Button>
                </a>
            </div>
        )
    }

    return (
        <div id={style.edit_profile_page}>
            <h1>Tell us about yourself...</h1>
            <h2>Tell us what {process.env.REACT_APP_CURRENT_SEASON} computer science classes you're taking so we can add you to the group chat!</h2>
            <div className={style.divider} />
            {myCoursesElems}
            {
                myCourses.length > 0 && (
                    <>
                        <div className={style.divider_small} />
                        <Button
                            large
                            iconRight
                            icon={faArrowRight}
                            disabled={loading}
                            onClick={confirm}
                        >
                            {loading ? "Loading..." : "Confirm"}
                        </Button>
                    </>
                )
            }
            {
                myCourses.length < 5 && (
                    <>
                        <div className={style.divider} />
                        <Input jumbo placeholder="Search CPSC courses..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        {listings}
                    </>
                )
            }
        </div>
    )
};

export default EditProfilePage;
