// script.js - Complete JavaScript file

// Sample bus data
const busData = [
    { id: 1, name: "Express Travels", route: "City Center → Downtown", time: "08:00 AM - 10:30 AM", seats: 25, price: 15, totalSeats: 40 },
    { id: 2, name: "Royal Coaches", route: "City Center → Downtown", time: "10:00 AM - 12:30 PM", seats: 8, price: 18, totalSeats: 40 },
    { id: 3, name: "Speed Liner", route: "City Center → Downtown", time: "02:00 PM - 04:30 PM", seats: 42, price: 12, totalSeats: 45 },
    { id: 4, name: "Comfort Plus", route: "City Center → Downtown", time: "06:00 PM - 08:30 PM", seats: 15, price: 20, totalSeats: 40 },
    { id: 5, name: "Metro Express", route: "City Center → Downtown", time: "09:00 PM - 11:30 PM", seats: 30, price: 14, totalSeats: 40 }
];

// Track selected seats
let selectedSeats = [];
let currentBusData = null;

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initializePage();
});

function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    const currentPage = window.location.pathname.split('/').pop() || 'login.html';
    
    // If on home or seat-selection page and not logged in, redirect to login
    if ((currentPage === 'home.html' || currentPage === 'seat-selection.html') && !currentUser) {
        window.location.href = 'login.html';
    }
    
    // If on login/signup and already logged in, redirect to home
    if ((currentPage === 'login.html' || currentPage === 'signup.html' || currentPage === '') && currentUser) {
        window.location.href = 'home.html';
    }
}

function initializePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'login.html';
    
    // Login page
    if (currentPage === 'login.html' || currentPage === '') {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
    }
    
    // Signup page
    if (currentPage === 'signup.html') {
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', handleSignup);
        }
    }
    
    // Home page
    if (currentPage === 'home.html') {
        const searchForm = document.getElementById('searchForm');
        const logoutBtn = document.getElementById('logoutBtn');
        const dateInput = document.getElementById('travelDate');
        
        if (searchForm) {
            searchForm.addEventListener('submit', searchBuses);
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
        
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
            dateInput.value = today;
        }
        
        displayUserInfo();
    }

    // Seat selection page
    if (currentPage === 'seat-selection.html') {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
        loadSeatSelection();
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    const userData = { email };
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    alert('Login successful! Welcome back.');
    window.location.href = 'home.html';
}

function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    // Simple validation
    if (!username || !email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    const userData = { username, email };
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    alert('Account created successfully! Welcome to BusGo.');
    window.location.href = 'home.html';
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('selectedBus');
    localStorage.removeItem('searchParams');
    alert('Logged out successfully!');
    window.location.href = 'login.html';
}

function displayUserInfo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const homeHeader = document.querySelector('.home-header h1');
        if (homeHeader && currentUser.username) {
            homeHeader.textContent = `Welcome, ${currentUser.username}!`;
        }
    }
}

function searchBuses(e) {
    e.preventDefault();
    const from = document.getElementById('fromCity').value;
    const to = document.getElementById('toCity').value;
    const date = document.getElementById('travelDate').value;

    // Store search params
    localStorage.setItem('searchParams', JSON.stringify({ from, to, date }));

    const resultsContainer = document.getElementById('busResults');
    resultsContainer.innerHTML = '';

    busData.forEach(bus => {
        const busCard = document.createElement('div');
        busCard.className = 'bus-card';
        busCard.innerHTML = `
            <div class="bus-icon">🚌</div>
            <div class="bus-info">
                <div class="bus-name">${bus.name}</div>
                <div class="bus-route">${from} → ${to}</div>
                <div class="bus-time">⏰ ${bus.time}</div>
            </div>
            <div class="bus-booking">
                <div class="seats-available ${bus.seats < 10 ? 'low' : ''}">
                    ${bus.seats} seats available
                </div>
                <div class="price">$${bus.price}</div>
                <button class="btn-book" onclick="goToSeatSelection(${bus.id})">Book Now</button>
            </div>
        `;
        resultsContainer.appendChild(busCard);
    });
}

function goToSeatSelection(busId) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Please login to book a bus!');
        window.location.href = 'login.html';
        return;
    }
    
    const bus = busData.find(b => b.id === busId);
    localStorage.setItem('selectedBus', JSON.stringify(bus));
    window.location.href = 'seat-selection.html';
}

