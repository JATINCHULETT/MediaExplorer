
const API_KEY = 'UPkMobELRl73SivTfHWFkKDQlxr5X8B0WMuMae5N2JTM4fP1qxuJiY5S';
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const videosGrid = document.querySelector('.videos-grid');
const loadingDiv = document.querySelector('.loading');
const errorDiv = document.querySelector('.error');
const tabs = document.querySelectorAll('.tab');

let currentTab = 'search';


function getSavedVideos() {
    const saved = localStorage.getItem('savedVideos');
    return saved ? JSON.parse(saved) : [];
}


function saveVideo(video) {
    const savedVideos = getSavedVideos();
    const videoFile = video.video_files.find(file => file.quality === 'sd' && file.width < 1000);

    const videoData = {
        id: video.id,
        link: videoFile.link,
        userName: video.user.name,
        duration: video.duration
    };

    savedVideos.push(videoData);
    localStorage.setItem('savedVideos', JSON.stringify(savedVideos));
}


function removeVideo(videoId) {
    const savedVideos = getSavedVideos();
    const updatedVideos = savedVideos.filter(video => video.id !== videoId);
    localStorage.setItem('savedVideos', JSON.stringify(updatedVideos));
}


function isVideoSaved(videoId) {
    const savedVideos = getSavedVideos();
    return savedVideos.some(video => video.id === videoId);
}

async function searchVideos(query) {
    try {
        loadingDiv.style.display = 'block';
        errorDiv.style.display = 'none';
        videosGrid.innerHTML = '';

        const response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=12`, {
            headers: {
                'Authorization': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch videos');
        }

        const data = await response.json();
        displayVideos(data.videos);
    } catch (error) {
        errorDiv.textContent = 'An error occurred while fetching videos. Please try again.';
        errorDiv.style.display = 'block';
    } finally {
        loadingDiv.style.display = 'none';
    }
}

function displayVideos(videos) {
    videosGrid.innerHTML = '';

    if (!videos || videos.length === 0) {
        videosGrid.innerHTML = '<div class="no-videos">No videos found</div>';
        return;
    }

    videos.forEach(video => {
        const videoFile = video.video_files.find(file => file.quality === 'sd' && file.width < 1000);
        if (!videoFile) return;

        const isSaved = isVideoSaved(video.id);

        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
                    <div class="video-container">
                        <video src="${videoFile.link}" muted loop></video>
                    </div>
                    <div class="video-info">
                        <h3>${video.user.name}</h3>
                        <p>${video.duration} seconds</p>
                        <button class="save-button ${isSaved ? 'saved' : ''}" data-video-id="${video.id}">
                            ${isSaved ? 'Remove from Saved' : 'Save Video'}
                        </button>
                    </div>
                `;

        const videoElement = videoCard.querySelector('video');
        const saveButton = videoCard.querySelector('.save-button');

        videoCard.addEventListener('mouseenter', () => {
            videoElement.play();
        });

        videoCard.addEventListener('mouseleave', () => {
            videoElement.pause();
            videoElement.currentTime = 0;
        });

        saveButton.addEventListener('click', () => {
            if (isSaved) {
                removeVideo(video.id);
                saveButton.textContent = 'Save Video';
                saveButton.classList.remove('saved');
            } else {
                saveVideo(video);
                saveButton.textContent = 'Remove from Saved';
                saveButton.classList.add('saved');
            }
        });

        videosGrid.appendChild(videoCard);
    });
}

function displaySavedVideos() {
    const savedVideos = getSavedVideos();
    videosGrid.innerHTML = '';

    if (savedVideos.length === 0) {
        videosGrid.innerHTML = '<div class="no-videos">No saved videos</div>';
        return;
    }

    savedVideos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
                    <div class="video-container">
                        <video src="${video.link}" muted loop></video>
                    </div>
                    <div class="video-info">
                        <h3>${video.userName}</h3>
                        <p>${video.duration} seconds</p>
                        <button class="save-button saved" data-video-id="${video.id}">Remove from Saved</button>
                    </div>
                `;

        const videoElement = videoCard.querySelector('video');
        const saveButton = videoCard.querySelector('.save-button');

        videoCard.addEventListener('mouseenter', () => {
            videoElement.play();
        });

        videoCard.addEventListener('mouseleave', () => {
            videoElement.pause();
            videoElement.currentTime = 0;
        });

        saveButton.addEventListener('click', () => {
            removeVideo(video.id);
            videoCard.remove();
            if (getSavedVideos().length === 0) {
                videosGrid.innerHTML = '<div class="no-videos">No saved videos</div>';
            }
        });

        videosGrid.appendChild(videoCard);
    });
}


tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentTab = tab.dataset.tab;

        if (currentTab === 'saved') {
            displaySavedVideos();
        } else if (searchInput.value.trim()) {
            searchVideos(searchInput.value.trim());
        } else {
            videosGrid.innerHTML = '<div class="no-videos">Search for videos to display results</div>';
        }
    });
});

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        tabs.forEach(tab => {
            if (tab.dataset.tab === 'search') {
                tab.click();
            }
        });
        searchVideos(query);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            tabs.forEach(tab => {
                if (tab.dataset.tab === 'search') {
                    tab.click();
                }
            });
            searchVideos(query);
        }
    }
});
function displayVideos(videos) {
    videosGrid.innerHTML = '';

    if (!videos || videos.length === 0) {
        videosGrid.innerHTML = '<div class="no-videos">No videos found</div>';
        return;
    }

    videos.forEach(video => {
        const videoFile = video.video_files.find(file => file.quality === 'sd' && file.width < 1000);
        if (!videoFile) return;

        const isSaved = isVideoSaved(video.id);

        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <a href="${video.url}" class="video-link" target="_blank" rel="noopener noreferrer">
                <div class="video-container">
                    <video src="${videoFile.link}" muted loop></video>
                </div>
            </a>
            <div class="video-info">
                <h3>${video.user.name}</h3>
                <p>${video.duration} seconds</p>
                <div class="video-actions">
                    <button class="video-button download-button" data-video-url="${videoFile.link}">
                        ⬇ Download
                    </button>
                    <button class="video-button share-button" data-video-url="${video.url}">
                        ↗ Share
                    </button>
                </div>
                <button class="save-button ${isSaved ? 'saved' : ''}" data-video-id="${video.id}">
                    ${isSaved ? 'Remove from Saved' : 'Save Video'}
                </button>
            </div>
        `;

        
        const videoElement = videoCard.querySelector('video');
        videoCard.addEventListener('mouseenter', () => {
            videoElement.play();
        });

        videoCard.addEventListener('mouseleave', () => {
            videoElement.pause();
            videoElement.currentTime = 0;
        });

        
        const downloadButton = videoCard.querySelector('.download-button');
        downloadButton.addEventListener('click', (e) => {
            e.preventDefault();
            const videoUrl = downloadButton.dataset.videoUrl;
            downloadVideo(videoUrl);
        });

        
        const shareButton = videoCard.querySelector('.share-button');
        shareButton.addEventListener('click', (e) => {
            e.preventDefault();
            shareVideo(video.url);
        });

        
        const saveButton = videoCard.querySelector('.save-button');
        saveButton.addEventListener('click', () => {
            if (isSaved) {
                removeVideo(video.id);
                saveButton.textContent = 'Save Video';
                saveButton.classList.remove('saved');
            } else {
                saveVideo(video);
                saveButton.textContent = 'Remove from Saved';
                saveButton.classList.add('saved');
            }
        });

        videosGrid.appendChild(videoCard);
    });
}


