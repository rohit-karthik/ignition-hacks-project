<script>
    export let course_name = "Null";
    export let badge = false;
    export let badgeName = "Null";
    export let stars = 5;

    export let image_address = "https://dummyimage.com/450x300/dee2e6/6c757d.jpg";

    export let docID = "Null";

</script>

<div class="col mb-5">
    <div class="card h-100">
        <!-- Sale badge-->
        {#if badge == true}
            <div
                class="badge bg-dark text-white position-absolute"
                style="top: 0.5rem; right: 0.5rem"
            >
                {badgeName}
            </div>
        {/if}
        <!-- Product image-->
        <img
            class="card-img-top"
            src={image_address}
            alt="..."
        />
        <div class="card-body p-4">
            <!-- Product details-->
            <div class="card-body p-4">
                <div class="text-center">
                    <!-- Product name-->
                    <h5 class="fw-bolder">{course_name}</h5>
                </div>
            </div>
            <!-- Product reviews-->
            <div class="d-flex justify-content-center small text-warning mb-2">
                {#each new Array(stars) as star, i}
                    <div class="bi-star-fill" />
                {/each}
                {#each new Array(5 - stars) as star, i}
                    <div class="bi-star" />
                {/each}
            </div>
        </div>
        <!-- Product actions-->
        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
            <div class="text-center">
                <a class="btn btn-outline-dark mt-auto" href="#/course/{docID}">View Course</a>
            </div>
        </div>
    </div>
</div>
