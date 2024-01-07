// Ophalen van de nodige velden
const checkForm = document.querySelector("#btnCheck");
const voornaamVeld = document.querySelector("#voornaam");
const naamVeld = document.querySelector("#naam");
const gebruikersnaamVeld = document.querySelector("#gebruikersnaam");
const adresVeld = document.querySelector("#adres");
const landVeld = document.querySelector("#land");
const provincieVeld = document.querySelector("#provincie");
const emailVeld = document.querySelector("#email");
const wachtwoordVeld = document.querySelector("#wachtwoord");
const wachtwoordHerhalingVeld = document.querySelector("#wachtwoordHerhaling");
const postcodeVeld = document.querySelector("#postcode");
const algemeneVoorwaardenVeld = document.querySelector("#voorwaardenCheck");
const alertSucces = document.querySelector("#success");
const alertError = document.querySelector("#errors");
const alertInfo = document.querySelector("#info");
// We gaan errors bijhouden doorheen de validatie. We beginnen met een lege errors.
let errors = [];

hideAlerts();

function validateForm() {
  //We starten eerst met de alerts terug te verbergen als ze er nog stonden en maken de array 'errors' en alertError terug leeg
  hideAlerts();
  alertError.innerHTML = "";
  errors = [];

  //We kijken de velden VOORNAAM, NAAM, GEBRUIKERSNAAM, ADRES, LAND, PROVINCIE na of ze niet leeg zijn.
  //Dit kan efficient met een forEach --> nadeel is wel dat de volgorde van de errors dan niet logisch staat...
  // let legeVeldenArray = [voornaamVeld, naamVeld, gebruikersnaamVeld, adresVeld, landVeld, provincieVeld];
  // legeVeldenArray.forEach((veld) => {
  //   let bericht = messageCreation(veld);
  //   checkEmptyField(veld, bericht);
  // });

  //Om de opgave te volgen: om de errors in een logische volgorde te laten nakijken dan moeten we de functies werkeljik in de juiste volgorde oproepen
  // nakijken VOORNAAM
  let bericht = messageCreation(voornaamVeld);
  checkEmptyField(voornaamVeld, bericht);

  // nakijken NAAM
  bericht = messageCreation(naamVeld);
  checkEmptyField(naamVeld, bericht);

  // nakijken GEBRUIKERSNAAM
  bericht = messageCreation(gebruikersnaamVeld);
  checkEmptyField(gebruikersnaamVeld, bericht);

  //nakijken emailadres
  bericht = messageCreation(emailVeld);
  checkEmptyField(emailVeld, bericht);
  let emailvaliditeit = validateEmail(emailVeld.value);
  // functie geeft true als email adres correcte formaat is en false als het niet correct is.
  //  als niet correct voegen we de error toe.
  // dit deel kan ook in de funcite validateEmail maar omdat de opdracht werkt met boolean return gebruik het hier
  if (emailvaliditeit == false && !errors.includes("Het veld email is vereist.")) {
    bericht = "E-mailadres is niet correct";
    errors.push(bericht);
  }

  //nakijken wachtwoorden
  validatePassword(wachtwoordVeld);
  validatePassword(wachtwoordHerhalingVeld);

  // nakijken ADRES
  bericht = messageCreation(adresVeld);
  checkEmptyField(adresVeld, bericht);

  // nakijken LAND
  bericht = messageCreation(landVeld);
  checkEmptyField(landVeld, bericht);

  // nakijken PROVINCIE
  bericht = messageCreation(provincieVeld);
  checkEmptyField(provincieVeld, bericht);

  //nakijken postcode
  checkPC(postcodeVeld);

  //Nakijken Algemenevoorwaarden
  checkAlgemeneVoorwaarden(algemeneVoorwaardenVeld);

  //Nakijken Betaling
  validatePayment(alertInfo);

  //Weergeven van de errors indien die er zijn
  showErrors(errors);
}

function messageCreation(veld) {
  let message = "";
  message = "Het veld " + veld.id + " is vereist.";
  return message;
}

function checkEmptyField(veld, melding) {
  let leegte = false;
  if (veld.type == "text" || veld.type == "email" || veld.type == "number") {
    //het is een input type
    if (veld.value == "") {
      errors.push(melding);
      leegte = true;
    }
  } else {
    if (veld.options[veld.selectedIndex].text == "Kies een land" || veld.options[veld.selectedIndex].text == "Kies een provincie") {
      errors.push(melding);
      leegte = true;
    }
  }
  return leegte;
}

