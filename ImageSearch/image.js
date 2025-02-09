const accessKey = "RZEIOVfPhS7vMLkFdd2TSKGFBS4o9_FmcV1Nje3FSjw";

const formEl = document.querySelector("form");
const searchInputEl = document.getElementById("search-input");
const searchResultsEl = document.querySelector(".search-results");
const showMoreButtonEl = document.getElementById("show-more-button");
const savedPhotosEl = document.querySelector(".saved-photos");
const micButtonEl = document.createElement("button");


micButtonEl.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="30" height="31" class="mic-icon">
        <path d="M192 0C139 0 96 43 96 96l0 160c0 53 43 96 96 96s96-43 96-96l0-160c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6c85.8-11.7 152-85.3 152-174.4l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 70.7-57.3 128-128 128s-128-57.3-128-128l0-40z"/>
    </svg>
`;
micButtonEl.type = "button";
micButtonEl.id = "mic-button";
searchInputEl.insertAdjacentElement("afterend", micButtonEl);

let inputData = "";
let page = 1;


async function downloadImage(url, filename) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename || 'downloaded-image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error('Download failed:', error);
    }
}


async function shareImage(url, title) {
    if (navigator.share) {
        try {
            await navigator.share({
                title: title || 'Shared Image',
                text: 'Check out this image!',
                url: url
            });
        } catch (error) {
            console.error('Share failed:', error);
        }
    } else {
      
        navigator.clipboard.writeText(url).then(() => {
            alert('Image URL copied to clipboard!');
        });
    }
}

function savePhoto(imageUrl) {
    let savedPhotos = JSON.parse(localStorage.getItem("savedPhotos")) || [];
    if (!savedPhotos.includes(imageUrl)) {
        savedPhotos.push(imageUrl);
        localStorage.setItem("savedPhotos", JSON.stringify(savedPhotos));
        displaySavedPhotos();
    }
}

function deletePhoto(imageUrl) {
    let savedPhotos = JSON.parse(localStorage.getItem("savedPhotos")) || [];
    savedPhotos = savedPhotos.filter(photo => photo !== imageUrl);
    localStorage.setItem("savedPhotos", JSON.stringify(savedPhotos));
    displaySavedPhotos();
}

function displaySavedPhotos() {
    savedPhotosEl.innerHTML = "";
    let savedPhotos = JSON.parse(localStorage.getItem("savedPhotos")) || [];
    savedPhotos.forEach((photo) => {
        const photoWrapper = document.createElement("div");
        photoWrapper.classList.add("saved-photo-wrapper");
        
        const img = document.createElement("img");
        img.src = photo;
        img.classList.add("saved-photo");
        
        const overlay = document.createElement("div");
        overlay.classList.add("photo-overlay");
        
        
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
            </svg>
        `;
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", () => deletePhoto(photo));

        
        const downloadButton = document.createElement("button");
        downloadButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
        `;
        downloadButton.classList.add("download-button");
        downloadButton.addEventListener("click", () => downloadImage(photo));
        
        overlay.appendChild(deleteButton);
        overlay.appendChild(downloadButton);
        photoWrapper.appendChild(img);
        photoWrapper.appendChild(overlay);
        savedPhotosEl.appendChild(photoWrapper);
    });
}

displaySavedPhotos();

async function searchImages() {
    inputData = searchInputEl.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;

    const response = await fetch(url);
    const data = await response.json();
    if (page === 1) {
        searchResultsEl.innerHTML = "";
    }

    const results = data.results;

    results.map((result) => {
        const imageWrapper = document.createElement("div");
        imageWrapper.classList.add("search-result");
        
        const overlay = document.createElement("div");
        overlay.classList.add("photo-overlay");
        
        
        const saveButton = document.createElement("button");
        saveButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
        `;
        saveButton.classList.add("save-button");
        saveButton.addEventListener("click", () => {
            saveButton.classList.add("saved");
            savePhoto(result.urls.small);
        });

        
        const downloadButton = document.createElement("button");
        downloadButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
        `;
        downloadButton.classList.add("download-button");
        downloadButton.addEventListener("click", () => downloadImage(result.urls.full, `${result.alt_description || 'image'}.jpg`));

        
        const shareButton = document.createElement("button");
        shareButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
            </svg>
        `;
        shareButton.classList.add("share-button");
        shareButton.addEventListener("click", () => shareImage(result.urls.full, result.alt_description));
        
        const image = document.createElement("img");
        image.src = result.urls.small;
        image.alt = result.alt_description;
        
        const imageLink = document.createElement("a");
        imageLink.href = result.links.html;
        imageLink.target = "_blank";
        imageLink.textContent = result.alt_description;
        
        overlay.appendChild(saveButton);
        overlay.appendChild(downloadButton);
        overlay.appendChild(shareButton);
        imageWrapper.appendChild(image);
        imageWrapper.appendChild(overlay);
        imageWrapper.appendChild(imageLink);
        searchResultsEl.appendChild(imageWrapper);
    });

    page++;

    if (page > 1) {
        showMoreButtonEl.style.display = "block";
    }
}


formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    page = 1;
    searchImages();
});

showMoreButtonEl.addEventListener("click", () => {
    searchImages();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

    micButtonEl.addEventListener("click", () => {
        recognition.start();
        micButtonEl.classList.add("listening"); 
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        searchInputEl.value = transcript;
        recognition.stop();
        searchImages(); 
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        alert("Speech recognition failed. Please try again.");
    };

    recognition.onend = () => {
        micButtonEl.classList.remove("listening"); 
    };
} else {
    alert("Speech recognition is not supported in your browser.");
}