function loadSeatSelection() {
    const busDataStr = localStorage.getItem('selectedBus');
    const searchParamsStr = localStorage.getItem('searchParams');
    
    if (!busDataStr) {
        window.location.href = 'home.html';
        return;
    }

    currentBusData = JSON.parse(busDataStr);
    const searchParams = searchParamsStr ? JSON.parse(searchParamsStr) : { from: 'City', to: 'City' };

    // Update bus details
    document.getElementById('busName').textContent = currentBusData.name;
    document.getElementById('busRoute').textContent = `${searchParams.from} → ${searchParams.to}`;
    document.getElementById('busTime').textContent = currentBusData.time;
    document.getElementById('busPrice').textContent = `$${currentBusData.price}`;

    // Generate seats
    generateSeats();

    // Add confirm booking listener
    const confirmBtn = document.getElementById('confirmBookingBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmBooking);
    }
}

function generateSeats() {
    const seatsGrid = document.getElementById('seatsGrid');
    if (!seatsGrid || !currentBusData) return;
    
    seatsGrid.innerHTML = '';
    selectedSeats = [];
    
    const totalSeats = currentBusData.totalSeats;
    const availableSeats = currentBusData.seats;
    const bookedSeatsCount = totalSeats - availableSeats;
    
    // Randomly determine which seats are booked
    const bookedSeatNumbers = [];
    while (bookedSeatNumbers.length < bookedSeatsCount) {
        const randomSeat = Math.floor(Math.random() * totalSeats) + 1;
        if (!bookedSeatNumbers.includes(randomSeat)) {
            bookedSeatNumbers.push(randomSeat);
        }
    }
    
    // Generate seat elements
    for (let i = 1; i <= totalSeats; i++) {
        const seat = document.createElement('div');
        seat.className = 'seat';
        
        const isBooked = bookedSeatNumbers.includes(i);
        
        if (isBooked) {
            seat.classList.add('booked');
        } else {
            seat.classList.add('available');
            seat.addEventListener('click', () => toggleSeat(i, seat));
        }
        
        seat.innerHTML = `
            <div>${isBooked ? '🔒' : '💺'}</div>
            <div class="seat-number">${i}</div>
        `;
        
        seatsGrid.appendChild(seat);
    }
    
    updateBookingSummary();
}

function toggleSeat(seatNumber, seatElement) {
    if (seatElement.classList.contains('booked')) {
        return;
    }
    
    if (seatElement.classList.contains('selected')) {
        // Deselect seat
        seatElement.classList.remove('selected');
        seatElement.classList.add('available');
        seatElement.querySelector('div:first-child').textContent = '💺';
        selectedSeats = selectedSeats.filter(s => s !== seatNumber);
    } else {
        // Select seat
        seatElement.classList.remove('available');
        seatElement.classList.add('selected');
        seatElement.querySelector('div:first-child').textContent = '✓';
        selectedSeats.push(seatNumber);
    }
    
    updateBookingSummary();
}

function updateBookingSummary() {
    const selectedSeatsDisplay = document.getElementById('selectedSeatsDisplay');
    const totalSeatsSelected = document.getElementById('totalSeatsSelected');
    const totalAmount = document.getElementById('totalAmount');
    const confirmBtn = document.getElementById('confirmBookingBtn');
    
    if (selectedSeats.length === 0) {
        selectedSeatsDisplay.textContent = 'None';
        totalSeatsSelected.textContent = '0';
        totalAmount.textContent = '$0';
        confirmBtn.disabled = true;
    } else {
        selectedSeats.sort((a, b) => a - b);
        selectedSeatsDisplay.textContent = selectedSeats.join(', ');
        totalSeatsSelected.textContent = selectedSeats.length;
        const total = selectedSeats.length * currentBusData.price;
        totalAmount.textContent = `$${total}`;
        confirmBtn.disabled = false;
    }
}

function confirmBooking() {
    if (selectedSeats.length === 0) {
        alert('Please select at least one seat!');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const searchParams = JSON.parse(localStorage.getItem('searchParams'));
    
    const bookingDetails = {
        busName: currentBusData.name,
        route: `${searchParams.from} → ${searchParams.to}`,
        date: searchParams.date,
        time: currentBusData.time,
        seats: selectedSeats.join(', '),
        totalSeats: selectedSeats.length,
        pricePerSeat: currentBusData.price,
        totalAmount: selectedSeats.length * currentBusData.price,
        userName: currentUser.username || currentUser.email,
        bookingDate: new Date().toLocaleString()
    };
    
    // Show booking confirmation
    alert(`
🎉 Booking Confirmed! 🎉

Bus: ${bookingDetails.busName}
Route: ${bookingDetails.route}
Date: ${bookingDetails.date}
Time: ${bookingDetails.time}
Seats: ${bookingDetails.seats}
Total Amount: $${bookingDetails.totalAmount}

Thank you for booking with BusGo!
    `);
    
    // Clear stored data and redirect
    localStorage.removeItem('selectedBus');
    localStorage.removeItem('searchParams');
    
    // Redirect to home
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 1000);
}