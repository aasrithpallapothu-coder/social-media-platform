/* =========================================
   SOCIAL MEDIA PLATFORM
   JavaScript
========================================= */


let posts = JSON.parse(localStorage.getItem("posts")) || [

    {
        id: 1,
        name: "Aasrith",
        username: "@aasrith",
        content: "Welcome to my Social Media Platform!",
        likes: 12,
        liked: false,
        comments: [
            "Great project!"
        ],
        media: ""
    },

    {
        id: 2,
        name: "Sanjay",
        username: "@sanjay",
        content: "Learning web development is really interesting!",
        likes: 8,
        liked: false,
        comments: [
            "Yes, it is!"
        ],
        media: ""
    }

];


let friends = [
    {
        name: "Sanjay",
        username: "@sanjay",
        status: "Add"
    },

    {
        name: "Pranadeep",
        username: "@pranadeep",
        status: "Add"
    },

    {
        name: "Rahul",
        username: "@rahul",
        status: "Add"
    },

    {
        name: "Kiran",
        username: "@kiran",
        status: "Add"
    }
];


let events = JSON.parse(localStorage.getItem("events")) || [];

let selectedMedia = "";

let currentChat = "";



/* =========================================
   SAVE DATA
========================================= */

function savePosts() {

    localStorage.setItem(
        "posts",
        JSON.stringify(posts)
    );

}


function saveEvents() {

    localStorage.setItem(
        "events",
        JSON.stringify(events)
    );

}



/* =========================================
   DISPLAY POSTS
========================================= */

function displayPosts() {

    const container =
        document.getElementById("postsContainer");

    container.innerHTML = "";


    posts.forEach(post => {

        const article =
            document.createElement("article");

        article.className = "post";


        let commentsHTML = "";

        post.comments.forEach(comment => {

            commentsHTML += `
                <div class="comment">
                    ${escapeHTML(comment)}
                </div>
            `;

        });


        let mediaHTML = "";

        if (post.media) {

            if (post.mediaType === "image") {

                mediaHTML = `
                    <img
                        src="${post.media}"
                        class="post-media"
                    >
                `;

            }

            if (post.mediaType === "video") {

                mediaHTML = `
                    <video
                        src="${post.media}"
                        class="post-media"
                        controls
                    ></video>
                `;

            }

        }


        article.innerHTML = `

            <div class="post-header">

                <div class="avatar">
                    ${post.name.charAt(0)}
                </div>

                <div>
                    <h3>${escapeHTML(post.name)}</h3>
                    <p>${escapeHTML(post.username)}</p>
                </div>

            </div>


            <p class="post-content">
                ${escapeHTML(post.content)}
            </p>


            ${mediaHTML}


            <div class="post-actions">

                <button
                    class="${post.liked ? "liked" : ""}"
                    onclick="likePost(${post.id})"
                >
                    ${post.liked ? "Liked" : "Like"}
                    (${post.likes})
                </button>


                <button onclick="focusComment(${post.id})">
                    Comment (${post.comments.length})
                </button>


                <button onclick="sharePost(${post.id})">
                    Share
                </button>

            </div>


            <div class="comments">

                ${commentsHTML}


                <div class="comment-input">

                    <input
                        type="text"
                        id="comment-${post.id}"
                        placeholder="Write a comment..."
                        onkeydown="commentEnter(event, ${post.id})"
                    >

                    <button
                        onclick="addComment(${post.id})"
                    >
                        Send
                    </button>

                </div>

            </div>

        `;


        container.appendChild(article);

    });

}



/* =========================================
   CREATE POST
========================================= */

function createPost() {

    const text =
        document.getElementById("postText")
            .value
            .trim();


    if (text === "" && selectedMedia === "") {

        alert(
            "Please write something or select a photo/video."
        );

        return;

    }


    const newPost = {

        id: Date.now(),

        name: "Aasrith",

        username: "@aasrith",

        content: text,

        likes: 0,

        liked: false,

        comments: [],

        media: selectedMedia,

        mediaType:
            selectedMediaType

    };


    posts.unshift(newPost);

    savePosts();

    displayPosts();


    document.getElementById("postText").value = "";

    selectedMedia = "";

    selectedMediaType = "";

    document.getElementById(
        "selectedMedia"
    ).innerHTML = "";


    document.getElementById(
        "photoInput"
    ).value = "";


    document.getElementById(
        "videoInput"
    ).value = "";


    alert("Post created successfully!");

}



/* =========================================
   LIKE / UNLIKE
========================================= */

function likePost(id) {

    const post =
        posts.find(post => post.id === id);


    if (!post) return;


    if (post.liked) {

        post.likes--;

        post.liked = false;

    } else {

        post.likes++;

        post.liked = true;

    }


    savePosts();

    displayPosts();

}



