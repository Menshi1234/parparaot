// constants
const MAX_PROMPT = 500; /** The maximum length of a prompt. */

//This function turns any hebrew word into a gamatria number
function countGamatria(user_word) {
    const map = new Map();
      map.set("a", 1);
        map.set("b", 2);
        map.set("c", 3);
        map.set("d", 4);
        map.set("e", 5);
        map.set("f", 6);
        map.set("g", 7);
        map.set("h", 8);
        map.set("i", 9);
        map.set("j", 10);
        map.set("k", 20);
        map.set("l", 30);
        map.set("m", 40);
        map.set("n", 50);
        map.set("o", 60);
        map.set("p", 70);
        map.set("q", 80);
        map.set("r", 90);
        map.set("s", 100);       map.set(" ", 0);
        map.set("t", 200);
        map.set("u", 300);     map.set(" ", 0);
        map.set("v", 400);
        map.set("w", 500);
        map.set("x", 600);
        map.set("y", 700);
        map.set("z", 800);
    map.set("א", 1);
    map.set("ב", 2);
    map.set("ג",3);
    map.set("ד", 4);
    map.set("ה", 5);
    map.set("ו", 6);
    map.set("ז", 7);
    map.set("ח", 8);
    map.set("ט", 9);
    map.set("י", 10);
    map.set("כ", 20);
    map.set("ך",20);
    map.set("ל", 30);
    map.set("מ", 40);
    map.set("ם", 40);
    map.set("נ", 50);
    map.set("ן",50);
    map.set("ס",60);
    map.set("ע", 70);
    map.set("פ", 80);
    map.set("ף", 80);
    map.set("צ",90);
    map.set("ץ", 90);
    map.set("ק", 100);
    map.set("ר", 200);
    map.set("ש", 300);
    map.set("ת", 400);
    //let array = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ", "ק", "ר", "ש", "ת"];
    //let array2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400]
    //let element = 0;
    let value = 0;
    let gamatria = 0;
    for (const letter of user_word) {
        gamatria += map.get(letter);
    }

    //console.log(user_word + " --> "+gamatria);
    return (gamatria);
}

// This function prompt the user to enter a text they want
function countText(user_text, gematria) {
    const map2 = new Map();
    let output = document.getElementById("found");
    let j = 0;
    let originalPhrase = "";
    let originalGematria = gematria;
    let words2 = user_text.split(" ");
    let x = 0;
    for (let i = 0; i < words2.length; i++) {
        let tempPhrase = ""; // the phrase I am constructing right now

        for (const word of words2) {
            if (gematria >= countGamatria(word)) {
                let wordGematria = countGamatria(word);
                gematria -= wordGematria;
                tempPhrase += word + " "; //" (" + wordGematria + ") ";
                if (gematria == 0) {
                    if(!map2.has(tempPhrase)){
                        map2.set(tempPhrase, x);

                        // record the temporary phrase as an option to the #found select
                        const option = document.createElement("option");
                        option.value=option.textContent=tempPhrase;
                        output.appendChild(option);

                    }
                    gematria = originalGematria;
                    break;
                }
            } else {
                gematria = originalGematria;
                break;
            }
        }
        words2 = words2.slice(1);
    }

    if (output.options.length==0) {
        alert("No phrases were found with the same gematria.  Please try again!");
    }
}

// select all phrases that were found by the gematria search
function selectAllPhrases() {
    let output = document.getElementById("found");
    for (let option of output.options) {
        option.selected=true;
    }
}

async function doCountText() {
    document.getElementById("loader").style.display = "block"; // show the loader

    let user_word = document.getElementById("word").value;
    let wordGematria = countGamatria(user_word);
    let foundResponse = document.getElementById("found");
    foundResponse.innerHtml=""; // initialize

    let user_text = document.getElementById("text").value;
    countText(user_text, wordGematria);

    document.getElementById("loader").style.display = "none"; // hide the loader
}

async function loadFile(selectElement) {
    document.getElementById("loader").style.display = "block"; // show the loader

    const fileName = selectElement.value; // Get the selected file name
    if (fileName) {
        try {
            const response = await fetch("Texts/" + fileName); // Fetch the file
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // populate the user_text box with the contents of the file
            document.getElementById("text").value = await response.text(); // Read file content as a string
        } catch (error) {
            console.error('Error loading file:', error);
            document.getElementById('output').innerText = "Error loading file.";
        }
    }

    document.getElementById("loader").style.display = "none"; // hide the loader
}

function createPrompt(bestWords) {
    // the user's word or phrase
    let user_word = document.getElementById("word").value;

    // get all Gemmatria equivalents
    // const options = document.getElementById("found").value;
    // const lines = options.split("\n"); // the number of gematriot found
    // const filteredLines = lines.filter(line=>line.trim() != "");
    // if (filteredLines===0) { // no gematria options
    //     alert("No gematria equivalents were found!  Please 'Find Gematria Words' first.");
    //     return;
    // }
    // //const randomIndex = Math.floor(Math.random() * filteredLines.length); // random choice
    // //const randomIndex = Math.floor(Math.random() * filteredLines.length); // random choice
    // choseGematria = filteredLines[0];
    // for(let x = 1; x<filteredLines.length-1; x++){
    //     choseGematria += ", "+filteredLines[x]; // the line itself
    // }
    let choseGematria="";
    const foundItems = document.getElementById("found");
    if (foundItems.length==0) {
        alert("No gematria equivalents were found!  Please 'Find Gematria' with a different phrase.");
        return;
    }
    for (let option of foundItems.options) {
        if (option.selected) {
            choseGematria +=(choseGematria==="")? option.textContent:", "+option.textContent;
        }
    }

    let prompt = "Please provide a Dvar Torah using the fact that" +
        "the phrase "+user_word+" has the same gematria as the following phrases " + choseGematria+
        ".  Please use whichever of these phrases that suit your needs.";
    prompt = prompt.substring(0,MAX_PROMPT);
    window.open("https://ipsit.bu.edu/generic/gemini.pl?key=31415&prompt="
        +(prompt));
}