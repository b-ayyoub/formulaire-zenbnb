// Écouteur d'événement pour la soumission du formulaire

document.getElementById("formReserv").addEventListener("submit", function(e) {
    // Empêche le rechargement de la page
    e.preventDefault();

    // ==============================================
    // SECTION 1 : RÉCUPÉRATION DES VALEURS DU FORMULAIRE
    // ==============================================
    
    // Récupère et nettoie les valeurs des champs texte
    const name = document.getElementById("nom").value.trim(); // Supprime les espaces inutiles
    const address = document.getElementById("address").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    
    // Récupère les valeurs des menus déroulants et nombres
    const logement = document.getElementById("logement").value;
    const personne = parseInt(document.getElementById("personne").value.trim(), 10); // Convertit en nombre
    
    // Récupère et convertit les dates
    const depart = new Date(document.getElementById("depart").value);
    const arriver = new Date(document.getElementById("arriver").value);

    // Récupère l'état des cases à cocher (true/false)
    const petitDejeuner = document.getElementById("petitDejeuner").checked;
    const chauffeur = document.getElementById("chauffeur").checked;
    const guide = document.getElementById("guide").checked;
    
    // Récupère la valeur du régime si le champ existe
    const regime = document.getElementById("regime") ? document.getElementById("regime").value : "Non spécifié";

    // ==============================================
    // SECTION 2 : VALIDATION DES DONNÉES
    // ==============================================
    
    // Tableau pour stocker les erreurs
    const errors = [];

    // Expressions régulières pour validation
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/; // Vérifie format email
    const phoneRegex = /^[0-9\s-/]{10,14}$/; // Vérifie format téléphone

    // Vérifications des champs :
    if (name.length < 2 || name.length > 50) 
        errors.push("Prénom invalide (2 à 50 caractères)");
    if (address.length < 5 || address.length > 150) 
        errors.push("Adresse invalide");
    if (logement === "") 
        errors.push("Veuillez choisir un type de logement");
    if (!emailRegex.test(email)) 
        errors.push("Format d'email invalide");
    if (!phoneRegex.test(phone)) 
        errors.push("Format de téléphone invalide");
    if (isNaN(personne) || personne < 1 || personne > 10) 
        errors.push("Nombre de personnes invalide (1-10)");

    // Validation des dates :
    if (isNaN(depart.getTime()) || isNaN(arriver.getTime())) {
        errors.push("Veuillez entrer des dates valides.");
    } else if (depart >= arriver) {
        errors.push("La date de départ doit être après la date d'arrivée.");
    }

    // ==============================================
    // SECTION 3 : GESTION DES OPTIONS DE LOGEMENT
    // ==============================================
    
    // Tableau pour les options sélectionnées
    let optionsLogement = [];

    // Si maison est sélectionnée
    if (logement === "maison") {
        if (document.getElementById("jardin").checked) 
            optionsLogement.push("Jardin"); // Ajoute "Jardin" si coché
        
        if (document.getElementById("piscine").checked) 
            optionsLogement.push("Piscine"); // Ajoute "Piscine" si coché
    } 
    // Si appartement est sélectionné
    else if (logement === "appartement") {
        if (document.getElementById("ascenseur").checked) 
            optionsLogement.push("Ascenseur"); // Ajoute "Ascenseur" si coché
        
        if (document.getElementById("parking").checked) 
            optionsLogement.push("Parking"); // Ajoute "Parking" si coché
    }

    // ==============================================
    // SECTION 4 : AFFICHAGE DU RÉSULTAT
    // ==============================================
    
    // Récupère l'élément où afficher les messages
    const errorBox = document.getElementById("resultat");

    // S'il y a des erreurs
    if (errors.length > 0) {
        // Affiche toutes les erreurs séparées par un saut de ligne
        errorBox.innerHTML = errors.join("<br>");
        errorBox.style.color = "red"; // Texte en rouge pour les erreurs
    } 
    // Si tout est valide
    else {
        // Affiche le résumé de la réservation
        errorBox.innerHTML = `
            <strong>Détails de la réservation :</strong><br>
            <strong>Nom :</strong> ${name}<br>  
            <strong>Adresse :</strong> ${address}<br>
            <strong>Email :</strong> ${email}<br>
            <strong>Téléphone :</strong> ${phone}<br>
            <strong>Type de logement :</strong> ${logement}<br>
            <strong>Options de logement :</strong> ${optionsLogement.join(", ") || "Aucune option"}<br>
            <strong>Nombre de personnes :</strong> ${personne}<br>
            <strong>Date d'arrivée :</strong> ${arriver.toLocaleDateString()}<br>
            <strong>Date de départ :</strong> ${depart.toLocaleDateString()}<br>
            <strong>Régime alimentaire :</strong> ${regime || "Non spécifié"}<br>
        `;
        errorBox.style.color = "green"; // Texte en vert pour le succès

        // Enregistrer les données dans localStorage
        localStorage.setItem("nom", name);
        localStorage.setItem("email", email);
        localStorage.setItem("phone", phone);
        localStorage.setItem("address", address);
    }
});

// ==============================================
// SECTION 5 : AFFICHAGE CONDITIONNEL DES OPTIONS
// ==============================================

// Quand on change le type de logement
document.getElementById("logement").addEventListener("change", function() {
    // Récupère les div des options
    const optionMaison = document.getElementById("optionMaison");
    const optionAppart = document.getElementById("optionAppartement");

    // Cache toutes les options d'abord
    optionMaison.style.display = "none";
    optionAppart.style.display = "none"; 

    // Affiche seulement les options correspondantes
    if (this.value === "maison") {
        optionMaison.style.display = "block"; // Affiche options maison
    }
    else if (this.value === "appartement") {
        optionAppart.style.display = "block"; // Affiche options appartement
    }
});

// ==============================================
// SECTION 6 : AFFICHAGE CONDITIONNEL DU RÉGIME
// ==============================================

// Quand on clique sur "petit-déjeuner"
document.getElementById("petitDejeuner").addEventListener("change", function() {
    // Récupère la section du régime
    const optionRegime = document.getElementById("regimeAlimentaire");

    // Affiche ou cache selon si coché ou non
    if (this.checked) {
        optionRegime.style.display = "block"; // Affiche si coché
    } else {
        optionRegime.style.display = "none"; // Cache si décoché
    }
});

// Au chargement de la page : afficher les données
document.addEventListener("DOMContentLoaded", function() {
    const savedName = localStorage.getItem("nom");
    const savedEmail = localStorage.getItem("email");

    if (savedName && savedEmail) {
        document.getElementById("display-name").textContent = savedName;
        document.getElementById("display-email").textContent = savedEmail;
    } else {
        document.getElementById("saved-data").innerHTML = "";
    }
});

// Bouton de suppression
document.getElementById("delete-storage").addEventListener("click", function() {
    // Supprimer les clés spécifiques
    localStorage.removeItem("nom");
    localStorage.removeItem("email");

    // Mettre à jour l'affichage
    document.getElementById("saved-data").innerHTML = "";

});