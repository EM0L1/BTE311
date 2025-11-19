// Function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to set a random image for the top circle
function setRandomImage() {
    const randomNum = Math.floor(Math.random() * 10) + 1; // 1 to 10
    const imgElement = document.getElementById('randomImage');
    imgElement.src = `src/${randomNum}.jpg`;
    imgElement.style.display = 'block'; // Ensure it's visible
    console.log(`Random image set to: src/${randomNum}.jpg`);
}

// Function to show an image
function showImage(imgId) {
    const img = document.getElementById(imgId);
    if (img) {
        img.style.visibility = 'visible';
    }
}

// Function to hide an image
function hideImage(imgId) {
    const img = document.getElementById(imgId);
    if (img) {
        img.style.visibility = 'hidden';
    }
}

// Event listeners and initial setup
window.onload = function() {
    // 1. Random body background color
    document.body.style.backgroundColor = getRandomColor();

    // 2. Select a random image on load (as per "Her sayfa yenilemede... 10 farklı resim içinden bir resmi rastgele seçen")
    setRandomImage();
};

// Button event listener for random image
document.getElementById('randomBtn').addEventListener('click', setRandomImage);
