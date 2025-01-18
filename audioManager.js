const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffer = null;

// Funkcija za nalaganje zvočnega posnetka
function loadAudioFile(url) {
    console.log("Nalaganje posnetka z:", url); 
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => audioContext.decodeAudioData(data))
        .then(buffer => {
            audioBuffer = buffer;
            console.log('Posnetek uspešno naložen');
            playAudio();
        })
        .catch(error => {
            console.error('Error loading audio:', error);
        });
}
// Funkcija za predvajanje zvočnega ponsetka
function playAudio() {
    if (audioBuffer) {
        const audioSource = audioContext.createBufferSource();
        audioSource.buffer = audioBuffer;
        audioSource.connect(audioContext.destination);
        audioSource.start();
        console.log('Zvočni posnetek se predvaja');
    } else {
        console.error('Zvočni posnetek še ni naložen');
    }
}

// Funkcija za nalaganje zvokov
export function loadSounds(dezEnabled, selectedScenario, selectedVehicle) {
    let wavFileName = ""; // Spremenljivka za ime WAV datoteke

    // Preveri scenarij in izberi ustrezno WAV datoteko
    if (dezEnabled === true && selectedScenario === "avtocesta" && selectedVehicle === "resevalec") {
        // Nalagaj zvok dežja in avtoceste za reševalno vozilo
        wavFileName = 'posnetek5_2024_6_4_16_13_34.wav';
        loadAudioFile(`./Zvočni posnetki/Resevalne_sirene/${wavFileName}`);
        console.log("Nalagam zvok dežja na avtocesti za reševalce...");
    } 
    else if (dezEnabled === true && selectedScenario === "avtocesta" && selectedVehicle === "gasilci") {
        // Nalagaj zvok dežja in avtoceste za gasilce
        wavFileName = 'posnetek5_2024_05_04_14_49_04.wav';
        loadAudioFile(`./Zvočni posnetki/Gasilske_sirene/${wavFileName}`);
        console.log("Nalagam zvok dežja na avtocesti za gasilce...");
    } 
    else if (dezEnabled === true && selectedScenario === "avtocesta" && selectedVehicle === "policija") {
        // Nalagaj zvok dežja in avtoceste za policijo
        wavFileName = 'posnetek5_2024_7_4_19_52_51.wav';
        loadAudioFile(`./Zvočni posnetki/Policijske_sirene/${wavFileName}`);
        console.log("Nalagam zvok dežja na avtocesti za policijo...");
    } 
    else if (dezEnabled === false && selectedScenario === "avtocesta" && selectedVehicle === "resevalec") {
        // Nalagaj zvok suhe avtoceste za reševalno vozilo
        wavFileName = 'posnetek2_2024_4_4_19_19_33.wav';
        loadAudioFile(`./Zvočni posnetki/Resevalne_sirene/${wavFileName}`);
        console.log("Nalagam zvok avtoceste za reševalce...");
    } 
    else if (dezEnabled === false && selectedScenario === "avtocesta" && selectedVehicle === "gasilci") {
        // Nalagaj zvok suhe avtoceste za gasilce
        wavFileName = 'posnetek2_2024_05_04_14_22_18.wav';
        loadAudioFile(`./Zvočni posnetki/Gasilske_sirene/${wavFileName}`);
        console.log("Nalagam zvok avtoceste za gasilce...");
    } 
    else if (dezEnabled === false && selectedScenario === "avtocesta" && selectedVehicle === "policija") {
        // Nalagaj zvok suhe avtoceste za policijo
        wavFileName = 'posnetek2_2024_7_4_19_18_55.wav';
        loadAudioFile(`./Zvočni posnetki/Policijske_sirene/${wavFileName}`);
        console.log("Nalagam zvok avtoceste za policijo...");
    } 
    else if (dezEnabled === true && selectedScenario === "prazna" && selectedVehicle === "resevalec") {
        // Nalagaj zvok dežja in vožnje po samotni cesti za reševalno vozilo
        wavFileName = 'posnetek6_2024_6_4_16_21_42.wav';
        loadAudioFile(`./Zvočni posnetki/Resevalne_sirene/${wavFileName}`);
        console.log("Nalagam zvok dežja in vožnje po samotni cesti za reševalce...");
    }
    else if (dezEnabled === true && selectedScenario === "prazna" && selectedVehicle === "gasilci") {
        // Nalagaj zvok dežja in vožnje po samotni cesti za gasilce
        wavFileName = 'posnetek6_2024_05_04_14_59_34.wav';
        loadAudioFile(`./Zvočni posnetki/Gasilske_sirene/${wavFileName}`);
        console.log("Nalagam zvok dežja in vožnje po samotni cesti za gasilce...");
    }
    else if (dezEnabled === true && selectedScenario === "prazna" && selectedVehicle === "policija") {
        // Nalagaj zvok dežja in vožnje po samotni cesti za policijo
        wavFileName = 'posnetek6_2024_7_4_20_01_02.wav';
        loadAudioFile(`./Zvočni posnetki/Policijske_sirene/${wavFileName}`);
        console.log("Nalagam zvok dežja in vožnje po samotni cesti za policijo...");
    }
    else if (dezEnabled === false && selectedScenario === "prazna" && selectedVehicle === "resevalec") {
        // Nalagaj zvok vožnje po samotni cesti za reševalno vozilo
        wavFileName = 'posnetek3_2024_4_4_19_30_45.wav';
        loadAudioFile(`./Zvočni posnetki/Resevalne_sirene/${wavFileName}`);
        console.log("Nalagam zvok vožnje po samotni cesti za reševalce...");
    }
    else if (dezEnabled === false && selectedScenario === "prazna" && selectedVehicle === "gasilci") {
        // Nalagaj zvok vožnje po samotni cesti za gasilce
        wavFileName = 'posnetek3_2024_05_04_14_30_11.wav';
        loadAudioFile(`./Zvočni posnetki/Gasilske_sirene/${wavFileName}`);
        console.log("Nalagam zvok vožnje po samotni cesti za gasilce...");
    }
    else if (dezEnabled === false && selectedScenario === "prazna" && selectedVehicle === "policija") {
        // Nalagaj zvok vožnje po samotni cesti za policijo
        wavFileName = 'posnetek3_2024_7_4_19_25_34.wav';
        loadAudioFile(`./Zvočni posnetki/Policijske_sirene/${wavFileName}`);
        console.log("Nalagam zvok vožnje po samotni cesti za policijo...");
    }
    else if (dezEnabled === true && selectedScenario === "mesto" && selectedVehicle === "resevalec") {
        // Nalagaj zvok dežja in vožnje po mestu za reševalno vozilo
        wavFileName = 'posnetek4_2024_4_4_19_40_05.wav';
        loadAudioFile(`./Zvočni posnetki/Resevalne_sirene/${wavFileName}`);
        console.log("Nalagam zvok dežja in vožnje po mestu za reševalce...");
    }
    else if (dezEnabled === true && selectedScenario === "mesto" && selectedVehicle === "gasilci") {
        // Nalagaj zvok dežja in vožnje po mestu za gasilce
        wavFileName = 'posnetek4_2024_05_04_14_41_19.wav';
        loadAudioFile(`./Zvočni posnetki/Gasilske_sirene/${wavFileName}`);
        console.log("Nalagam zvok dežja in vožnje po mestu za gasilce...");
    }
    else if (dezEnabled === true && selectedScenario === "mesto" && selectedVehicle === "policija") {
        // Nalagaj zvok dežja in vožnje po mestu za policijo
        wavFileName = 'posnetek4_2024_7_4_19_38_25.wav';
        loadAudioFile(`./Zvočni posnetki/Policijske_sirene/${wavFileName}`);
        console.log("Nalagam zvok dežja in vožnje po mestu za policijo...");
    }
    else if (dezEnabled === false && selectedScenario === "mesto" && selectedVehicle === "resevalec") {
        // Nalagaj zvok vožnje po mestu za reševalno vozilo
        wavFileName = 'posnetek1_2024_4_4_19_13_45.wav';
        loadAudioFile(`./Zvočni posnetki/Resevalne_sirene/${wavFileName}`);
        console.log("Nalagam zvok vožnje po mestu za reševalce...");
    }
    else if (dezEnabled === false && selectedScenario === "mesto" && selectedVehicle === "gasilci") {
        // Nalagaj zvok vožnje po mestu za gasilce
        wavFileName = 'posnetek1_2024_05_04_14_13_33.wav';
        loadAudioFile(`./Zvočni posnetki/Gasilske_sirene/${wavFileName}`);
        console.log("Nalagam zvok vožnje po mestu za gasilce...");
    }
    else if (dezEnabled === false && selectedScenario === "mesto" && selectedVehicle === "policija") {
        // Nalagaj zvok vožnje po mestu za policijo
        wavFileName = 'posnetek1_2024_7_4_19_11_23.wav';
        loadAudioFile(`./Zvočni posnetki/Policijske_sirene/${wavFileName}`);
        console.log("Nalagam zvok vožnje po mestu za policijo...");
    }
    else {
        // Če scenarij ni ustrezno definiran
        console.error("Nisem uspel določiti ustreznega zvoka za izbran scenarij in vozilo.");
    }

    // Če je ime WAV datoteke določeno, naloži ustrezne čase siren zanjo
    if (wavFileName) {
        loadSirenTimesForType(selectedVehicle, wavFileName);
    } else {
        console.error("Ime WAV datoteke ni določeno ali scenarij ni ustrezno definiran.");
    }
}



