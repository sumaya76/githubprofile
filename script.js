const APIURL = "https://api.github.com/users/";
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

async function getUser(username) {
    try {
        const resp = await fetch(APIURL + username);
        if (!resp.ok) throw new Error('User not found');

        const respData = await resp.json();
        createUserCard(respData);
        getRepos(username);
    } catch (error) {
        main.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

async function getRepos(username) {
    const resp = await fetch(APIURL + username + "/repos");
    const respData = await resp.json();
    addReposToCard(respData);
}

function createUserCard(user) {
    const cardHTML = `
        <div class="card">
            <div>
                <img class="avatar" src="${user.avatar_url}" alt="${user.name}'s avatar" />
            </div>
            <div class="user-info">
                <h2>${user.name}</h2>
                <p>${user.bio}</p>
                <ul class="info">
                    <li>${user.followers}<strong> Followers</strong></li>
                    <li>${user.following}<strong> Following</strong></li>
                    <li>${user.public_repos}<strong> Repos</strong></li>
                </ul>
                <div id="repos"></div>
            </div>
        </div>
    `;
    main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
    const reposEl = document.getElementById("repos");
    repos.sort((a, b) => b.stargazers_count - a.stargazers_count)
         .slice(0, 10)
         .forEach((repo) => {
             const repoEl = document.createElement("a");
             repoEl.classList.add("repo");
             repoEl.href = repo.html_url;
             repoEl.target = "_blank";
             repoEl.innerText = repo.name;
             reposEl.appendChild(repoEl);
         });
}

function showLoading() {
    main.innerHTML = '<p class="loading">Loading...</p>';
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = search.value;
    if (user) {
        showLoading();
        getUser(user);
        search.value = "";
    }
});
