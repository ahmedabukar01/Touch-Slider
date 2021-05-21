const container = document.querySelector('.container');
const slides = Array.from(document.querySelectorAll('.slider'));

let isDragging = false,
    startPosition = 0,
    currentTranslate = 0,
    prevTranslate = 0,
    animationID = 0,
    currentIndex =0

slides.forEach((slide,index)=>{
    const slideImage = slide.querySelector('img');
    slideImage.addEventListener('dragstart',e=>{
        e.preventDefault();
    });

    // touch events
    slide.addEventListener('touchstart',touchStart(index))
    slide.addEventListener('touchend',touchEnd)
    slide.addEventListener('touchmove',touchMove);
    // mouse events
    slide.addEventListener('mousedown',touchStart(index))
    slide.addEventListener('mouseup',touchEnd)
    slide.addEventListener('mouseleave',touchEnd);
    slide.addEventListener('mousemove',touchMove);

})

window.oncontextmenu = function(event){
    event.preventDefault();
    event.stopPropagation();
}
function touchStart(index){
    return function(event){
        isDragging = true;
        currentIndex = index;
        startPosition = getPositionX(event);
        
        animationID = requestAnimationFrame(animation);

        container.classList.add('grabbing');
        
    }
}
function touchEnd(){
    isDragging = false
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - prevTranslate;
    if(movedBy < -100 && currentIndex < slides.length -1){
        currentIndex +=1;
    }
    if(movedBy > 100 && currentIndex > 0){
        currentIndex -= 1;
    }

    moveByIndex();
    container.classList.remove('grabbing');
}
function touchMove(event){
    if(isDragging){
        const currentPositon = getPositionX(event);
        currentTranslate = prevTranslate + currentPositon - startPosition;

    }

}
function getPositionX(event){
    return event.type.includes('mouse')? event.pageX : event.touches[0].clientX;
}

function animation(){
    if(isDragging){
        setTranslate();
        requestAnimationFrame(animation);
    }
}

function setTranslate(){
    container.style.transform = `translateX(${currentTranslate}px)`;
}

function moveByIndex(){
    currentTranslate = currentIndex * -window.innerWidth;
    prevTranslate = currentTranslate;
    setTranslate();
}