function validatePassword(password) {
  //Error bericht maken naargelang welk wachtwoord vakje niet is ingevuld
  if (password.value == "") {
    if (password.id == "wachtwoord") {
      errors.push("Het veld wachtwoord is vereist.");
    } else {
      errors.push("Het veld herhaal wachtwoord is vereist.");
    }
  } else {
    //Error bericht maken indien wachtwoord te kort is
    if (password.value.length < 7 && !errors.includes("Je wachtwoord is te kort.")) {
      if (password.id == "wachtwoord") {
        errors.push("Je wachtwoord is te kort.");
        //VRAAG NIELS: niet duidelijk of de error wachtwoord te kort ook moet gegeven worden indien het herhalingswachtwoord te kort is...
      }
    }
    //Error bericht indien wachtwoorden niet gelijk
    if (wachtwoordVeld.value != wachtwoordHerhalingVeld.value && !errors.includes("Je wachtwoorden komen niet overeen.")) {
      errors.push("Je wachtwoorden komen niet overeen.");
    }
  }
}

function validateEmail(emailadres) {
  //VRAAG NIELS: de validiteit van het email adres in de opgave is niet altijd duidelijk en lijkt me te beperkt te zijn...
  //Onduidelijkheid 1: mat gebruikersnaam beginnen met _? Lijkt volgens opgave van wel, persoonlijk denk ik van niet...
  //Mijn regex laat _ niet toe als eerste karakter
  //Onduidelijkheid 2: gebruikersnaam zou eigenlijk maar 1x een . of _ of - mogen bevatten, maar in opgave staat "underscoreS"?
  //Mijn regex laat nu dus meerder . of _ of - toe in de gebruikersnaam
  //Onduideljkheid 3: domein naam mag een punt, voor mij MOET een email adres een . hebben. Mijn regex eist dit dan ook, en maximaal 1
  //Onduidelijkheid 4: Volgens mij mag een emailadres niet meerdere speciale karakters achtereen hebben zoals --- dit wordt nu niet in de regex voor gecorrigeerd.
  //Uit de opdracht lijkt het namelijk wel zo ook te mogen....
  let ingevuld = true;
  let resultaat = String(emailadres)
    .toLowerCase()
    .match(/^[a-zA-Z0-9]+[a-zA-Z0-9.\-\_]*@[a-zA-Z0-9]{1}[a-zA-Z0-9-]+[.][a-zA-Z0-9-]+/);
  //als er geen match is is het niet correct
  if (resultaat == null) {
    //niet correct
    ingevuld = false;
  }
  return ingevuld;
}

function validatePayment(veld) {
  //Oproepen van de verschillende opties
  let bankingApp = document.querySelector("#flexRadioBankingApp");
  let overschrijving = document.querySelector("#flexRadioOverschrijving");
  let visa = document.querySelector("#flexRadioVisa");
  let paypal = document.querySelector("#flexRadioPaypal");
  //Nakeijken dat er een optie is aangeduid
  //VRAAG NIELS: Onduidelijk uit oefening of dit vakje MOET ingevuld zijn en dus ook een error moet geven als niet ingevuld...
  if (!bankingApp.checked && !overschrijving.checked && !visa.checked && !paypal.checked) {
    let bericht = "Je hebt geen betalingswijze aangeduid.";
    errors.push(bericht);
  } else {
    //Indien een optie is aangeduid.
    //Invullen van de info alert met de keuze.
    let bericht = "<h4>Betalingswijze</h4><p>Je betalingswijze is";
    if (bankingApp.checked) {
      bericht += " Banking app";
    }
    if (overschrijving.checked) {
      bericht += " Overschrijving";
    }
    if (visa.checked) {
      bericht += " Visa card";
    }
    if (paypal.checked) {
      bericht += " Paypal";
    }
    bericht += "</p>";
    //blauwe vakje mag niet samen met rode vak, enkel blauw weergeven indien er geen errors zijn
    if (errors.length == 0) {
      veld.innerHTML = bericht;
      alertInfo.classList.remove("d-none");
    }
  }
}

function checkPC(veld) {
  let bericht = messageCreation(veld);
  let leegte = checkEmptyField(veld, bericht);
  if (!leegte && (veld.value < 1000) | (veld.value > 9999)) {
    message = "De waarde van de postcode moet tussen 1000 en 9999 liggen";
    errors.push(message);
  }
}

function checkAlgemeneVoorwaarden(veld) {
  if (!algemeneVoorwaardenVeld.checked) {
    bericht = "Je hebt de algemene voorwaarden niet aangeduid.";
    errors.push(bericht);
  }
}

function hideAlerts() {
  alertSucces.classList.add("d-none");
  alertError.classList.add("d-none");
  alertInfo.classList.add("d-none");
}

function showErrors(errors) {
  alertError.innerHTML = "<h4>Yikes, errors...</h4>";
  if (errors.length > 0) {
    errors.forEach((element) => {
      alertError.innerHTML += "<p> " + element;
    });
    alertError.classList.remove("d-none");
  } else {
    alertSucces.classList.remove("d-none");
    alertInfo.classList.remove("d-none");
  }
  alertError.innerHTML += "</p>";
}

checkForm.addEventListener("click", validateForm);
