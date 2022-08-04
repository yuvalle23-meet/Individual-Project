
var cards = {
	"AC" : "/static/images/cards/AC.png", "AD" : "/static/images/cards/AD.png", "AS" : "/static/images/cards/AS.png", "AH" : "/static/images/cards/AH.png", "KC" : "/static/images/cards/KC.png", "KD" : "/static/images/cards/KD.png", "KH" : "/static/images/cards/KH.png", "KS" : "/static/images/cards/KS.png", "QC" : "/static/images/cards/QC.png", "QD" : "/static/images/cards/QD.png", "QH" : "/static/images/cards/QH.png", "QS" : "/static/images/cards/QS.png", "JC" : "/static/images/cards/JC.png", "JD" : "/static/images/cards/JD.png", "JH" : "/static/images/cards/JH.png", "JS" : "/static/images/cards/JS.png",
	
};

for (let i = 2; i <= 10; i++){

	for(let letter of ['C','D','H','S']){
		cards[i.toString()+letter] = "/static/images/cards/" + i.toString() + letter + ".png";

	}
}

//Modal//

var modal = document.getElementById("myModal");
var modallose = document.getElementById('myModallose');
var modalwin = document.getElementById('myModalwin');
var modaldraw = document.getElementById('myModaldraw');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

var btnclose = document.getElementById('closelose');
var btnclose1 = document.getElementById('closewin');
var btnclose2 = document.getElementById('closedraw');
var output = document.getElementById('coinvalue');
var string = "";

btnclose.onclick = function () {
	gamerunning = false;
	string = coins.toString();
	output.value = string;
	modallose.style.display = "none";
}
btnclose1.onclick = function () {
	gamerunning = false;
	string = coins.toString();
	output.value = string;
	modalwin.style.display = "none";
}
btnclose2.onclick = function () {
	gamerunning = false;
	string = coins.toString(); 
	output.value = string;
	modaldraw.style.display = "none";
}

const values = Object.values(cards);
const keys = Object.keys(cards);
var randcard = "";
var rand = 0;
var randkey = "";
var sum = 0;
var count = 0;
var cardsindeck = [];
var dealersum = 0;
var cardcount = 0;
var dealercardcount = 0;
var dealercards = [];
var cards = [];
var bet = 0;
var gamerunning = false
var coins;

function cancel(){
	modal.style.display = "none"
}

function design(list){
	length = list.length;
		for(let i = 0; i<=length-1; i++){
			document.getElementById('dealercard' + (i+1)).src = list[i];

		}
}
function design1(list){
	length = list.length;
		for(let i = 0; i<=length-1; i++){
			document.getElementById('card' + (i+1)).src = list[i];

		}
}

function check(key){
	if (key.charAt(0) != "A"){
			if ((key.charAt(0) != "Q")&&(key.charAt(0) != "J")&&(key.charAt(0) != "K")&&(key.charAt(0)!= '1')){
				return parseInt(randkey.charAt(0));
			}
			else{
				return 10;
			}
		}
		else{
			return 1;
		} 
}

function fold(){
	if (gamerunning == true){
		dealersum=0;
		while(dealersum<=21){
			rand = Math.floor(Math.random() * values.length);
			randcard = values[rand];
			randkey = keys[rand];
			if (!cardsindeck.includes(randkey)){
				dealersum += check(randkey);
				cardsindeck.push(randkey);
				dealercards.push(randcard);

				if (dealersum <= 21){
					design(dealercards);
				}
			}

		}
		dealersum-=check(randkey);
		document.getElementById("dealersum").innerHTML = "Dealer's Total: "+dealersum;

		if (dealersum > sum){
			coins-=userbet;
			document.getElementById('coins').innerHTML = coins.toString();
			document.getElementById('modallosecontent').innerHTML = "You have lost your bet and have " + coins+" coins left!";
			cards = [];
			dealercards = [];
			design(dealercards);
			design1(cards);
			modallose.style.display = "block";

		}
		if (dealersum < sum) {
			coins+=userbet;
			document.getElementById('coins').innerHTML = coins.toString();
			document.getElementById('modalwincontent').innerHTML = "You have won your bet and have " + coins+" coins left!";
			cards = [];
			dealercards = [];
			design(dealercards);
			design1(cards);
			modalwin.style.display = "block";

		}
		if (dealersum==sum){
			document.getElementById('modaldrawcontent').innerHTML = "You have drawn your bet and have " + coins+" coins left!";
			cards = [];
			dealercards = [];
			design(dealercards);
			design1(cards);
			modaldraw.style.display = "block";

		}
	}
}

