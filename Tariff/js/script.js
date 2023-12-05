function getStorage()
{
    openTariff(localStorage.getItem('tariff'));

}
        
window.onload = getStorage;

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
            break;
        case "standart":
            document.getElementById("title_Basic").style.textTransform = 'capitalize';
            document.getElementById("title_Standart").style.textTransform = 'uppercase';
            document.getElementById("title_Premium").style.textTransform = 'capitalize';
            document.getElementById("tariff_container_Basic").style.display = 'none';
            document.getElementById("tariff_container_Standart").style.display = 'block';
            document.getElementById("tariff_container_Premium").style.display = 'none';
            break;
        case "premium":
            document.getElementById("title_Basic").style.textTransform = 'capitalize';
            document.getElementById("title_Standart").style.textTransform = 'capitalize';
            document.getElementById("title_Premium").style.textTransform = 'uppercase';
            document.getElementById("tariff_container_Basic").style.display = 'none';
            document.getElementById("tariff_container_Standart").style.display = 'none';
            document.getElementById("tariff_container_Premium").style.display = 'block';
            break;   
    }
}