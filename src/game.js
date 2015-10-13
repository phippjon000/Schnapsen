// Initialize Canvas
var canvas = $("#gameCanvas")[0];
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
var ctx = canvas.getContext("2d");

// Initialize variables
// Image variables
var cards = new Image(SHEET_WIDTH, SHEET_HEIGHT);
cards.src = "img/cards.png";
var lead = new Image(BUTTON_WIDTH, BUTTON_HEIGHT);
lead.src = "img/lead.png";

// Card variables
var deck = [];
var deckPointer = 0;
var humanHand = [];
var humanTricks = [];
var computerHand = [];
var computerTricks = [];
var computerSeen = [];
var trump = "";
var leadPlayed = "";
var followPlayed = "";
var humanOnLead = true;

// Point variables
var humanTrickPoints = 0;
var computerTrickPoints = 0;
var humanGamePoints = 7;
var computerGamePoints = 7;

// Other variables
var clickLogged = false;
var homeText = "Welcome to Schnapsen! Would you like to play me?";
var homeScreen = setInterval(home, TIME_PER_FRAME);
var gameLoop;

// Game loop for home screen
function home() {
	clickLogged = false;

	// Clear Canvas
	ctx.fillStyle = "green";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Draw Text
	ctx.fillStyle = "black";
	ctx.font = TITLE_FONT;
	ctx.fillText(homeText, TITLE_TEXT_X, TITLE_TEXT_Y);

	// Listen for click
	$("#gameCanvas").click(function(e) {

		// Don't accept another click until finished
		if (!clickLogged) {

			// Shuffle and deal the deck
			deck = shuffleCards();
			humanHand = [deck[3], deck[4], deck[5], deck[9], deck[10]];
			computerHand = [deck[0], deck[1], deck[2], deck[7], deck[8]];
			trump = deck[6];
			deckPointer = 11;

			// Remove this event handler so this code doesn't run in main game
			$(this).off();

			// Switch to main game loop
			clearInterval(homeScreen);
			gameLoop = setInterval(update, TIME_PER_FRAME);

			clickLogged = true;
		}
	});
}

