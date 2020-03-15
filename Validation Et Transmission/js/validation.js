//Annuler l'envoi du formulaire
function stopScript() {
  event.preventDefault();
  return false;
}

// Reload le style des champs quand la page est charg�e
window.onload = function() {
  let frm = document.forms["frmInscription"]; // R�cup�re les donn�es du formulaire
  frm.onreset = function(event) { // Lorsque le boutton Reset est cliqu�
    this.pseudo.removeAttribute("style"); // Enl�ve tout style ajout� � ces �l�ments
    this.pass.removeAttribute("style");
    this.email.removeAttribute("style");

    let divMessage = document.getElementById("message");
    divMessage.innerHTML = "";

    let rdbttn = document.getElementsByName("sexe");

    for (let i = 0; i < rdbttn.length; i++) {
      if (rdbttn[i].type == "radio") {
        rdbttn[i].checked = false; // D�coche les buttons radios
      }
    }

    let areaMess = document.getElementsByName("signature");
    areaMess.innerHTML = "";
    document.getElementsByName("cv").value = "";
  };

  // Lorsque le boutton "Envoyer" est cliqu�
  frm.onsubmit = function(event) { 
    // R�cup�ration des infos Users
    let pseudoField = this.pseudo;
    let pseudo = pseudoField.value;

    let pwdField = this.pass;
    let pwd = pwdField.value;

    let emailField = this.email;
    let mail = emailField.value;

    let paysField = this.pays;
    let selected = document.getElementById("listePays");
    let selectedText = selected.options[selected.selectedIndex].text;

    // RegExes 
    let regPwd = /^.*(?=.*[A-Z])(?=.*[A-Z])(?=.*[0-9]+)(?=.*[a-z]).*$/;
    let regMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    let chkbox = document.getElementsByName("choix[]");
    let checkedBox = 0;

    // V�rifie la syntaxe du pseudo
    if (pseudo == "" || pseudo.length > 8) {
      // Met le champ en couleur rose
      pseudoField.style.backgroundColor = "pink";

      // Affiche un message d'erreur
      let divMessage = document.getElementById("message");
      divMessage.innerHTML = "Veuillez remplir le champ pseudo!";

      // Place le curseur dans le champ pseudo
      pseudoField.focus();

      // Annule l'envoi du formulaire
      stopScript();
    }

    // V�rifie la syntaxe du mot de passe
    if (pwd == "" || !regPwd.test(pwd)) {
      if (!regPwd.test(pwd)) { // Si le password ne correspond pas au regEx regPwd
        alert(
          "Le mot de passe doit contenir au minimum 6 caract�res dont au moins 1 chiffre et deux majuscules!"
        );
      }

      // Couleur rose + message d'erreur
      pwdField.style.backgroundColor = "pink";
      let divMessage = document.getElementById("message");
      divMessage.innerHTML += " Veuillez remplir le champ Mot de Passe!";

      // Place le curseur dans le champ du mot de passe
      pwdField.focus();

      // Annule l'envoi du formulaire
      stopScript();
    }

    // V�rification de la syntaxe du mail
    if (mail == "" || !regMail.test(mail)) {
      if (!regMail.test(mail)) { // Si l'e-mail ne correspond pas au regEx regMail
        alert("L'email n'est pas valide!");
      }

      // Couleur rose + message d'erreur
      emailField.style.backgroundColor = "pink";
      let divMessage = document.getElementById("message");
      divMessage.innerHTML += " Veuillez remplir le champ Email!";

      // Place le curseur dans le champ de l'e-mail
      emailField.focus();

      // Annule l'envoi du formulaire
      stopScript();
    }

    // Compte combien de checkbox sont coch�es
    for (let i = 0; i < chkbox.length; i++) {
      if (chkbox[i].type == "checkbox" && chkbox[i].checked == true) {
        checkedBox++;
      }
    }
    
    // Alerte si trop de choix coch�s
    if (checkedBox > 2) {
      alert("Maximum 2 offres!");
      stopScript();
    }

    // R�cup�re les pays Europ�ens gr�ce � l'API RESTCountries
    fetch("https://restcountries.eu/rest/v2/regionalbloc/eu")
      .then(function(res) {
        return res.json();
      })
      .then(function(listCountries) {
        let json = JSON.stringify(listCountries);
        if (!json.includes(selectedText)) {
          alert("Le pays doit �tre Europ�en!"); 
          return false;
        }
      });
    };
};
