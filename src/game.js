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
var trumpSuit = "";
var leadPlayed = "";
var followPlayed = "";

// Game variables
var humanStartLead = true;
var humanOnLead = true;
var stockClosed = false;
var endGame = false;
var message = "";
var winner = "";
var gamePointsWon = 0;

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

			// Shuffle and deal deck
			newDeal();

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

	// Clear Canvas
	ctx.fillStyle = "green";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "black";

	// Draw Deck
	if (stockClosed) {
		ctx.drawImage(cards, CARDS[trump].X, CARDS[trump].Y, CARD_WIDTH, CARD_HEIGHT,
			DECK_X, DECK_Y, CARD_WIDTH, CARD_HEIGHT);
	} else if (!endGame) {
		ctx.drawImage(cards, CARDS["BACK"].X, CARDS["BACK"].Y, CARD_WIDTH, CARD_HEIGHT,
			DECK_X, DECK_Y, CARD_WIDTH, CARD_HEIGHT);
	}

	// Draw Trump
	if (!endGame) {
		ctx.drawImage(cards, CARDS[trump].X, CARDS[trump].Y, CARD_WIDTH, CARD_HEIGHT,
			TRUMP_X, TRUMP_Y, CARD_WIDTH, CARD_HEIGHT);
	}

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
	ctx.fillText("You", HUMAN_NAME_X, HUMAN_NAME_Y);
	ctx.fillText("Computer", COMPUTER_NAME_X, COMPUTER_NAME_Y);

	// Draw score
	ctx.font = MAIN_FONT;
	ctx.fillText("Trick Points: " + humanTrickPoints, TALLY_X, HUMAN_TRICK_POINT_Y);
	ctx.fillText("Game Points: " + humanGamePoints, TALLY_X, HUMAN_GAME_POINT_Y);
	ctx.fillText("Trick Points: " + computerTrickPoints, TALLY_X, COMPUTER_TRICK_POINT_Y);
	ctx.fillText("Game Points: " + computerGamePoints, TALLY_X, COMPUTER_GAME_POINT_Y);

	// Draw message if applicable
	ctx.fillText(message, MESSAGE_X, TEXT_Y);

	// Draw trump reminder if trump is gone
	if (endGame && !stockClosed) {
		ctx.fillText("trump is " + trumpSuit, TRUMP_MSG_X, TEXT_Y);
	}

	// Draw winner if applicable
	if (winner != "") {
		ctx.fillText(winner + " wins! -" + gamePointsWon + " game point(s)!", WINNER_X, TEXT_Y);
	}

	// Listen for click
	$("#gameCanvas").click(function(e) {

		// Don't accept another click until finished
		if (!clickLogged) {
			// Reset message
			message = "";

			// Get click location
			var xClick = getXClick(e);
			var yClick = getYClick(e);

			// Check all clickable objects for click
			// If card clicked, play it.
			if (clickedCard1(xClick, yClick) && validPlay(0)) {
				playCard(0);
			} else if (clickedCard2(xClick, yClick) && validPlay(1)) {
				playCard(1);
			} else if (clickedCard3(xClick, yClick) && validPlay(2)) {
				playCard(2);
			} else if (clickedCard4(xClick, yClick) && validPlay(3)) {
				playCard(3);
			} else if (clickedCard5(xClick, yClick) && validPlay(4)) {
				playCard(4);
			} else {
				console.log("No cards clicked...");
			}

			clickLogged = true;
		}
	});
}

// Check whether given card play is valid
function validPlay(cardNum) {

	// Validity only comes into play during following of endgame
	if (endGame && !humanOnLead) {

		// See if there's a better card in hand
		for (var i = 0; i < humanHand.length; i++) {
			if ((CARDS[humanHand[i]].suit == CARDS[leadPlayed].suit &&
					CARDS[humanHand[i]].value > CARDS[leadPlayed].value &&
					(CARDS[humanHand[cardNum]].suit != CARDS[leadPlayed].suit ||
					CARDS[humanHand[cardNum]].value < CARDS[leadPlayed].value)) ||
					(CARDS[humanHand[i]].suit == CARDS[leadPlayed].suit &&
					CARDS[humanHand[cardNum]].suit != CARDS[leadPlayed].suit) ||
					(CARDS[humanHand[i]].suit == trumpSuit &&
					CARDS[humanHand[cardNum]].suit != trumpSuit)) {

				// If there is, the play is invalid
				message = "Not a valid play";
				return false;
			}
		}
	}

	return true;
}

// Play the selected card, computer plays if applicable, and decide winner
function playCard(cardNum) {
	var card = humanHand.splice(cardNum, 1)[0];
	computerSeen.push(card);

	if (humanOnLead) {
		leadPlayed = card;
		computerPlayFollow();
	} else {
		followPlayed = card;
	}

	// Let person see cards played for 2 seconds before putting them away
	setTimeout(decideWinner, 2000);
}