// Game loop for main game
function update() {
	clickLogged = false;

	// Clear Screen
	ctx.fillStyle = "green";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "black";

	// Draw Deck
	ctx.drawImage(cards, CARDS["BACK"].X, CARDS["BACK"].Y, CARD_WIDTH, CARD_HEIGHT,
		DECK_X, DECK_Y, CARD_WIDTH, CARD_HEIGHT);

	// Draw Trump
	ctx.drawImage(cards, CARDS[trump].X, CARDS[trump].Y, CARD_WIDTH, CARD_HEIGHT,
		TRUMP_X, TRUMP_Y, CARD_WIDTH, CARD_HEIGHT);

	// Draw Player Hand
	for (var i = 0; i < humanHand.length; i++) {
		ctx.drawImage(cards, CARDS[humanHand[i]].X, CARDS[humanHand[i]].Y, CARD_WIDTH, CARD_HEIGHT,
			HAND_X + (CARD_WIDTH * i) + (HAND_CARD_OFFSET * i), HUMAN_HAND_Y, CARD_WIDTH, CARD_HEIGHT);
	}

	// Draw Player Tricks
	if (humanTricks.length != 0) {
		for (var i = 0; i < humanTricks.length - 1; i++) {
			ctx.drawImage(cards, CARDS[humanTricks[i]].X, CARDS[humanTricks[i]].Y, CARD_WIDTH_COVERED, CARD_HEIGHT,
				HAND_X + (CARD_WIDTH_COVERED * i), HUMAN_TRICKS_Y, CARD_WIDTH_COVERED, CARD_HEIGHT);
		}
		ctx.drawImage(cards, CARDS[humanTricks[humanTricks.length - 1]].X, CARDS[humanTricks[humanTricks.length - 1]].Y, CARD_WIDTH, CARD_HEIGHT,
			HAND_X + (CARD_WIDTH_COVERED * (humanTricks.length - 1)), HUMAN_TRICKS_Y, CARD_WIDTH, CARD_HEIGHT);
	}


	// Draw Computer Hand
	for (var i = 0; i < computerHand.length; i++) {
		ctx.drawImage(cards, CARDS[computerHand[i]].X, CARDS[computerHand[i]].Y, CARD_WIDTH, CARD_HEIGHT,
			HAND_X + (CARD_WIDTH * i) + (HAND_CARD_OFFSET * i), COMPUTER_HAND_Y, CARD_WIDTH, CARD_HEIGHT);
	}

	// Draw Computer Tricks
	if (computerTricks.length != 0) {
		for (var i = 0; i < computerTricks.length - 1; i++) {
			ctx.drawImage(cards, CARDS[computerTricks[i]].X, CARDS[computerTricks[i]].Y, CARD_WIDTH_COVERED, CARD_HEIGHT,
				HAND_X + (CARD_WIDTH_COVERED * i), COMPUTER_TRICKS_Y, CARD_WIDTH_COVERED, CARD_HEIGHT);
		}
		ctx.drawImage(cards, CARDS[computerTricks[computerTricks.length - 1]].X, CARDS[computerTricks[computerTricks.length - 1]].Y, CARD_WIDTH, CARD_HEIGHT,
			HAND_X + (CARD_WIDTH_COVERED * (computerTricks.length - 1)), COMPUTER_TRICKS_Y, CARD_WIDTH, CARD_HEIGHT);
	}

	// Draw Lead Button
	if (humanOnLead) {
		ctx.drawImage(lead, 0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_X, BUTTON_HUMAN_Y, BUTTON_WIDTH, BUTTON_HEIGHT);
	} else {
		ctx.drawImage(lead, 0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_X, BUTTON_COMPUTER_Y, BUTTON_WIDTH, BUTTON_HEIGHT);
	}

	// Draw Lead Card
	if (leadPlayed != "") {
		ctx.drawImage(cards, CARDS[leadPlayed].X, CARDS[leadPlayed].Y, CARD_WIDTH, CARD_HEIGHT,
			LEAD_X, PLAYED_Y, CARD_WIDTH, CARD_HEIGHT);
	}

	// Draw Follow Card
	if (followPlayed != "") {
		ctx.drawImage(cards, CARDS[followPlayed].X, CARDS[followPlayed].Y, CARD_WIDTH, CARD_HEIGHT,
			FOLLOW_X, PLAYED_Y, CARD_WIDTH, CARD_HEIGHT);
	}

	// Draw text
	ctx.font = TITLE_FONT;
	ctx.fillText("You", 720, 560);
	ctx.fillText("Computer", 670, 50);

	// Draw score
	ctx.font = MAIN_FONT;
	ctx.fillText("Trick Points: " + humanTrickPoints, TALLY_X, HUMAN_TRICK_POINT_Y);
	ctx.fillText("Game Points: " + humanGamePoints, TALLY_X, HUMAN_GAME_POINT_Y);
	ctx.fillText("Trick Points: " + computerTrickPoints, TALLY_X, COMPUTER_TRICK_POINT_Y);
	ctx.fillText("Game Points: " + computerGamePoints, TALLY_X, COMPUTER_GAME_POINT_Y);

	// Listen for click
	$("#gameCanvas").click(function(e) {

		// Don't accept another click until finished
		if (!clickLogged) {

			// Get click location
			var xClick = getXClick(e);
			var yClick = getYClick(e);

			// Check all clickable objects for click
			if (clickedCard1(xClick, yClick)) {
				playCard(0);
			} else if (clickedCard2(xClick, yClick)) {
				playCard(1);
			} else if (clickedCard3(xClick, yClick)) {
				playCard(2);
			} else if (clickedCard4(xClick, yClick)) {
				playCard(3);
			} else if (clickedCard5(xClick, yClick)) {
				playCard(4);
			} else {
				console.log("No cards clicked...");
			}

			clickLogged = true;
		}
	});
}

