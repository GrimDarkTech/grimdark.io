main_image = 2;
max_image = 10;

function scrollGallery(side)
{
    switch(side){
        case "left":
            if (main_image == 1){
                main_image = max_image;
            }
            else {
                main_image -= 1;
            }
            if(main_image == 1){
                document.getElementById("image1").style.backgroundImage = 'url("images/image'+ max_image +'.png")';
            }
            else {
                document.getElementById("image1").style.backgroundImage = 'url("images/image'+ (main_image - 1) +'.png")';
            }
            document.getElementById("image2").style.backgroundImage = 'url("images/image'+ main_image +'.png")';
            if(main_image == max_image) {
                document.getElementById("image3").style.backgroundImage = 'url("images/image1.png")';
            }
            else {
                document.getElementById("image3").style.backgroundImage = 'url("images/image'+ (main_image + 1) +'.png")';
            }
            break;
        case "right":
            if (main_image == max_image){
                main_image = 1;
            }
            else {
                main_image += 1;
            }
            if(main_image == 1){
                document.getElementById("image1").style.backgroundImage = 'url("images/image'+ max_image +'.png")';
            }
            else {
                document.getElementById("image1").style.backgroundImage = 'url("images/image'+ (main_image - 1) +'.png")';
            }
            document.getElementById("image2").style.backgroundImage = 'url("images/image'+ main_image +'.png")';
            if(main_image == max_image) {
                document.getElementById("image3").style.backgroundImage = 'url("images/image1.png")';
            }
            else {
                document.getElementById("image3").style.backgroundImage = 'url("images/image'+ (main_image + 1) +'.png")';
            }
            break; 
    }
}