
const scrollFync = () => {
    const headerLinks = document.querySelectorAll('.header-menu__link');
    const buttons = document.querySelectorAll('.parallax__buttons a');

    let links = [...buttons, ...headerLinks]

    seamless.polyfill();

    links.forEach((element) => {
        element.addEventListener('click', (event) => {
            event.preventDefault();

            const id = element.getAttribute('href').substring(1);
            const section = document.getElementById(id);

            if (section) {
                seamless.scrollIntoView(section, {
                    behavior: "smooth",
                    block: "start",
                    inline: "start",
                });
            }
        })
    })
}
scrollFync();

//smooth loading
setTimeout(function()
{
   document.body.classList.add('body_loading');
}, 200);

//outgoing text
const animItems = document.querySelectorAll('._anim-items');
        
if (animItems.length>0)
{
    window.addEventListener('scroll', animationScroll);
    function animationScroll()
    {
        for (let i = 0; i<animItems.length; i++)
        {
            const animItem = animItems[i];
            const animItemHeight = animItem.offsetHeight;
            const animItemOffset = offset(animItem).top;
            const animStart = 4;

            let animItemPoint = window.innerHeight - animItemHeight/animStart;
            
            if(animItemHeight>window.innerHeight)
            {
                animItemPoint = window.innerHeight - window.innerHeight/animStart;
            }

            if((pageYOffset>animItemOffset-animItemPoint) && pageYOffset < (animItemOffset + animItemHeight))
            {
                animItem.classList.add('_active');
            }
            else
            {
                animItem.classList.remove('_active');
            }
            if(animItemHeight<=pageYOffset)
            {
                animItem.classList.add('_active');
            }

        }
    }

    function offset(el)
    {
        const rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return{top: rect.top + scrollTop, left: rect.left + scrollLeft}
    }
}


const iconMenu = document.querySelector('.menu__menu-burger');
const menuBody = document.querySelector('.header-menu__body');
if (iconMenu) {
    iconMenu.addEventListener("click", function(e){
        document.body.classList.toggle('_lock');
        iconMenu.classList.toggle('_active');
        menuBody.classList.toggle('_active');
    })
}


animationScroll();
