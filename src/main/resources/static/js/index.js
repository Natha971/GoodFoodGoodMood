function myFunction(x) {
    if (x.matches) { // If media query matches
        $("#divCard").css("flex-direction", "column")
    } else {
        $("#divCard").css("flex-direction", "row")
    }
}

var x = window.matchMedia("(max-width: 700px)")
myFunction(x) // Call listener function at run time
x.addListener(myFunction) // Attach listener function on state changes




// Récupération du cookie
function getCookie(name) {
    let dc = document.cookie;
    let prefix = name + "=";
    let begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    } else {
        begin += 2;
       // let end = document.cookie.indexOf(";", begin);
        //if (end == -1) {
        //    end = dc.length;
       // }
    }
    return decodeURI(dc.substring(begin + prefix.length));
}

function verifCookies() {
    if (getCookie("pseudo") == null) {
        $("#verificationCookies").css("display", "block");
        return false;
    } else {
        return true;
    }
}

let images = ["recette2.jpeg", "recette3.jpeg", "recette1.jpeg"];
let numero = 0;

function image() {
    if (numero < images.length) {
        setTimeout(() => {
            $("#divPrincipal").css("background",
                'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("../images/' + images[numero] + '")');
            $("#divPrincipal").css("backgroundRepeat", "no-repeat");
            $("#divPrincipal").css("backgroundPosition", "center top");
            $("#divPrincipal").css("backgroundSize", "cover");
            numero++;
            image();
        }, 3000)
    } else {
        numero = 0;
        image();
    }
}

image();
// Lorsqu'on clique sur le bouton connexion, faire apparaître le popup
$("#connexionButton").click(() => {
    $("#popupConnexion").css("display", "block")
})

// // Lorsqu'on clique sur le X, ça ferme le popup
$("#closePopupConnexion").click(() => {
    $("#popupConnexion").css("display", "none");
})

// Si l'utilisateur n'a pas de compte on lui propose le formulaire de création de compte
// Donc on cache le popoup connexion et on affiche le popop création de compte
$("#createUser").click(() => {
    $("#connexionCompte").css("display", "none");
    $("#createCompte").css("display", "block");
})

// // Lorsqu'on clique sur le X, ça ferme le popup
$("#closePopupCreationCompte").click(() => {
    $("#createCompte").css("display", "none");
})

// quand on clique sur le bouton créer un compte
$("#boutonCreationCompte").click(() => {
    if (!document.getElementById('passwordCreation').validity.valid) {
        $("#errorPassword").css("display", "block");
    } else if (!document.getElementById('pseudoCreation').validity.valid) {
        $("#errorPseudo").css("display", "block");
    } else if (!document.getElementById('mailCreation').validity.valid) {
        $("#errorMail").css("display", "block");
    } else {
        let utilisateur = {
            pseudo: $("#pseudoCreation").val(),
            mail: $("#mailCreation").val(),
            password: $("#passwordCreation").val(),
            allergie: [],
        }
        console.log(utilisateur)
        $.ajax({
            type: "POST",
            headers: {"Content-Type": "application/json"},
            url: "http://localhost:8080/API/inscription",
            data: JSON.stringify(utilisateur),
            success: function (resultat) {
                console.log("ici success");
                $("#createCompte").css("display", "none");
                $("#allergies").css("display", "block");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("ici error");
                $("#errorCreationCompte").html("Un compte est déjà associé à cet e-mail");
                $("#redirectionConnexion").css("display", "block");
            }
        })
    }
})

$("#forgotPassword").click(() => {
    $("#mdpOublie").css("display", "block");
    $("#connexionCompte").css("display", "none");
})

$("#closePopupMdpOublie").click(() => {
    $("#mdpOublie").css("display", "none");
})

