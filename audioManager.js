const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffer = null;

// Funkcija za nalaganje zvočnega posnetka
export function loadAudioFile(url) {
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
    if (dezEnabled === true && selectedScenario === "avtocesta" && selectedVehicle === "resevalec") {
        // Nalagaj zvok dežja in avtoceste
        loadAudioFile('./Zvočni posnetki/Resevalne_sirene/posnetek5_2024_6_4_16_13_34.wav');
        console.log("Nalagam zvok dežja na avtocesti...");
    } 
    else if (dezEnabled === true && selectedScenario === "avtocesta" && selectedVehicle === "gasilci") {
        // Nalagaj zvok dežja in avtoceste
        loadAudioFile('./Zvočni posnetki/Gasilske_sirene/posnetek5_2024_05_04_14_49_04.wav')
        console.log("Nalagam zvok dežja na avtocesti...");
    } 
    else if (dezEnabled === true && selectedScenario === "avtocesta" && selectedVehicle === "policija") {
        // Nalagaj zvok dežja in avtoceste
        loadAudioFile('./Zvočni posnetki/Policijske_sirene/posnetek5_2024_7_4_19_52_51.wav')
        console.log("Nalagam zvok dežja na avtocesti...");
    } 
    else  if (dezEnabled === false && selectedScenario === "avtocesta" && selectedVehicle === "resevalec") {
        // Nalagaj avtocesto brez dežje
        loadAudioFile('./Zvočni posnetki/Resevalne_sirene/posnetek2_2024_4_4_19_19_33.wav')
        console.log("Nalagam zvok avtoceste...");
    } 
    else  if (dezEnabled === false && selectedScenario === "avtocesta" && selectedVehicle === "gasilci") {
        // Nalagaj avtocesto brez dežje
        loadAudioFile('./Zvočni posnetki/Gasilske_sirene/posnetek2_2024_05_04_14_22_18.wav')
        console.log("Nalagam zvok avtoceste...");
    } 
    else  if (dezEnabled === false && selectedScenario === "avtocesta" && selectedVehicle === "policija") {
        // Nalagaj avtocesto brez dežje
        loadAudioFile('./Zvočni posnetki/Policijske_sirene/posnetek2_2024_7_4_19_18_55.wav')
        console.log("Nalagam zvok avtoceste...");
    } 
    else if (dezEnabled === true && selectedScenario === "prazna" && selectedVehicle === "resevalec") {
        // Nalagaj zvok dežja in vožnje po samotni cesti
        loadAudioFile('./Zvočni posnetki/Resevalne_sirene/posnetek6_2024_6_4_16_21_42.wav')
        console.log("Nalagam zvok dežja in vožnje po samotni cesti...");
    }
    else if (dezEnabled === true && selectedScenario === "prazna" && selectedVehicle === "gasilci") {
        // Nalagaj zvok dežja in vožnje po samotni cesti
        loadAudioFile('./Zvočni posnetki/Gasilske_sirene/posnetek6_2024_05_04_14_59_34.wav')
        console.log("Nalagam zvok dežja in vožnje po samotni cesti...");
    }
    else if (dezEnabled === true && selectedScenario === "prazna" && selectedVehicle === "policija") {
        // Nalagaj zvok dežja in vožnje po samotni cesti
        loadAudioFile('./Zvočni posnetki/Policijske_sirene/posnetek6_2024_7_4_20_01_02.wav')
        console.log("Nalagam zvok dežja in vožnje po samotni cesti...");
    }
    else if (dezEnabled === false && selectedScenario === "prazna" && selectedVehicle === "resevalec") {
        // Nalagaj zvok vožnje po samotni cesti
        loadAudioFile('./Zvočni posnetki/Resevalne_sirene/posnetek3_2024_4_4_19_30_45.wav')
        console.log("Nalagam zvok vožnje po samotni cesti...");
    }
    else if (dezEnabled === false && selectedScenario === "prazna" && selectedVehicle === "gasilci") {
        // Nalagaj zvok vožnje po samotni cesti
        loadAudioFile('./Zvočni posnetki/Gasilske_sirene/posnetek3_2024_05_04_14_30_11.wav')
        console.log("Nalagam zvok vožnje po samotni cesti...");
    }
    else if (dezEnabled === false && selectedScenario === "prazna" && selectedVehicle === "policija") {
        // Nalagaj zvok vožnje po samotni cesti
        loadAudioFile('./Zvočni posnetki/Policijske_sirene/posnetek3_2024_7_4_19_25_34.wav')
        console.log("Nalagam zvok vožnje po samotni cesti...");
    }
    else if (dezEnabled === true && selectedScenario === "mesto" && selectedVehicle === "resevalec") {
        // Naloži zvok dežja in vožnje po mestu
        loadAudioFile('/Zvočni posnetki/Resevalne_sirene/posnetek4_2024_4_4_19_40_05.wav')
        console.log("Nalagam zvok dežja in vožnje po mestu...");
    }
    else if (dezEnabled === true && selectedScenario === "mesto" && selectedVehicle === "gasilci") {
        // Naloži zvok dežja in vožnje po mestu
        loadAudioFile('./Zvočni posnetki/Gasilske_sirene/posnetek4_2024_05_04_14_41_19.wav')
        console.log("Nalagam zvok dežja in vožnje po mestu...");
    }
    else if (dezEnabled === true && selectedScenario === "mesto" && selectedVehicle === "policija") {
        // Naloži zvok dežja in vožnje po mestu
        loadAudioFile('./Zvočni posnetki/Policijske_sirene/posnetek4_2024_7_4_19_38_25.wav')
        console.log("Nalagam zvok dežja in vožnje po mestu...");
    }
    else if (dezEnabled === false && selectedScenario === "mesto" && selectedVehicle === "resevalec") {
        // Naloži zvok vožnje po mestu
        loadAudioFile('./Zvočni posnetki/Resevalne_sirene/posnetek1_2024_4_4_19_13_45.wav')
        console.log("Nalagam zvok vožnje po mestu...");
    }
    else if (dezEnabled === false && selectedScenario === "mesto" && selectedVehicle === "gasilci") {
        // Naloži zvok vožnje po mestu
        loadAudioFile('./Zvočni posnetki/Gasilske_sirene/posnetek1_2024_05_04_14_13_33.wav')
        console.log("Nalagam zvok vožnje po mestu...");
    }
    else if (dezEnabled === false && selectedScenario === "mesto" && selectedVehicle === "policija") {
        // Naloži zvok vožnje po mestu
        loadAudioFile('./Zvočni posnetki/Policijske_sirene/posnetek1_2024_7_4_19_11_23.wav')
        console.log("Nalagam zvok vožnje po mestu...");
    }
    else {
        console.log ("nisem uspel nalozit sounda")
    }
}