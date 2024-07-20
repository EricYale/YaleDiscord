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

    useEffect(() => {
        (async () => {
            // const fetchedData = await fetch("/api/courses");
            // const body = await fetchedData.json();
            const body = [{"course_code":"CPSC 100","course":{"title":"Introduction to Computing and Programming"}},{"course_code":"CPSC 110","course":{"title":"Python Programming for Humanities and Social Sciences"}},{"course_code":"CPSC 110","course":{"title":"Python Programming for Humanities and Social Sciences"}},{"course_code":"CPSC 110","course":{"title":"Python Programming for Humanities and Social Sciences"}},{"course_code":"CPSC 110","course":{"title":"Python Programming for Humanities and Social Sciences"}},{"course_code":"CPSC 110","course":{"title":"Python Programming for Humanities and Social Sciences"}},{"course_code":"CPSC 110","course":{"title":"Python Programming for Humanities and Social Sciences"}},{"course_code":"CPSC 123","course":{"title":"YData: An Introduction to Data Science"}},{"course_code":"CPSC 150","course":{"title":"Computer Science and the Modern Intellectual Agenda"}},{"course_code":"CPSC 171","course":{"title":"Introduction to AI Applications"}},{"course_code":"CPSC 183","course":{"title":"Law, Technology, and Culture"}},{"course_code":"CPSC 200","course":{"title":"Introduction to Information Systems"}},{"course_code":"CPSC 201","course":{"title":"Introduction to Computer Science"}},{"course_code":"CPSC 202","course":{"title":"Mathematical Tools for Computer Science"}},{"course_code":"CPSC 223","course":{"title":"Data Structures and Programming Techniques"}},{"course_code":"CPSC 323","course":{"title":"Introduction to Systems Programming and Computer Organization"}},{"course_code":"CPSC 327","course":{"title":"Object-Oriented Programming"}},{"course_code":"CPSC 334","course":{"title":"Creative Embedded Systems"}},{"course_code":"CPSC 364","course":{"title":"Introduction to Blockchains, Cryptocurrencies, Smart Contracts, and Decentralized Applications"}},{"course_code":"CPSC 365","course":{"title":"Algorithms"}},{"course_code":"CPSC 413","course":{"title":"Computer System Security"}},{"course_code":"CPSC 416","course":{"title":"Lattices and Post-Quantum Cryptography"}},{"course_code":"CPSC 417","course":{"title":"Advanced Topics in Cryptography: Cryptography and Computation"}},{"course_code":"CPSC 421","course":{"title":"Compilers and Interpreters"}},{"course_code":"CPSC 426","course":{"title":"Building Distributed Systems"}},{"course_code":"CPSC 427","course":{"title":"C++ Programming for Stability, Security, and Speed"}},{"course_code":"CPSC 429","course":{"title":"Principles of Computer System Design"}},{"course_code":"CPSC 431","course":{"title":"Computer Music: Algorithmic and Heuristic Composition"}},{"course_code":"CPSC 437","course":{"title":"Database Systems"}},{"course_code":"CPSC 439","course":{"title":"Software Engineering"}},{"course_code":"CPSC 440","course":{"title":"Database Design and Implementation"}},{"course_code":"CPSC 446","course":{"title":"Data and Information Visualization"}},{"course_code":"CPSC 447","course":{"title":"Introduction to Quantum Computing"}},{"course_code":"CPSC 448","course":{"title":"Silicon Compilation"}},{"course_code":"CPSC 450","course":{"title":"Sustainable Computing"}},{"course_code":"CPSC 454","course":{"title":"Software Analysis and Verification"}},{"course_code":"CPSC 455","course":{"title":"Algorithmic Game Theory"}},{"course_code":"CPSC 459","course":{"title":"Building Interactive Machines"}},{"course_code":"CPSC 464","course":{"title":"Algorithms and their Societal Implications"}},{"course_code":"CPSC 466","course":{"title":"Blockchain and Cryptocurrency"}},{"course_code":"CPSC 468","course":{"title":"Computational Complexity"}},{"course_code":"CPSC 473","course":{"title":"Intelligent Robotics Laboratory"}},{"course_code":"CPSC 474","course":{"title":"Computational Intelligence for Games"}},{"course_code":"CPSC 475","course":{"title":"Computational Vision and Biological Perception"}},{"course_code":"CPSC 478","course":{"title":"Computer Graphics"}},{"course_code":"CPSC 483","course":{"title":"Deep Learning on Graph-Structured Data"}},{"course_code":"CPSC 490","course":{"title":"Senior Project"}},{"course_code":"CPSC 513","course":{"title":"Computer System Security"}},{"course_code":"CPSC 516","course":{"title":"Lattices and Post-Quantum Cryptography"}},{"course_code":"CPSC 517","course":{"title":"Advanced Topics in Cryptography: Cryptography and Computation"}},{"course_code":"CPSC 521","course":{"title":"Compilers and Interpreters"}},{"course_code":"CPSC 526","course":{"title":"Building Distributed Systems"}},{"course_code":"CPSC 527","course":{"title":"C++ Programming for Stability, Security, and Speed"}},{"course_code":"CPSC 529","course":{"title":"Principles of Computer System Design"}},{"course_code":"CPSC 531","course":{"title":"Computer Music: Algorithmic and Heuristic Composition"}},{"course_code":"CPSC 537","course":{"title":"Database Systems"}},{"course_code":"CPSC 539","course":{"title":"Software Engineering"}},{"course_code":"CPSC 540","course":{"title":"Database Design and Implementation"}},{"course_code":"CPSC 546","course":{"title":"Data and Information Visualization"}},{"course_code":"CPSC 547","course":{"title":"Introduction to Quantum Computing"}},{"course_code":"CPSC 550","course":{"title":"Sustainable Computing"}},{"course_code":"CPSC 554","course":{"title":"Software Analysis and Verification"}},{"course_code":"CPSC 555","course":{"title":"Algorithmic Game Theory"}},{"course_code":"CPSC 559","course":{"title":"Building Interactive Machines"}},{"course_code":"CPSC 564","course":{"title":"Algorithms and their Societal Implications"}},{"course_code":"CPSC 566","course":{"title":"Blockchain and Cryptocurrency"}},{"course_code":"CPSC 568","course":{"title":"Computational Complexity"}},{"course_code":"CPSC 573","course":{"title":"Intelligent Robotics Laboratory"}},{"course_code":"CPSC 574","course":{"title":"Computational Intelligence for Games"}},{"course_code":"CPSC 575","course":{"title":"Computational Vision and Biological Perception"}},{"course_code":"CPSC 578","course":{"title":"Computer Graphics"}},{"course_code":"CPSC 583","course":{"title":"Deep Learning on Graph-Structured Data"}},{"course_code":"CPSC 611","course":{"title":"Topics in Computer Science and Global Affairs"}},{"course_code":"CPSC 646","course":{"title":"Combinatorial Optimization and Approximation Algorithms"}},{"course_code":"CPSC 648","course":{"title":"Quantum Codes and Applications to Complexity"}},{"course_code":"CPSC 690","course":{"title":"Independent Project I"}},{"course_code":"CPSC 691","course":{"title":"Independent Project II"}},{"course_code":"CPSC 692","course":{"title":"Independent Project"}},{"course_code":"CPSC 990","course":{"title":"Ethical Conduct of Research for Master’s Students"}},{"course_code":"CPSC 991","course":{"title":"Ethical Conduct of Research"}},{"course_code":"CPSC 992","course":{"title":"Academic Writing"}}];
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
                        <Button large iconRight icon={faArrowRight}>Confirm</Button>
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
