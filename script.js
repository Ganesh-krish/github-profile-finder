const usernameInput = document.getElementById("username");
const searchBtn = document.getElementById("searchBtn");
const profile = document.getElementById("profile");

async function getUser() {
    const username = usernameInput.value.trim();

    if (username === "") {
        profile.innerHTML = "<p>Please enter a GitHub username.</p>";
        return;
    }

    try {
        const response = await fetch(
            `https://api.github.com/users/${username}`
        );

        if(!response.ok){
            throw new Error("404 User Not Found");
        }

        const data = await response.json();

        profile.innerHTML = `
            <div class="profile-card">

                <img src="${data.avatar_url}" alt="${data.login}">

                <h2>${data.name || data.login}</h2>

                <p>@${data.login}</p>

                <p>${data.bio || "No bio available"}</p>

                <div class="stats">
                    <p>Followers: ${data.followers}</p>
                    <p>Following: ${data.following}</p>
                    <p>Repositories: ${data.public_repos}</p>
                </div>

                <p>Location: ${data.location || "Not available"}</p>

                <a href="${data.html_url}" target="_blank">
                    View GitHub Profile
                </a>

            </div>
        `;

    } catch (error) {
        console.error(error);
        profile.innerHTML = `<p>${error.message}</p>`
    }
}

searchBtn.addEventListener("click", getUser);