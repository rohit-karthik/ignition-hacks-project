<script>
    import "./css/styles.css";
    import "./css/searchbar_style.css";
    import Course from "./components/Course.svelte";
    import { count, names } from "./stores/history";

    import { app } from "./javascript/firebaseInit";
    import {
        getStorage,
        ref,
        uploadBytes,
        getDownloadURL,
    } from "firebase/storage";
    import {
        getFirestore,
        collection,
        getDocs,
        addDoc,
    } from "firebase/firestore/lite";

    let newName = "";
    let newDescription = "";
    let courseTranscript = "";

    let courseVid = "";
    let coverImg = "";

    let courseUploaded = 0;
    let coverImgUploaded = 0;

    let errorMsg = "";
    let uploadMsg = "";
    let uploadMsg2 = "";

    let allCourses = [];

    async function addCourse() {
        if (courseUploaded == 0) {
            errorMsg = "Please upload a course video";
            return;
        }

        if (coverImgUploaded == 0) {
            errorMsg = "Please upload a cover image";
            return;
        }

        if (newName == "") {
            errorMsg = "Please enter a course name";
            return;
        }

        if (newDescription == "") {
            errorMsg = "Please enter a course description";
            return;
        }

        errorMsg = "";

        // add course to firestore
        const course = {
            name: newName,
            desc: newDescription,
            transcript: courseTranscript,
            vid: courseVid,
            img: coverImg,
        };

        const db = getFirestore(app);
        await addDoc(collection(db, "courses"), course);

        window.location.reload();
    }

    async function uploadCourse(e) {
        uploadMsg = "Uploading...";
        // upload file to firebase storage
        const file = e.target.files[0];
        const storageRef = ref(getStorage(), file.name);
        await uploadBytes(storageRef, file);

        courseVid = await getDownloadURL(storageRef);
        courseUploaded = 1;

        uploadMsg = "";
    }

    async function uploadFile(e) {
        uploadMsg2 = "Uploading...";
        // upload file to firebase storage
        const file = e.target.files[0];
        const storageRef = ref(getStorage(), file.name);
        await uploadBytes(storageRef, file);

        coverImg = await getDownloadURL(storageRef);
        coverImgUploaded = 1;

        uploadMsg2 = "";
    }

    let allDocIDs = [];

    async function getCourses() {
        const db = getFirestore(app);
        const courseCol = collection(db, "courses");
        const courseSnapshot = await getDocs(courseCol);
        allCourses = courseSnapshot.docs.map((doc) => doc.data());
        allDocIDs = courseSnapshot.docs.map((doc) => doc.id);
    }

    getCourses();

    let searchTerm = "";

    let historyValue;
    let historyNames;
    count.subscribe((value) => {
        historyValue = value;
    });
    names.subscribe((value) => {
        historyNames = value;
    });
</script>

<div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
>
    <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Add a Course</h5>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                />
            </div>
            <div class="modal-body">
                <form>
                    <div class="mb-3">
                        <label for="course-name" class="col-form-label"
                            >Course Name:</label
                        >
                        <input
                            type="text"
                            class="form-control"
                            id="course-name"
                            bind:value={newName}
                        />
                    </div>
                    <div class="mb-3">
                        <label for="course-description" class="col-form-label"
                            >Course Description:</label
                        >
                        <textarea
                            class="form-control"
                            id="course-description"
                            bind:value={newDescription}
                        />
                    </div>
                    <div class="mb-3">
                        <label for="course-image" class="col-form-label"
                            >Cover Image:</label
                        >
                        <p class="text-warning">{uploadMsg2}</p>
                        <input
                            type="file"
                            class="form-control"
                            id="course-image"
                            accept="image/png,image/jpg,image/jpeg"
                            on:change={uploadFile}
                        />
                    </div>
                    <div class="mb-3">
                        <label for="course-image" class="col-form-label"
                            >Upload your Course:</label
                        >
                        <p class="text-warning">{uploadMsg}</p>
                        <input
                            type="file"
                            class="form-control"
                            id="course-image"
                            accept=".mp4,.mov,.mpeg,.webm,.ogg,.avi,.wmv"
                            on:change={uploadCourse}
                        />
                    </div>
                    <div class="mb-3">
                        <label for="course-description" class="col-form-label"
                            >Course Transcript (optional):</label
                        >
                        <textarea
                            class="form-control"
                            id="course-description"
                            rows="7"
                            bind:value={courseTranscript}
                        />
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <p style="color: red;">{errorMsg}</p>
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">Close</button
                >
                <button
                    type="button"
                    class="btn btn-success"
                    on:click={addCourse}>Add Your Course</button
                >
            </div>
        </div>
    </div>
</div>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container px-4 px-lg-5">
        <a class="navbar-brand" href="#!">Coder's WRLD</a>
        <input
            class="form-control my-2 me-2 inputStyle"
            placeholder="Search for courses"
            bind:value={searchTerm}
        />
        <form class="d-flex">
            <div class="dropdown">
                <button
                    class="btn btn-outline-dark"
                    type="submit"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <i class="bi-archive-fill me-1" />
                    Past Courses
                    <span class="badge bg-dark text-white ms-1 rounded-pill"
                        >{historyValue}</span
                    >
                </button>
                <ul class="dropdown-menu">
                    {#each historyNames as pastCourse}
                        <li><a href={pastCourse.link} class="dropdown-item">{pastCourse.name}</a></li>
                    {/each}
                </ul>
            </div>
        </form>
    </div>
</nav>
<header class="bg-dark py-5">
    <div class="container px-4 px-lg-5 my-5">
        <div class="text-center text-white">
            <h1 class="display-4 fw-bolder">Join this WRLD</h1>
            <p class="lead fw-normal text-white-50 mb-0">The WRLD of Coding!</p>
            <button
                type="button"
                class="btn btn-success mt-3"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
            >
                <i class="bi bi-plus-circle-fill me-1" />
                Add a Course
            </button>
        </div>
    </div>
</header>
<section class="py-5">
    <div class="container px-4 px-lg-5 mt-5">
        <div
            class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center"
        >
            {#each allCourses as course, i}
                {#if course.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())}
                    <Course
                        course_name={course.name}
                        image_address={course.img}
                        docID={allDocIDs[i]}
                    />
                {/if}
            {/each}
        </div>
    </div>
</section>
<footer class="py-5 bg-dark">
    <div class="container">
        <p class="m-0 text-center text-white">
            Copyright &copy; Sanjay/Rohit 2022
        </p>
    </div>
</footer>
