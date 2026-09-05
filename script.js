const usernameInput = document.getElementById("username");
const searchBtn = document.getElementById("searchBtn");
const profile = document.getElementById("profile");



function handleResponse(response) {

    if (response.status === 404) {
        throw new Error("Resource not found");
    }

    if (response.status === 403) {
        throw new Error("GitHub API rate limit exceeded");
    }

    if (!response.ok) {
        throw new Error("Something went wrong");
    }

    return response;
}


// ========================================
// 1. Get GitHub User
// ========================================

async function getUser(username) {

    const response = await fetch(
        `https://api.github.com/users/${username}`
    );

    handleResponse(response);

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

    handleResponse(response);

    const repositories = await response.json();

    return repositories;
}


// ========================================
// 3. Display Profile
// ========================================

function displayProfile(data, repositories) {

    const repoHTML = [...repositories]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
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

    if (username === "") {
        profile.innerHTML =
            "<p>Please enter a GitHub username.</p>";
        return;
    }

    // Loading state
    searchBtn.disabled = true;
    searchBtn.textContent = "Loading...";
    profile.innerHTML = "<p>Loading...</p>";

    try {

        const [data, repositories] = await Promise.all([
            getUser(username),
            getRepositories(username)
        ]);

        displayProfile(data, repositories);

    } catch (error) {

        console.error(error);

        profile.innerHTML = `
            <p>${error.message}</p>
        `;

    } finally {

        // Always restore button
        searchBtn.disabled = false;
        searchBtn.textContent = "Search";
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