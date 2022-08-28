<script>
    import "./css/styles.css";
    import "./css/searchbar_style.css";
    import { count, names } from "./stores/history";

    let notes = [];
    let note = "";

    let stars = 5;

    export let params = {};

    import { app } from "./javascript/firebaseInit";
    import { getDoc, doc, getFirestore } from "firebase/firestore/lite";

    const db = getFirestore(app);
    const docRef = doc(db, "courses", params.id);

    let course_name = "";
    let course_description = "";
    let course_transcript = "";
    let course_video = "";

    async function getDetails() {
        const docSnap = await getDoc(docRef);
        course_name = docSnap.data().name;
        course_description = docSnap.data().desc;
        course_transcript = docSnap.data().transcript;
        course_video = docSnap.data().vid;

        count.update((n) => n + 1);
        names.update((n) => [
            ...n,
            {
                name: course_name,
                link: window.location.href,
            },
        ]);
    }

    getDetails();

    let historyValue;
    let historyNames;
    count.subscribe((value) => {
        historyValue = value;
    });
    names.subscribe((value) => {
        historyNames = value;
    });
</script>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container px-4 px-lg-5">
        <a href="#/" class="navbar-brand">
            <i class="bi-chevron-left" />
            Back
        </a>
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

<div class="bg-dark py-5 mb-5">
    <h1 class="text-light">
        <center>{course_name}</center>
    </h1>
    <div class="row justify-content-center">
        <div class="col-auto">
            <h5 class="text-white-50">Rating:</h5>
        </div>
        <div class="col-auto">
            <div class="d-flex small text-warning mb-2">
                {#each new Array(stars) as star, i}
                    <div class="bi-star-fill" />
                {/each}
                {#each new Array(5 - stars) as star, i}
                    <div class="bi-star" />
                {/each}
            </div>
        </div>
    </div>
</div>
<div class="container-fluid">
    <div class="row">
        <div class="col">
            <video width="1080" height="607.5" controls>
                <track kind="captions" />
                <source src={course_video} type="video/mp4" />
                Your browser does not support HTML video.
            </video>
        </div>
        <div class="col">
            <b>Course Description:</b>
            <p>
                {course_description}
            </p>
            <hr />
            <p>Your Notes:</p>
            <ul>
                {#each notes as note, i}
                    <div class="row">
                        <div class="col">
                            <li>{note}</li>
                        </div>
                        <div class="col">
                            <button
                                class="btn-close btn-sm"
                                on:click={() => {
                                    notes.splice(i);
                                    notes = notes;
                                }}
                            />
                        </div>
                    </div>
                {/each}
            </ul>
            <textarea
                class="form-control my-2 me-2"
                placeholder="Take a note"
                bind:value={note}
                on:keypress={(e) => {
                    if (e.key === "Enter" && note !== "") {
                        e.preventDefault();
                        notes = [...notes, note];
                        note = "";
                        return false;
                    }
                    return true;
                }}
            />
        </div>
    </div>
    <div class="row">
        <div class="col">
            <b>Transcript:</b>
            {#if course_transcript == ""}
                <p>The creator hasn't added a transcript.</p>
            {:else}
                <p>{course_transcript}</p>
            {/if}
        </div>
    </div>
</div>