$("#boutonReinitialisation").click(() => {
    let update = [$("#mail").val(),
        $("#passwordUpdate").val()]
    $.ajax({
        type: "PATCH",
        headers: {"Content-Type": "application/json"},
        url: "http://localhost:8080/API/updatePassword",
        data: JSON.stringify(update),
        success: function (resultat) {
            $("#validation").html("Votre mot de passe a bien été modifié");
            $("#validation").css("color", "green");
        },
        error: function (xhr, textStatus) {
            console.log(xhr.status);
            $("#errorMailUpdatePassword").html("Aucun compte à ce nom existe");

        }
    })
})
$("#redirectionConnexion").click(() => {
    $("#createCompte").css("display", "none");
    $("#connexionCompte").css("display", "block");
})

$("#boutonSeConnecter").click(() => {
    let utilisateur = {
        mail: $("#pseudoConnexion").val(),
        password: $("#passwordConnexion").val()
    }
    $.ajax({
        type: "POST",
        headers: {"Content-Type": "application/json"},
        url: "http://localhost:8080/API/connexion",
        data: JSON.stringify(utilisateur),
        success: function (resultat) {
            console.log(getCookie("mail"));
            console.log(getCookie("pseudo"));
            //console.log(getCookie("vi"));
            $("#popupConnexion").css("display", "none");
            $("#dropdown").css("display", "block")
            $("#connexionButton").css("display", "none");
            $("#pseudo").html(getCookie("pseudo"));
            $("#recette").css("display", "block");
            $("#boutonAvis").css("display", "block");
        },
        error: function (xhr, textStatus) {
            console.log(xhr.status);
            if (xhr.status == 400) {
                $("#errorConnexion").html("Le mot de passe est incorrect");
            } else {
                $("#errorConnexion").html("Aucun compte à ce nom existe");
            }

        }
    })
})

$("#deconnexion").click(() => {
    $.get("http://localhost:8080/API/deconnexion", () => {
        $("#dropdown").css("display", "none")
        $("#connexionButton").css("display", "block");
        $("#pseudo").html("");
        $("#pseudoConnexion").val('');
        $("#passwordConnexion").val('');
        $("#recette").css("display", "none");
        $("#boutonAvis").css("display", "none");
        $("#recetteRecherche").css("display", "none");
        $("#appRecipe").css("display", "none");
        document.location.href = "index.html";
    })
})

$("#validerAllergies").click(() => {
    let yourArray = [];
    $("input:checkbox[name=checkbox]:checked").each(function () {
        yourArray.push($(this).val());
    });

    let obj = {};
    obj.allergies = yourArray;
    obj.mail = $("#mailCreation").val();
    console.log(obj);
    $.ajax({
        type: "PATCH",
        headers: {"Content-Type": "application/json"},
        url: "http://localhost:8080/API/saveAllergie",
        data: JSON.stringify(obj),
        success: function (resultat) {
            $("#errorAllergie").html("Votre compte a bien été créé ! ");
            $("#errorAllergie").css("color", "green");
            $("#pseudo").html($("#pseudoCreation").val());
            nbrClick = 0;
            setTimeout(()=>{
                $("#allergies").css("display", "none");
                $("#connexionCompte").css("display", "block");
            },3000)

        },
        error: function (xhr, textStatus) {
            console.log(xhr.status);
            if (xhr.status == 400) {
                $("#errorConnexion").html("Le mot de passe est incorrect");
            } else {
                $("#errorConnexion").html("Aucun compte à ce nom existe");
            }
        }
    })

})

let nbrClick = 0;
$("#aucun").click(()=>{
    nbrClick++
    if(nbrClick%2==0){
        $("#arachide").prop('disabled', false);
        $("#lactose").prop('disabled', false);
        $("#fruit_a_coque").prop('disabled', false);
        $("#crustace").prop('disabled', false);
        $("#moutarde").prop('disabled', false);
        $("#graine_cesame").prop('disabled', false);
        $("#soja").prop('disabled', false);
    }else{
        $("#lactose").prop('checked', false);
        $("#lactose").prop('disabled', true);

        $("#arachide").prop('checked', false);
        $("#arachide").prop('disabled', true);

        $("#fruit_a_coque").prop('disabled', true);
        $("#fruit_a_coque").prop('checked', false);

        $("#crustace").prop('disabled', true);
        $("#crustace").prop('checked', false);

        $("#moutarde").prop('disabled', true);
        $("#moutarde").prop('checked', false);

        $("#graine_cesame").prop('disabled', true);
        $("#graine_cesame").prop('checked', false);

        $("#soja").prop('disabled', true);
        $("#soja").prop('checked', false);
    }
})

