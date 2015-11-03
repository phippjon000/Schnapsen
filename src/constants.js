// System Values
var GAME_WIDTH = 900,
	GAME_HEIGHT = 600,
	TIME_PER_FRAME = 33;  // 30 FPS

// Font Type and Position Values
var TITLE_FONT = "bold 2em sans-serif",
	TITLE_TEXT_X = 50,
	TITLE_TEXT_Y = 100,
	MAIN_FONT = "bold 1.5em sans-serif",
	TALLY_X = 660,
	HUMAN_TRICK_POINT_Y = 510,
	HUMAN_GAME_POINT_Y = 470,
	COMPUTER_TRICK_POINT_Y = 100,
	COMPUTER_GAME_POINT_Y = 140,
	HUMAN_NAME_X = 720,
	HUMAN_NAME_Y = 560,
	COMPUTER_NAME_X = 670,
	COMPUTER_NAME_Y = 50,
	TEXT_Y = 300,
	MESSAGE_X = 600,
	TRUMP_MSG_X = 30,
	WINNER_X = 230;

// Image Position Values
var DECK_X = 30,
	DECK_Y = 250,
	TRUMP_X = 106,
	TRUMP_Y = 250,
	HAND_X = 220,
	HUMAN_HAND_Y = 380,
	HUMAN_TRICKS_Y = 490,
	COMPUTER_HAND_Y = 120,
	COMPUTER_TRICKS_Y = 10,
	HAND_CARD_OFFSET = 5,
	LEAD_X = 290,
	FOLLOW_X = 450,
	PLAYED_Y = 250,
	BUTTON_WIDTH = 80,
	BUTTON_HEIGHT = 80,
	BUTTON_X = 710,
	BUTTON_HUMAN_Y = 360,
	BUTTON_COMPUTER_Y = 160;

// Card Values
var SHEET_WIDTH = 355,
	SHEET_HEIGHT = 480,
	CARD_WIDTH = 71,
	CARD_WIDTH_COVERED = 12,
	CARD_HEIGHT = 96,
	CARDS = {
		JACK_C: {
			X: 0,
			Y: 0,
			value: 2,
			suit: "club"
		}, QUEEN_C: {
			X: 71,
			Y: 0,
			value: 3,
			suit: "club"
		}, KING_C: {
			X: 142,
			Y: 0,
			value: 4,
			suit: "club"
		}, TEN_C: {
			X: 213,
			Y: 0,
			value: 10,
			suit: "club"
		}, ACE_C: {
			X: 284,
			Y: 0,
			value: 11,
			suit: "club"
		}, JACK_S: {
			X: 0,
			Y: 96,
			value: 2,
			suit: "spade"
		}, QUEEN_S: {
			X: 71,
			Y: 96,
			value: 3,
			suit: "spade"
		}, KING_S: {
			X: 142,
			Y: 96,
			value: 4,
			suit: "spade"
		}, TEN_S: {
			X: 213,
			Y: 96,
			value: 10,
			suit: "spade"
		}, ACE_S: {
			X: 284,
			Y: 96,
			value: 11,
			suit: "spade"
		}, JACK_H: {
			X: 0,
			Y: 192,
			value: 2,
			suit: "heart"
		}, QUEEN_H: {
			X: 71,
			Y: 192,
			value: 3,
			suit: "heart"
		}, KING_H: {
			X: 142,
			Y: 192,
			value: 4,
			suit: "heart"
		}, TEN_H: {
			X: 213,
			Y: 192,
			value: 10,
			suit: "heart"
		}, ACE_H: {
			X: 284,
			Y: 192,
			value: 11,
			suit: "heart"
		}, JACK_D: {
			X: 0,
			Y: 288,
			value: 2,
			suit: "diamond"
		}, QUEEN_D: {
			X: 71,
			Y: 288,
			value: 3,
			suit: "diamond"
		}, KING_D: {
			X: 142,
			Y: 288,
			value: 4,
			suit: "diamond"
		}, TEN_D: {
			X: 213,
			Y: 288,
			value: 10,
			suit: "diamond"
		}, ACE_D: {
			X: 284,
			Y: 288,
			value: 11,
			suit: "diamond"
		}, BACK: {
			X: 0,
			Y: 384
		}
	};