// Compare the two played cards, chose the winner, and follow post-trick procedure
function decideWinner() {
	var leadWon = true;

	// Follower wins if cards are same suit and follower has higher value or follower trumps lead
	if ((CARDS[followPlayed].suit == CARDS[leadPlayed].suit && CARDS[followPlayed].value > CARDS[leadPlayed].value) || 
			CARDS[followPlayed].suit == trumpSuit && CARDS[leadPlayed].suit != trumpSuit) {
		leadWon = false;
	}

	// Decide what cards to give to who and who new lead is
	if (humanOnLead == leadWon) {

		// Human won, give cards to them
		humanTricks.push(leadPlayed, followPlayed);
		humanTrickPoints += CARDS[leadPlayed].value + CARDS[followPlayed].value;
		leadPlayed = "";
		followPlayed = "";

		// If human gains 66 or more points, they win
		if (humanTrickPoints >= 66 || (humanHand.length == 0 && computerHand.length == 0)) {
			winner = "Human";

			if (computerTricks.length == 0) {
				gamePointsWon = 3;
			} else if (computerTrickPoints < 33) {
				gamePointsWon = 2;
			} else {
				gamePointsWon = 1;
			}

			humanGamePoints -= gamePointsWon;

			if (humanGamePoints <= 0) {
				console.log("Human wins game!");
			} else {
				setTimeout(newDeal, 2000);
			}
		} else {

			// Deal cards if there are more cards left
			if (deckPointer < 21) {
				if (deckPointer == 19) {

					// Deal out last two cards
					humanHand.push(deck[deckPointer]);
					computerHand.push(trump);
					trump = "";
					endGame = true;
				} else {

					// Deal cards normally
					humanHand.push(deck[deckPointer]);
					computerHand.push(deck[deckPointer + 1]);
					computerSeen.push(deck[deckPointer + 1]);
				}

				deckPointer += 2;
			}

			// Set human lead for next trick
			humanOnLead = true;
		}
	} else {
		// Computer won, give cards to it
		computerTricks.push(leadPlayed, followPlayed);
		computerTrickPoints += CARDS[leadPlayed].value + CARDS[followPlayed].value;
		leadPlayed = "";
		followPlayed = "";

		// If computer gains 66 or more points, or it's the last trick, it wins
		if (computerTrickPoints >= 66 || (computerHand.length == 0 && humanHand.length == 0)) {
			winner = "Computer";
			if (humanTricks.length == 0) {
				gamePointsWon = 3;
			} else if (humanTrickPoints < 33) {
				gamePointsWon = 2;
			} else {
				gamePointsWon = 1;
			}

			computerGamePoints -= gamePointsWon

			if (computerGamePoints <= 0) {
				console.log("Computer wins game...");
			} else {
				setTimeout(newDeal, 2000);
			}
		} else {

			// Deal cards if there are more cards left
			if (deckPointer < 21) {
				if (deckPointer == 19) {

					// Deal out last two cards
					computerHand.push(deck[deckPointer]);
					computerSeen.push(deck[deckPointer]);
					humanHand.push(trump);
					trump = "";
					endGame = true;
				} else {

					// Deal cards normally
					computerHand.push(deck[deckPointer]);
					computerSeen.push(deck[deckPointer]);
					humanHand.push(deck[deckPointer + 1]);
				}

				deckPointer += 2;
			}

			// Set computer lead for next trick, and have computer play
			humanOnLead = false;
			computerPlayLead();
		}
	}
}

// Logic for computer to play following the human
function computerPlayFollow() {

	// Different rules for playing based on endgame or not
	if (endGame) {

		// Must play card of same suit and higher value if possible
		for (var i = 0; i < computerHand.length; i++) {
			if (CARDS[computerHand[i]].suit == CARDS[leadPlayed].suit && CARDS[computerHand[i]].value > CARDS[leadPlayed].value) {
				var card = computerHand.splice(i, 1)[0];
				followPlayed = card;
				return;
			}
		}

		// Then must play card of same suit and lower value if possible
		for (var i = 0; i < computerHand.length; i++) {
			if (CARDS[computerHand[i]].suit == CARDS[leadPlayed].suit) {
				var card = computerHand.splice(i, 1)[0];
				followPlayed = card;
				return;
			}
		}

		// Then must trump if possible
		for (var i = 0; i < computerHand.length; i++) {
			if (CARDS[computerHand[i]].suit == trumpSuit) {
				var card = computerHand.splice(i, 1)[0];
				followPlayed = card;
				return;
			}
		}

		// Then play any card, preferably of lowest value (because computer will lose)
		var lowest = 12;  // Arbitrary value
		var lowestCard = 0;

		for (var i = 0; i < computerHand.length; i++) {
			if (CARDS[computerHand[i]].value < lowest) {
				lowestCard = i;
				lowest = CARDS[computerHand[i]].value;
			}
		}

		var card = computerHand.splice(lowestCard, 1)[0];
		followPlayed = card;
	} else {

		// First, play higher cards of same suit
		for (var i = 0; i < computerHand.length; i++) {
			if (CARDS[computerHand[i]].suit == CARDS[leadPlayed].suit && CARDS[computerHand[i]].value > CARDS[leadPlayed].value) {
				var card = computerHand.splice(i, 1)[0];
				followPlayed = card;
				return;
			}
		}

		// Otherwise, play lowest card not of trump suit
		var lowest = 12;  // Arbitrary value
		var lowestCard = 0;

		for (var i = 0; i < computerHand.length; i++) {
			if (CARDS[computerHand[i]].value < lowest && CARDS[computerHand[i]].suit != trumpSuit) {
				lowestCard = i;
				lowest = CARDS[computerHand[i]].value;
			}
		}

		var card = computerHand.splice(lowestCard, 1)[0];
		followPlayed = card;
	}
}