$("#closePopupAllergies").click(() => {
    $("#allergies").css("display", "none");
})



function getImageRecette(id, specialite) {
    $.ajax({
        type: "GET",
        url: 'https://api.spoonacular.com/recipes/' + id + '/information?includeNutrition=false&apiKey=' + gestionCookiesAndApiKey,
        success: (data) => {
            console.log(data);
            $("#imageCard" + specialite).attr("src", data.image);
        }
    })
}

function affichageDescription(id, specialite) {
    $.ajax({
        type: "GET",
        url: 'https://api.spoonacular.com/recipes/' + id + '/summary?apiKey=' + gestionCookiesAndApiKey,
        success: (data) => {
            $("#cardDescription" + specialite).html(data['summary']);
            $("#cardDescription" + specialite).css("font-size", "x-small")
            getImageRecette(id, specialite);
        }
    })
}

function getApi(specialite) {
    $.ajax({
        type: "GET",
        url: 'https://api.spoonacular.com/recipes/search?cuisine=' + specialite + '&apiKey=' + gestionCookiesAndApiKey,
        success: (retour) => {
            $("#cardTitle" + specialite).html(retour.results[0].title + " - " + specialite);
            $("#valider" + specialite).attr("href", "affichageRecette.html?source=api&id=" + retour.results[0].id)
            description = affichageDescription(retour.results[0].id, specialite);
        }
    })
}


let cuisine = ["French", "American", "British", "African", "Caribbean", "Mediterranean", "Chinese", "Eastern European",
    "European", "Cajun", "German", "Greek", "Indian", "Irish", "Italian", "Japanese", "Jewish", "Korean",
    "Latin American", "Mexican", "Middle Eastern", "Nordic", "Southern", "Spanish", "Thai",
    "Vietnamese"]

for (let i = 0; i < 6; i++) {
    getApi(cuisine[i]);
}


$("#boutonVersInscription").click(() => {
    $("#verificationCookies").css("display", "none");
    $("#popupConnexion").css("display", "block");
    $("#createCompte").css("display", "block")
})

$("#boutonVersSeConnecter").click(() => {
    $("#verificationCookies").css("display", "none");
    $("#popupConnexion").css("display", "block");
    $("#connexionCompte").css("display", "block")
})

$("#closePopupCookies").click(() => {
    $("#verificationCookies").css("display", "none");
})

// partie lien reseau
let whatsapp = document.querySelector(".whatsapp");
let telegram = document.querySelector(".telegram");
let twitter = document.querySelector(".twitter");

//let pageUrl = location.href;
let pageUrl = "https://github.com/Natha971/GoodFoodGoodMood.git";
// console.log(pageUrl)
let message="Enjoy this awesome recipe application enjoy Good Food Good Mood";
console.log(message);

let whatsappApi='https://wa.me/?text='+pageUrl+" "+message;
let telegramApi="https://t.me/share/url?url="+pageUrl+" "+message;
console.log(telegramApi)
let twitterApi=" https://twitter.com/intent/tweet?text="+pageUrl+" "+message;

whatsapp.addEventListener('click', ()=> {
    // console.log('whatsapp button clicked')
    window.open(url=whatsappApi,target="blank");
})
telegram.addEventListener('click', ()=> {
    // console.log('telegram button clicked')
    window.open(url=telegramApi,target="blank");

})
twitter.addEventListener('click', ()=> {
    // console.log('twitter button clicked')
    window.open(url=twitterApi,target="blank");

})

$("#buttonRecherche").click(()=>{
    location.href = "rechercheRecette.html";
})