function loadSirenTimesForType(selectedVehicle, wavFileName) {
    const vehicleType = {
        resevalec: './Zvočni posnetki/Resevalne_sirene/casiSirene.txt',
        gasilci: './Zvočni posnetki/Gasilske_sirene/casiSirene.txt',
        policija: './Zvočni posnetki/Policijske_sirene/casiSirene.txt',
    };
    
    const selectedVehiclePath = vehicleType[selectedVehicle];
    
    if (!selectedVehiclePath) {
        console.error(`Neveljaven tip vozila: ${selectedVehicle}`);
        return;
    }
    
    console.log(`Nalagam čase za ${wavFileName} iz: ${selectedVehiclePath}`);
    
    fetch(selectedVehiclePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Napaka pri nalaganju datoteke: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            const sirenEntries = parseSirenEntries(data);

            // Odstranimo pripono .wav za primerjavo z datoteko
            const cleanFileName = wavFileName.replace(/\.wav$/, "");
            
            // üoiscemo vrstico z imenom
            const matchingEntry = sirenEntries.find(entry => entry.fileName === cleanFileName);

            if (matchingEntry) {
                // cas. razpon
                console.log(`Časi: ${matchingEntry.startTime}s - ${matchingEntry.endTime}s`);
            } else {
                console.warn(`WAV datoteka ${wavFileName} ni najdena v datoteki.`);
            }
        })
        .catch(error => {
            console.error(`Napaka pri nalaganju časov siren za ${selectedVehicle}:`, error);
        });
}




// Funkcija za razčlenjevanje vsebine in iskanje WAV datotek
function parseSirenEntries(data) {
    const lines = data.split("\n").filter(line => line.trim() !== ""); // Odstranimo prazne vrstice
    return lines.map(line => {
        const parts = line.split(": "); // Razdelimo vrstico na ime datoteke in čase
        if (parts.length < 2) {
            console.warn(`Preskakovanje neveljavne vrstice: ${line}`);
            return null; 
        }
        const fileName = parts[0]?.trim(); // Ime datoteke
        const times = parts[1]?.replace(/s/g, "").split(" - "); // Odstranimo "s" in razdelimo čase
        if (!times || times.length < 2) {
            console.warn(`Neveljavni časi v vrstici: ${line}`);
            return null; // Preskoči, če ni časov
        }
        const [startTime, endTime] = times.map(Number);
        if (isNaN(startTime) || isNaN(endTime)) {
            console.warn(`Časi niso številski: ${line}`);
            return null; // Preskoči, če časi niso številski
        }
        return { fileName, startTime, endTime }; 
    }).filter(entry => entry !== null); // Odstrani neveljavne vnose
}
