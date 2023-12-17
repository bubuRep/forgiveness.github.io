const messages = document.querySelectorAll('.message');
let currentIndex = 0;
let isAutoRotationActive = true; // Variable to track automatic rotation

function startMessageRotation() {
    if (currentIndex < messages.length - 1) {
        currentIndex++;
    } else {
        clearInterval(messageRotationInterval);
        isAutoRotationActive = false; // Automatic rotation is paused
        showArrowButton();
    }
    updateSlider();
}

function updateSlider() {
    if (currentIndex > 0) {
        messages[currentIndex - 1].style.opacity = 0;
    }

    messages[currentIndex].classList.remove('hidden');
    messages[currentIndex].style.opacity = 1;

    messages[currentIndex].addEventListener('transitionend', handleTransitionEnd);
}

function handleTransitionEnd() {
    messages[currentIndex].removeEventListener('transitionend', handleTransitionEnd);

    setTimeout(() => {
        messages[currentIndex].style.opacity = 0;

        if (isAutoRotationActive) {
            startMessageRotation();
        }
    }, 2000);
}

function showArrowButton() {
    const arrowButton = document.getElementById('right-arrow');
    arrowButton.style.opacity = '1'; // Set opacity to 1 for fade-in effect
    arrowButton.style.display = 'block';
    arrowButton.addEventListener('click', nextSetOfSlides);
}

function nextSetOfSlides() {
    const slider = document.querySelector('.slider');
    const slideWidth = document.querySelector('.slide').offsetWidth;
    
    if (currentIndex < messages.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }

    const translateValue = -currentIndex * slideWidth;
    slider.style.transform = `translateX(${translateValue}px)`;

    messages[currentIndex - 1].classList.add('hidden');

    // If the slider goes back to slide 1, restart automatic rotation
    if (currentIndex === 0) {
        isAutoRotationActive = true;
        messageRotationInterval = setInterval(startMessageRotation, 2000);
    }
    document.getElementById('right-arrow').style.display = "none";
}

let messageRotationInterval = setInterval(startMessageRotation, 3000);

let imageVisible = true;
let isFirstNoClick = true; // Track if it's the first time the user clicks "No"
let popUpVisible = true;

function showPopup() {
    if (imageVisible) {
        document.getElementById("flower").style.display = "none";
        document.getElementById("forgive-popup").style.display = "flex";

        const yesButton = document.getElementById("yesButton");
        const noButton = document.getElementById("noButton");
        const fineButton = document.getElementById("fineButton");

        if (isFirstNoClick) {
            // If it's the first "No" click, show the "Fine" button
            fineButton.style.display = "none"; // Initial state, "Fine" button is hidden
            yesButton.style.display = "inline-block";
            noButton.style.display = "inline-block";
        } else {
            // If it's not the first "No" click, show both "Yes" and "No" buttons
            yesButton.style.display = "inline-block";
            noButton.style.display = "inline-block";
            fineButton.style.display = "none";
        }

        imageVisible = false;
    }
}

function forgive(response) {
    const forgivePopup = document.getElementById("forgive-popup");
    const confirmPopup = document.getElementById("confirm-popup"); // Get the fine-popup element

    if (response) {
        forgivePopup.style.display = "none";
        confirmPopup.style.display = "none";
        const arrowButton = document.getElementById('right-arrow');
        arrowButton.style.display = "none";
        replacePopupWithMessage("Thank You, I Love You 🥰");
    } else {
        const cheekyMessages = [
            "Please.. I'm sorry 😔",
            "Not taking no for an answer 😕",
            "Try the other button 😏",
            "Come on.. I miss you 🥺"
        ];
        const randomMessage = cheekyMessages[Math.floor(Math.random() * cheekyMessages.length)];
        showMessage(randomMessage, "error");

        if (isFirstNoClick) {
            isFirstNoClick = false;
            const yesButton = document.getElementById("yesButton");
            yesButton.style.display = "none";
            const fineButton = document.getElementById("fineButton");
            fineButton.style.display = "inline-block";
        }
    }
}

function replacePopupWithMessage(message) {
    const forgivePopup = document.getElementById("forgive-popup");
    forgivePopup.style.display = "none";

    const messageContainer = document.createElement("div");
    messageContainer.className = "thank-you-message-container";
    messageContainer.style.background = "rgba(255, 255, 255, 0.9)";

    const thankYouMessage = document.createElement("h1");
    thankYouMessage.innerText = message;
    thankYouMessage.classList.add("thank-you-message");

    messageContainer.appendChild(thankYouMessage);
    document.body.appendChild(messageContainer);
}