async function downloadVideo(videoUrl) {
    try {
        const response = await fetch(videoUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `video-${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error downloading video:', error);
        alert('Failed to download video. Please try again.');
    }
}

function shareVideo(videoUrl) {
    if (navigator.share) {
        navigator.share({
            title: 'Check out this video!',
            url: videoUrl
        }).catch(console.error);
    } else {
        
        navigator.clipboard.writeText(videoUrl)
            .then(() => alert('Video link copied to clipboard!'))
            .catch(() => {
                // Fallback for clipboard API
                const dummy = document.createElement('input');
                document.body.appendChild(dummy);
                dummy.value = videoUrl;
                dummy.select();
                document.execCommand('copy');
                document.body.removeChild(dummy);
                alert('Video link copied to clipboard!');
            });
    }
}

function displaySavedVideos() {
    const savedVideos = getSavedVideos();
    videosGrid.innerHTML = '';

    if (savedVideos.length === 0) {
        videosGrid.innerHTML = '<div class="no-videos">No saved videos</div>';
        return;
    }

    savedVideos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <a href="https://www.pexels.com/video/${video.id}" class="video-link" target="_blank" rel="noopener noreferrer">
                <div class="video-container">
                    <video src="${video.link}" muted loop></video>
                </div>
            </a>
            <div class="video-info">
                <h3>${video.userName}</h3>
                <p>${video.duration} seconds</p>
                <div class="video-actions">
                    <button class="video-button download-button" data-video-url="${video.link}">
                        ⬇ Download
                    </button>
                    <button class="video-button share-button" data-video-url="https://www.pexels.com/video/${video.id}">
                        ↗ Share
                    </button>
                </div>
                <button class="save-button saved" data-video-id="${video.id}">Remove from Saved</button>
            </div>
        `;

        const videoElement = videoCard.querySelector('video');
        videoCard.addEventListener('mouseenter', () => videoElement.play());
        videoCard.addEventListener('mouseleave', () => {
            videoElement.pause();
            videoElement.currentTime = 0;
        });

        const downloadButton = videoCard.querySelector('.download-button');
        downloadButton.addEventListener('click', (e) => {
            e.preventDefault();
            downloadVideo(video.link); 
        });

        const shareButton = videoCard.querySelector('.share-button');
        shareButton.addEventListener('click', (e) => {
            e.preventDefault();
            shareVideo(`https://www.pexels.com/video/${video.id}`); 
        });

        const saveButton = videoCard.querySelector('.save-button');
        saveButton.addEventListener('click', () => {
            removeVideo(video.id);
            videoCard.remove();
            if (getSavedVideos().length === 0) {
                videosGrid.innerHTML = '<div class="no-videos">No saved videos</div>';
            }
        });

        videosGrid.appendChild(videoCard);
    });
}


let currentPage = 1;
const showMoreButton = document.querySelector('.show-more-button');

async function searchVideos(query, page = 1) {
    try {
        loadingDiv.style.display = 'block';
        errorDiv.style.display = 'none';

        const response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=12&page=${page}`, {
            headers: {
                'Authorization': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch videos');
        }

        const data = await response.json();
        displayVideos(data.videos);
        currentPage = page;
        showMoreButton.style.display = data.videos.length === 12 ? 'block' : 'none'; 
    } catch (error) {
        errorDiv.textContent = 'An error occurred while fetching videos. Please try again.';
        errorDiv.style.display = 'block';
    } finally {
        loadingDiv.style.display = 'none';
    }
}

showMoreButton.addEventListener('click', () => {
    if (currentTab === 'search') { 
        searchVideos(searchInput.value.trim(), currentPage + 1);
    }
});