// Logic for computer to play while on lead
function computerPlayLead() {

	// Different strategy based on whether in endgame
	if (endGame) {

	} else {

	}

	// Always play lowest card not of trump suit
	var lowest = 12;  // Arbitrary value
	var lowestCard = 0;
	for (var i = 0; i < computerHand.length; i++) {
		if (CARDS[computerHand[i]].value < lowest && CARDS[computerHand[i]].suit != trumpSuit) {
			lowestCard = i;
			lowest = CARDS[computerHand[i]].value;
		}
	}
	var card = computerHand.splice(lowestCard, 1)[0];
	leadPlayed = card;
}

function newDeal() {
	// Reset game variables
	humanTricks = [];
	computerTricks = [];
	computerSeen = [];
	stockClosed = false;
	endGame = false;
	winner = "";
	gamePointsWon = 0;
	humanTrickPoints = 0;
	computerTrickPoints = 0;

	// Shuffle the deck
	deck = shuffleCards();

	// Deal out cards based on who starts leading
	if (humanStartLead) {
		humanHand = [deck[0], deck[1], deck[2], deck[7], deck[8]];
		computerHand = [deck[3], deck[4], deck[5], deck[9], deck[10]];
		computerSeen = [deck[3], deck[4], deck[5], deck[9], deck[10]];
	} else {
		computerHand = [deck[0], deck[1], deck[2], deck[7], deck[8]];
		computerSeen = [deck[0], deck[1], deck[2], deck[7], deck[8]];
		humanHand = [deck[3], deck[4], deck[5], deck[9], deck[10]];
	}

	trump = deck[6];
	computerSeen.push(trump);
	trumpSuit = CARDS[trump].suit;
	deckPointer = 11;

	// Set the first lead
	humanOnLead = humanStartLead;

	if (!humanOnLead) {
		computerPlayLead();
	}

	// Switch the first leader for the next game
	humanStartLead = !humanStartLead;
}

// Return the X position of the click relative to the canvas
function getXClick(e) {
	return e.pageX - $("#gameCanvas").offset().left + $("#gameCanvas").scrollLeft();
}

// Return the Y position of the click relative to the canvas
function getYClick(e) {
	return e.pageY - $("#gameCanvas").offset().top + $("#gameCanvas").scrollTop();
}

// Return an array of cards in random order
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

// Return a random integer between the min (inclusive) and max (inclusive)
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Return whether the x and y position of a click match position of card 1
function clickedCard1(x, y) {
	return x >= HAND_X && x <= HAND_X + CARD_WIDTH &&
		y >= HUMAN_HAND_Y && y <= HUMAN_HAND_Y + CARD_HEIGHT;
}

// Return whether the x and y position of a click match position of card 2
function clickedCard2(x, y) {
	return x >= HAND_X + CARD_WIDTH + HAND_CARD_OFFSET &&
		x <= HAND_X + 2 * CARD_WIDTH + HAND_CARD_OFFSET &&
		y >= HUMAN_HAND_Y && y <= HUMAN_HAND_Y + CARD_HEIGHT;
}

// Return whether the x and y position of a click match position of card 3
function clickedCard3(x, y) {
	return x >= HAND_X + 2 * CARD_WIDTH + 2 * HAND_CARD_OFFSET &&
		x <= HAND_X + 3 * CARD_WIDTH + 2 * HAND_CARD_OFFSET &&
		y >= HUMAN_HAND_Y && y <= HUMAN_HAND_Y + CARD_HEIGHT;
}

// Return whether the x and y position of a click match position of card 4
function clickedCard4(x, y) {
	return x >= HAND_X + 3 * CARD_WIDTH + 3 * HAND_CARD_OFFSET &&
		x <= HAND_X + 4 * CARD_WIDTH + 3 * HAND_CARD_OFFSET &&
		y >= HUMAN_HAND_Y && y <= HUMAN_HAND_Y + CARD_HEIGHT;
}

// Return whether the x and y position of a click match position of card 5
function clickedCard5(x, y) {
	return x >= HAND_X + 4 * CARD_WIDTH + 4 * HAND_CARD_OFFSET &&
		x <= HAND_X + 5 * CARD_WIDTH + 4 * HAND_CARD_OFFSET &&
		y >= HUMAN_HAND_Y && y <= HUMAN_HAND_Y + CARD_HEIGHT;
}