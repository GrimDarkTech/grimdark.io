function getStorage()
{
    openTariff(localStorage.getItem('tariff'));

}
        
window.onload = getStorage;

$(".form_tariff_phone").mask("+7(999) 999-9999");

function openTariff(titleTariff)
{
    switch(titleTariff){
        case "basic":
            document.getElementById("title_Basic").style.textTransform = 'uppercase';
            document.getElementById("title_Standart").style.textTransform = 'capitalize';
            document.getElementById("title_Premium").style.textTransform = 'capitalize';
            document.getElementById("tariff_container_Basic").style.display = 'block';
            document.getElementById("tariff_container_Standart").style.display = 'none';
            document.getElementById("tariff_container_Premium").style.display = 'none';
            document.getElementById("form_tariff_title").value = 'basic';
            break;
        case "standart":
            document.getElementById("title_Basic").style.textTransform = 'capitalize';
            document.getElementById("title_Standart").style.textTransform = 'uppercase';
            document.getElementById("title_Premium").style.textTransform = 'capitalize';
            document.getElementById("tariff_container_Basic").style.display = 'none';
            document.getElementById("tariff_container_Standart").style.display = 'block';
            document.getElementById("tariff_container_Premium").style.display = 'none';
            document.getElementById("form_tariff_title").value = 'standart';
            break;
        case "premium":
            document.getElementById("title_Basic").style.textTransform = 'capitalize';
            document.getElementById("title_Standart").style.textTransform = 'capitalize';
            document.getElementById("title_Premium").style.textTransform = 'uppercase';
            document.getElementById("tariff_container_Basic").style.display = 'none';
            document.getElementById("tariff_container_Standart").style.display = 'none';
            document.getElementById("tariff_container_Premium").style.display = 'block';
            document.getElementById("form_tariff_title").value = 'premium';
            break;   
    }
}

number = 1234;

function numberGenerating() {
    number = '';
    for(i = 0; i < 4; i++){
        number += Math.floor(Math.random() * (10));
    }
}

function send(){
    enteredNumber = document.getElementById("form_tariff_number").value;
    if(number != enteredNumber){
        document.getElementById("form_tariff_number").style = 'box-shadow: 0 0 5px 1px rgb(255 207 207);';
        return;
    }
    document.getElementById("form_tariff_number").style = '';

    let form = {
        tariff_title: document.getElementById("form_tariff_title").value,
        purchase_or_subscription: document.getElementById("form_tariff_purchase_or_subscription").value,
        name: document.getElementById("form_tariff_name").value,
        email: document.getElementById("form_tariff_email").value,
        phone: document.getElementById("form_tariff_phone").value,
        comment: document.getElementById("form_tariff_comment").value
    };
      
    let json = JSON.stringify(form);

    document.getElementById("feedback").style.display = 'none';
    if ( location.reload())
        alert("Заявка отправлена");
}

function getFeedback() {
    document.getElementById("feedback").style.display = 'block';
    document.getElementById("feedback").style.animation = "animation_feedback 1s linear both";
    numberGenerating();
    document.getElementById("form_tariff_number_label").textContent = 'Введите число ' + number + ' *';
}