function reset(){
	for(let i = 1; i <= 5; i++){
		document.getElementById('card' + i).src = "static/images/red_back.png";
		document.getElementById('dealercard' + i).src = "static/images/red_back.png";
	}
}

function hit(){
	if (gamerunning == true){
		dealersum = 0;
		rand = Math.floor(Math.random() * values.length);
		randcard = values[rand];
		randkey = keys[rand];
		if (!cardsindeck.includes(randkey)){
			if(cards.length < 5) {
				sum += check(randkey);
				cardsindeck.push(randkey);
				cards.push(randcard);
				design1(cards);
			}
			else{
				coins+=userbet;
				document.getElementById('coins').innerHTML = coins.toString();
				document.getElementById('modalwincontent').innerHTML = "You have won your bet and have " + coins+" coins left!";
				cards = [];
				dealercards = [];
				design(dealercards);
				design1(cards);
				modalwin.style.display = "block";

			}
		}
		document.getElementById("sum").innerHTML = "Your Total: "+sum;
		if(sum > 21){
			coins-=userbet;
			document.getElementById('coins').innerHTML = coins.toString();
			document.getElementById('modallosecontent').innerHTML = "You have lost your bet and have " + coins+" coins left!";
			cards = [];
			dealercards = [];
			design(dealercards);
			design1(cards);
			modallose.style.display = "block";
		}
		if (sum==21){
			while(dealersum<=21){
				rand = Math.floor(Math.random() * values.length);
				randcard = values[rand];
				randkey = keys[rand];
				if (!cardsindeck.includes(randkey)){
					dealersum += check(randkey);
					cardsindeck.push(randkey)
					dealercards.push(randcard)
					
					if (dealersum <= 21){

						design(dealercards);
					}

				}

			}
			dealersum-=check(randkey);
			
			document.getElementById("dealersum").innerHTML = "Dealer's Total: "+dealersum;;
			if (dealersum == 21){
				document.getElementById('modaldrawcontent').innerHTML = "You have drawn your bet and have " + coins+" coins left!";
				cards = [];
				dealercards = [];
				design(dealercards);
				design1(cards);
				modaldraw.style.display = "block";


			}
			if (dealersum != 21){
				coins+=userbet;
				document.getElementById('coins').innerHTML = coins.toString();
				document.getElementById('modalwincontent').innerHTML = "You have won your bet and have " + coins +" coins left!";
				cards = [];
				dealercards = [];
				design(dealercards);
				design1(cards);
				modalwin.style.display = "block";
				
			}
		}
	}

}

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function start(){
	if(isNumeric(document.getElementById('bet').value) && parseInt(document.getElementById('bet').value) <= parseInt(document.getElementById('coins').innerHTML)){
		gamerunning = true;
		reset()
		coins = parseInt(document.getElementById('coins').innerHTML);
		modal.style.display = "none"
		document.getElementById("sum").innerHTML = "Your Total: ";
		document.getElementById("dealersum").innerHTML = "Dealer's Total: ";
		userbet = parseInt(document.getElementById('bet').value);

		document.getElementById('bet').value = "";
		sum = 0;
		count = 1;
		cardsindeck=[];
		cards = [];
		dealercards=[];
		while (count<=2){
			
			rand = Math.floor(Math.random() * values.length);
			randcard = values[rand];
			randkey = keys[rand];
			if (!cardsindeck.includes(randkey)){
				sum += check(randkey)
				cardsindeck.push(randkey)
				cards.push(randcard);
				count++;
				design1(cards);
			}

			

		}
		document.getElementById("sum").innerHTML = "Your Total: "+sum;
	}

}





