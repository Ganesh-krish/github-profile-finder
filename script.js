const usernameInput = document.getElementById("username");
const searchBtn = document.getElementById("searchBtn");
const profile = document.getElementById("profile");


// ========================================
// 1. Get GitHub User
// ========================================

async function getUser(username) {

    const response = await fetch(
        `https://api.github.com/users/${username}`
    );

    if (!response.ok) {
        throw new Error("User not found");
    }

    const data = await response.json();

    return data;
}


// ========================================
// 2. Get GitHub Repositories
// ========================================

async function getRepositories(username) {

    const response = await fetch(
        `https://api.github.com/users/${username}/repos`
    );

    if (!response.ok) {
        throw new Error("Unable to fetch repositories");
    }

    const repositories = await response.json();

    return repositories;
}


// ========================================
// 3. Display Profile
// ========================================

function displayProfile(data, repositories) {

    const repoHTML = repositories
        .slice(0, 5)
        .map(repo => `
            <div class="repo">

                <h3>
                    <a 
                        href="${repo.html_url}" 
                        target="_blank"
                    >
                        ${repo.name}
                    </a>
                </h3>

                <p>
                    ${repo.description || "No description"}
                </p>

                <div class="repo-info">

                    <span>
                        ⭐ ${repo.stargazers_count}
                    </span>

                    <span>
                        🍴 ${repo.forks_count}
                    </span>

                    <span>
                        ${repo.language || "Unknown"}
                    </span>

                </div>

            </div>
        `)
        .join("");


    profile.innerHTML = `
        <div class="profile-card">

            <img 
                src="${data.avatar_url}" 
                alt="${data.login}"
            >

            <h2>
                ${data.name || data.login}
            </h2>

            <p>
                @${data.login}
            </p>

            <p>
                ${data.bio || "No bio available"}
            </p>

            <div class="stats">

                <p>
                    Followers: ${data.followers}
                </p>

                <p>
                    Following: ${data.following}
                </p>

                <p>
                    Repositories: ${data.public_repos}
                </p>

            </div>

            <p>
                Location: ${data.location || "Not available"}
            </p>

            <a 
                href="${data.html_url}" 
                target="_blank"
            >
                View GitHub Profile
            </a>

            <h2>
                Repositories
            </h2>

            <div class="repositories">

                ${repoHTML}

            </div>

            <a 
                href="https://github.com/${data.login}?tab=repositories"
                target="_blank"
            >
                View All Repositories
            </a>

        </div>
    `;
}


// ========================================
// 4. Handle Search
// ========================================

async function handleSearch() {

    const username = usernameInput.value.trim();

    // Check empty input
    if (username === "") {

        profile.innerHTML =
            "<p>Please enter a GitHub username.</p>";

        return;
    }


    // Show loading
    profile.innerHTML = "<p>Loading...</p>";


    try {

        // Run both API requests at the same time
        const [data, repositories] = await Promise.all([
            getUser(username),
            getRepositories(username)
        ]);


        // Display the result
        displayProfile(data, repositories);

    } catch (error) {

        console.error(error);

        profile.innerHTML = `
            <p>${error.message}</p>
        `;
    }
}


// ========================================
// 5. Event Listeners
// ========================================

searchBtn.addEventListener("click", handleSearch);


usernameInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        handleSearch();

    }

});