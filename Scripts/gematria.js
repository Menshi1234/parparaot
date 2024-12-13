// constants
const MAX_PROMPT = 500; /** The maximum length of a prompt. */

//This function turns any hebrew word into a gematria number
function countGematria(user_word) {
    const map = new Map();
    map.set(" ", 0);
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
    let gematria = 0;
    for (const letter of user_word) {
        gematria += map.get(letter);
    }

    //console.log(user_word + " --> "+gematria);
    return (gematria);
}

// This function prompt the user to enter a text they want
function countText(user_text, gematria) {
    const map2 = new Map();
    let output = document.getElementById("found");
    let originalGematria = gematria;
    let words2 = user_text.split(" ");
    let x = 0;
    for (let i = 0; i < words2.length; i++) {
        let tempPhrase = ""; // the phrase I am constructing right now

        for (const word of words2) {
            if (gematria >= countGematria(word)) {
                let wordGematria = countGematria(word);
                gematria -= wordGematria;
                tempPhrase += word + " "; //" (" + wordGematria + ") ";
                if (gematria === 0) {
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

    if (output.options.length===0) {
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
    let wordGematria = countGematria(user_word);
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

function createPrompt() {
    // the user's word or phrase
    let user_word = document.getElementById("word").value;

    // get all Gemmatria equivalents
    let choseGematria="";
    const foundItems = document.getElementById("found");
    if (foundItems.length===0) {
        alert("No gematria equivalents were found!  Please 'Find Gematria' with a different phrase.");
        return;
    }
    for (let option of foundItems.options) {
        if (option.selected) {
            choseGematria +=(choseGematria==="")? option.textContent:", "+option.textContent;
        }
    }

    let thePrompt = "Please provide a Dvar Torah using the fact that" +
        "the phrase "+user_word+" has the same gematria as the following phrases " + choseGematria+
        ".  Please use whichever of these phrases that suit your needs.";
    thePrompt = thePrompt.substring(0,MAX_PROMPT);
    document.getElementById("prompt").value=thePrompt;
    // window.open("https://ipsit.bu.edu/generic/gemini.pl?key=31415&prompt="
    //     +(prompt));
}