/* =========================================
   COMMENTS
========================================= */

function addComment(id) {

    const input =
        document.getElementById(
            "comment-" + id
        );


    const comment =
        input.value.trim();


    if (comment === "") {

        alert("Please write a comment.");

        return;

    }


    const post =
        posts.find(post => post.id === id);


    if (!post) return;


    post.comments.push(comment);


    savePosts();

    displayPosts();

}


function commentEnter(event, id) {

    if (event.key === "Enter") {

        addComment(id);

    }

}


function focusComment(id) {

    const input =
        document.getElementById(
            "comment-" + id
        );


    if (input) {

        input.focus();

    }

}



/* =========================================
   SHARE POST
========================================= */

function sharePost(id) {

    const post =
        posts.find(post => post.id === id);


    if (!post) return;


    const shareText =
        `${post.name}: ${post.content}`;


    if (navigator.share) {

        navigator.share({

            title: "SocialConnect",

            text: shareText

        }).catch(() => {});

    } else {

        navigator.clipboard
            .writeText(shareText)
            .then(() => {

                alert(
                    "Post link/content copied to clipboard!"
                );

            });

    }

}



/* =========================================
   PHOTO UPLOAD
========================================= */

let selectedMediaType = "";


function selectPhoto() {

    const file =
        document.getElementById(
            "photoInput"
        ).files[0];


    if (!file) return;


    const reader =
        new FileReader();


    reader.onload = function(event) {

        selectedMedia =
            event.target.result;

        selectedMediaType =
            "image";


        document.getElementById(
            "selectedMedia"
        ).innerHTML = `

            <p>Photo selected:</p>

            <img
                src="${selectedMedia}"
                class="post-media"
            >

        `;

    };


    reader.readAsDataURL(file);

}



/* =========================================
   VIDEO UPLOAD
========================================= */

function selectVideo() {

    const file =
        document.getElementById(
            "videoInput"
        ).files[0];


    if (!file) return;


    const reader =
        new FileReader();


    reader.onload = function(event) {

        selectedMedia =
            event.target.result;

        selectedMediaType =
            "video";


        document.getElementById(
            "selectedMedia"
        ).innerHTML = `

            <p>Video selected:</p>

            <video
                src="${selectedMedia}"
                class="post-media"
                controls
            ></video>

        `;

    };


    reader.readAsDataURL(file);

}



/* =========================================
   FRIENDS
========================================= */

function displayFriends() {

    const list =
        document.getElementById(
            "friendList"
        );


    list.innerHTML = "";


    friends.forEach((friend, index) => {

        list.innerHTML += `

            <div class="friend-item">

                <div class="small-avatar">
                    ${friend.name.charAt(0)}
                </div>

                <div class="friend-item-info">

                    <strong>
                        ${friend.name}
                    </strong>

                    <p>
                        ${friend.username}
                    </p>

                </div>

                <button
                    onclick="friendAction(${index}, this)"
                >
                    ${friend.status}
                </button>

            </div>

        `;

    });

}


function sendFriendRequest(name, button) {

    button.textContent = "Requested";

    button.disabled = true;

    button.style.background = "#777";


    addNotification(
        `Friend request sent to ${name}.`
    );

}


function friendAction(index, button) {

    const friend =
        friends[index];


    if (friend.status === "Add") {

        friend.status = "Requested";

        button.textContent = "Requested";

        button.disabled = true;

        addNotification(
            `Friend request sent to ${friend.name}.`
        );

    }

}



/* =========================================
   NOTIFICATIONS
========================================= */

function addNotification(message) {

    const list =
        document.getElementById(
            "notificationList"
        );


    const notification =
        document.createElement("div");


    notification.className =
        "notification";


    notification.textContent =
        message;


    list.prepend(notification);

}



/* =========================================
   MESSAGES
========================================= */

function openChat(name) {

    currentChat = name;


    const chatArea =
        document.getElementById(
            "chatArea"
        );


    chatArea.innerHTML = `

        <h3>
            Chat with ${name}
        </h3>

        <div
            id="chatMessages"
            style="margin-top:15px;"
        >

            <div class="chat-message">
                ${name}: Hello!
            </div>

            <div class="chat-message">
                You: Hi ${name}!
            </div>

        </div>


        <div class="chat-input">

            <input
                type="text"
                id="messageInput"
                placeholder="Type a message..."
                onkeydown="messageEnter(event)"
            >

            <button
                onclick="sendMessage()"
            >
                Send
            </button>

        </div>

    `;

}


function sendMessage() {

    const input =
        document.getElementById(
            "messageInput"
        );


    if (!input) return;


    const message =
        input.value.trim();


    if (message === "") {

        alert("Please type a message.");

        return;

    }


    const messages =
        document.getElementById(
            "chatMessages"
        );


    messages.innerHTML += `

        <div class="chat-message">
            You: ${escapeHTML(message)}
        </div>

    `;


    input.value = "";

}