// Play the selected card, computer plays if applicable, and decide winner
function playCard(cardNum) {
	var card = humanHand.splice(cardNum, 1)[0];

	if (humanOnLead) {
		leadPlayed = card;
		computerPlayFollow();
	} else {
		followPlayed = card;
	}

	setTimeout(decideWinner, 2000);
}

function decideWinner() {
	var leadWon = true;

	if ((CARDS[followPlayed].suit == CARDS[leadPlayed].suit && CARDS[followPlayed].value > CARDS[leadPlayed].value) || 
			CARDS[followPlayed].suit == CARDS[trump].suit && CARDS[leadPlayed].suit != CARDS[trump].suit) {
		leadWon = false;
	}

	if (humanOnLead == leadWon) {
		humanTricks.push(leadPlayed, followPlayed);
		humanTrickPoints += CARDS[leadPlayed].value + CARDS[followPlayed].value;
		leadPlayed = "";
		followPlayed = "";
		humanHand.push(deck[deckPointer]);
		computerHand.push(deck[deckPointer + 1]);
		deckPointer += 2;
	} else {
		computerTricks.push(leadPlayed, followPlayed);
		computerTrickPoints += CARDS[leadPlayed].value + CARDS[followPlayed].value;
		leadPlayed = "";
		followPlayed = "";
		computerHand.push(deck[deckPointer]);
		humanHand.push(deck[deckPointer + 1]);
		deckPointer += 2;
	}
}

function computerPlayFollow() {
	// Play higher cards of same suit
	for (var i = 0; i < computerHand.length; i++) {
		if (CARDS[computerHand[i]].suit == CARDS[leadPlayed].suit && CARDS[computerHand[i]].value > CARDS[leadPlayed].value) {
			var card = computerHand.splice(i, 1)[0];
			followPlayed = card;
			return;
		}
	}

	// Otherwise, play lowest card
	var lowest = 12;  // Arbitrary value
	var lowestCard = 0;
	for (var i = 0; i < computerHand.length; i++) {
		if (CARDS[computerHand[i]].value < lowest && CARDS[computerHand[i]].suit != CARDS[trump].suit) {
			lowestCard = i;
			lowest = CARDS[computerHand[i]].value;
		}
	}
	var card = computerHand.splice(lowestCard, 1)[0];
	followPlayed = card;
}

function computerPlayLead() {

}

function getXClick(e) {
	return e.pageX - $("#gameCanvas").offset().left + $("#gameCanvas").scrollLeft();
}

function getYClick(e) {
	return e.pageY - $("#gameCanvas").offset().top + $("#gameCanvas").scrollTop();
}

function shuffleCards() {
	var cards = ["JACK_C", "QUEEN_C", "KING_C", "TEN_C", "ACE_C", "JACK_S", "QUEEN_S", "KING_S", "TEN_S", "ACE_S",
			"JACK_H", "QUEEN_H", "KING_H", "TEN_H", "ACE_H", "JACK_D", "QUEEN_D", "KING_D", "TEN_D", "ACE_D"];

	// Randomize array using Fisher-Yates Shuffle
	for (var i = cards.length - 1; i >= 0; i--) {
		var j = getRandomInt(0, i);
		var temp = cards[j];
		cards[j] = cards[i];
		cards[i] = temp;
	}

	return cards;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clickedCard1(x, y) {
	return x >= 220 && x <= 291 && y >= 380 && y <= 476;
}

function clickedCard2(x, y) {
	return x >= 296 && x <= 367 && y >= 380 && y <= 476;
}

function clickedCard3(x, y) {
	return x >= 372 && x <= 443 && y >= 380 && y <= 476;
}

function clickedCard4(x, y) {
	return x >= 448 && x <= 519 && y >= 380 && y <= 476;
}

function clickedCard5(x, y) {
	return x >= 524 && x <= 595 && y >= 380 && y <= 476;
}