function showMessage(message, type) {
    const messageContainer = document.getElementById("messageContainer");
    const newMessage = document.createElement("div");
    newMessage.className = `message3 ${type}`;
    newMessage.innerText = message;

    const randomPositionX = Math.floor(Math.random() * window.innerWidth);
    const randomPositionY = Math.floor(Math.random() * window.innerHeight);

    newMessage.style.left = `${randomPositionX}px`;
    newMessage.style.top = `${randomPositionY}px`;

    messageContainer.appendChild(newMessage);

    setTimeout(() => {
        messageContainer.removeChild(newMessage);
    }, 3000);
}

function confirmPopup() {
    if (popUpVisible) { 
        document.getElementById("forgive-popup").style.display = "none";
        document.getElementById("confirm-popup").style.display = "flex";

    }
}

const puzzleContainer = document.getElementById('puzzle-container');
const puzzlePieces = createPuzzlePieces();

function createPuzzlePieces() {
    const pieces = [];
    for (let i = 0; i < 9; i++) {
    const piece = document.createElement('div');
    piece.className = 'puzzle-piece';
    piece.innerText = i + 1;
    piece.draggable = true;
    piece.addEventListener('dragstart', dragStart);
    piece.addEventListener('dragover', dragOver);
    piece.addEventListener('drop', drop);
    pieces.push(piece);
    }
    return pieces;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderPuzzle() {
    puzzleContainer.innerHTML = '';
    puzzlePieces.forEach(piece => puzzleContainer.appendChild(piece));
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.innerText);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const draggedNumber = event.dataTransfer.getData('text/plain');
    const targetNumber = event.target.innerText;

    // Find the dragged and target puzzle pieces
    const draggedPiece = puzzlePieces.find(piece => piece.innerText === draggedNumber);
    const targetPiece = puzzlePieces.find(piece => piece.innerText === targetNumber);

    // Swap the innerText of the dragged and target puzzle pieces
    event.target.innerText = draggedNumber;
    draggedPiece.innerText = targetNumber;

    // Check if the puzzle is solved after each move
    if (isPuzzleSolved()) {
        // Apply spin-out animation for each puzzle piece
        puzzlePieces.forEach(piece => {
            anime({
            targets: piece,
            translateX: anime.random(-window.innerWidth, window.innerWidth),
            translateY: anime.random(-window.innerHeight, window.innerHeight),
            rotate: anime.random(360, 720),
            duration: 1000,
            easing: 'easeInOutQuad',
            });
        });

        // Show messages after the puzzle pieces animation
        setTimeout(() => {
            showMessages();
        }, 1000); // Delay based on the number of puzzle pieces animations

        showArrowButton();
    }
}

function isPuzzleSolved() {
    return puzzlePieces.every((piece, index) => parseInt(piece.innerText, 10) === index + 1);
}

// Function to show messages one by one
function showMessages() {
    const messages = [
        "I am sorry for:",
        "- Always repeating things that can upset you",
        "- Not doing anything to make it better",
        "- Expecting everything to be normal despite doing nothing to make it better"
    ];

    // Create a message container within the context of Slide 2
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message2-container';

    messages.forEach((message, index) => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message2';
        messageElement.innerText = message;
        messageContainer.appendChild(messageElement);

        anime({
            targets: messageElement,
            opacity: 1,
            delay: 1000 * index, // Delay each message by 1 second
        });
    });

    // Append the message container to Slide 2
    const slide2 = document.getElementById('slide2');
    slide2.appendChild(messageContainer);

    // Set the h3 tag to hidden when the puzzle is solved
    const puzzleHeading = document.getElementById('puzzle-heading');
    puzzleHeading.style.display = 'none';
}


// Initialize the puzzle
shuffleArray(puzzlePieces);
renderPuzzle();

function showArrowButton() {
    const arrowButton = document.getElementById('right-arrow');
    arrowButton.style.opacity = '1'; // Set opacity to 1 for fade-in effect
    arrowButton.style.display = 'block';
    arrowButton.addEventListener('click', nextSetOfSlides);
}