function messageEnter(event) {

    if (event.key === "Enter") {

        sendMessage();

    }

}



/* =========================================
   EVENTS
========================================= */

function createEvent() {

    const name =
        document.getElementById(
            "eventName"
        ).value.trim();


    const date =
        document.getElementById(
            "eventDate"
        ).value;


    if (name === "" || date === "") {

        alert(
            "Please enter event name and date."
        );

        return;

    }


    events.push({

        name: name,

        date: date,

        joined: false

    });


    saveEvents();

    displayEvents();


    document.getElementById(
        "eventName"
    ).value = "";


    document.getElementById(
        "eventDate"
    ).value = "";


    alert("Event created successfully!");

}


function displayEvents() {

    const list =
        document.getElementById(
            "eventList"
        );


    list.innerHTML = "";


    events.forEach((event, index) => {

        list.innerHTML += `

            <div class="event">

                <strong>
                    ${escapeHTML(event.name)}
                </strong>

                <p>
                    ${event.date}
                </p>

                <button
                    onclick="joinEvent(${index}, this)"
                >
                    ${event.joined ? "Joined" : "Join Event"}
                </button>

            </div>

        `;

    });

}


function joinEvent(index, button) {

    events[index].joined =
        !events[index].joined;


    if (events[index].joined) {

        button.textContent = "Joined";

        addNotification(
            `You joined ${events[index].name}.`
        );

    } else {

        button.textContent = "Join Event";

    }


    saveEvents();

}



/* =========================================
   SEARCH USERS
========================================= */

function searchUsers() {

    const query =
        document.getElementById(
            "searchInput"
        ).value
        .trim()
        .toLowerCase();


    if (query === "") {

        alert("Please enter a name to search.");

        return;

    }


    const users = [

        {
            name: "Aasrith",
            username: "@aasrith"
        },

        {
            name: "Sanjay",
            username: "@sanjay"
        },

        {
            name: "Pranadeep",
            username: "@pranadeep"
        },

        {
            name: "Rahul",
            username: "@rahul"
        },

        {
            name: "Kiran",
            username: "@kiran"
        }

    ];


    const results =
        users.filter(user =>

            user.name
                .toLowerCase()
                .includes(query)

            ||

            user.username
                .toLowerCase()
                .includes(query)

        );


    const resultList =
        document.getElementById(
            "searchResultList"
        );


    resultList.innerHTML = "";


    if (results.length === 0) {

        resultList.innerHTML =
            "<p>No users found.</p>";

    } else {

        results.forEach(user => {

            resultList.innerHTML += `

                <div class="search-user">

                    <div class="small-avatar">
                        ${user.name.charAt(0)}
                    </div>

                    <div>

                        <strong>
                            ${user.name}
                        </strong>

                        <p>
                            ${user.username}
                        </p>

                    </div>

                </div>

            `;

        });

    }


    showSection("searchResults");

}



/* =========================================
   PROFILE
========================================= */

function editProfile() {

    const newName =
        prompt(
            "Enter your name:",
            "Aasrith"
        );


    if (!newName || newName.trim() === "") {

        return;

    }


    const name =
        newName.trim();


    document.getElementById(
        "profileName"
    ).textContent = name;


    document.getElementById(
        "largeProfileName"
    ).textContent = name;


    document.getElementById(
        "profileAvatar"
    ).textContent =
        name.charAt(0).toUpperCase();


    document.getElementById(
        "largeAvatar"
    ).textContent =
        name.charAt(0).toUpperCase();


    alert(
        "Profile updated successfully!"
    );

}



/* =========================================
   NAVIGATION
========================================= */

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(
            ".page-section"
        );


    sections.forEach(section => {

        section.classList.remove(
            "active"
        );

    });


    const selected =
        document.getElementById(
            sectionId
        );


    if (selected) {

        selected.classList.add(
            "active"
        );

    }


    if (sectionId === "friends") {

        displayFriends();

    }


    if (sectionId === "events") {

        displayEvents();

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}



/* =========================================
   THEME
========================================= */

function changeTheme() {

    document.body.classList.toggle(
        "dark-mode"
    );

}



/* =========================================
   CLEAR DATA
========================================= */

function clearData() {

    const confirmClear =
        confirm(
            "Are you sure you want to clear saved posts and events?"
        );


    if (!confirmClear) return;


    localStorage.removeItem("posts");

    localStorage.removeItem("events");


    location.reload();

}



/* =========================================
   ESCAPE HTML
   Prevents HTML injection in user content
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent = text;


    return div.innerHTML;

}



/* =========================================
   INITIAL LOAD
========================================= */

displayPosts();

displayFriends();

displayEvents();