window.addEventListener('load', function () {
    styleColor = localStorage.getItem('style') == undefined ? '#fe043c' : localStorage.getItem('style');
    reserveColor = localStorage.getItem('reserve') == undefined ? "#35CD8C" : localStorage.getItem('reserve');
    opacityColor = localStorage.getItem('opacity') == undefined ? 'rgba(254, 4, 58, 0.7)' : localStorage.getItem('opacity');
    if (styleColor == "#35CD8C") {
        inp.setAttribute('checked', '');
        document.documentElement.style.setProperty("--theme-color", styleColor);
        document.documentElement.style.setProperty("--reserve-color", reserveColor);
        document.documentElement.style.setProperty("--theme-color-opacity", opacityColor);
    }
    else {
        inp.removeAttribute('checked');
        document.documentElement.style.setProperty("--theme-color", styleColor);
        document.documentElement.style.setProperty("--reserve-color", reserveColor);
        document.documentElement.style.setProperty("--theme-color-opacity", opacityColor);
    }
})


const inp = document.querySelector('.switch-input'),
    switcher = document.querySelector('.switcher'),
    switchs = document.querySelector('.switch'),
    drop = document.querySelector('.nav__user-name'),
    header = document.querySelector('.header'),
    table = document.querySelector('.nav__user-dropdown_content'),
    arrow = document.querySelector('.nav__user-name_vector');

drop.addEventListener('click', () => {
    table.classList.toggle('active');
    arrow.classList.toggle('active');
})

inp.addEventListener('change', function () {
    if (inp.checked) {
        document.documentElement.style.setProperty("--theme-color", "#35CD8C");
        document.documentElement.style.setProperty("--reserve-color", "#fe043c");
        document.documentElement.style.setProperty("--theme-color-opacity", "rgba(53, 205, 139, 0.7)");
        switcher.style.backgroundColor = "#fe043c";
        localStorage.setItem('style', '#35CD8C');
        localStorage.setItem('reserve', '#fe043c');
        localStorage.setItem('opacity', 'rgba(53, 205, 139, 0.7)');
    } else {
        document.documentElement.style.setProperty("--theme-color", "#fe043c");
        document.documentElement.style.setProperty("--reserve-color", "#35CD8C");
        document.documentElement.style.setProperty("--theme-color-opacity", "rgba(254, 4, 58, 0.7)");
        switcher.style.backgroundColor = '#35CD8C';
        localStorage.setItem('style', '#fe043c');
        localStorage.setItem('reserve', '#35CD8C');
        localStorage.setItem('opacity', 'rgba(254, 4, 58, 0.7)');
    }

})


const inpTime = document.querySelector('.booking__input-time'),
    inpDate = document.querySelector('.booking__input-date'),
    inpGuests = document.querySelector('.booking__input-guests'),
    viewTime = document.querySelector('.booking__content-time'),
    viewDate = document.querySelector('.booking__content-date'),
    viewGuests = document.querySelector('.booking__content-guests'),
    labelGuests = document.querySelector('.label-guests');


viewTime.innerHTML = checkTime(booking()[1]);
viewDate.innerHTML = booking()[0];
inpTime.addEventListener('change', function () {
    viewTime.innerHTML = checkTime(inpTime.value);
})
inpDate.addEventListener('change', function () {
    viewDate.innerHTML = inpDate.value.split('-').reverse().join('-');
    console.log(inpDate.value.split('-').reverse().join('-'));
})
labelGuests.addEventListener('click', function () {
    inpGuests.style.opacity = '1';
    inpGuests.addEventListener('change', function () {
        let num = inpGuests.value > 100 ? 100 : inpGuests.value;
        num = num < 0 ? 0 : num;
        viewGuests.innerHTML = `${num} People`;

    })
    inpGuests.addEventListener('blur', function () {
        inpGuests.style.opacity = '0';
    })
})


class SLIDER {
    constructor(select) {
        this.slider = document.querySelector(select.el);
        this.sliderLine = this.slider.querySelector('.slider__line');
        this.slides = this.sliderLine.children;
        this.prev = this.slider.querySelector('.slider__prev');
        this.next = this.slider.querySelector('.slider__next');
        this.direct = select.direction.toUpperCase() == 'X' ? 'X' : 'Y';
        this.timeSlide = select.time != undefined ? select.time : 1000;
        this.width = this.slider.clientWidth;
        this.height = this.slider.clientHeight;
        this.stepSize = 'X' === this.direct ? this.width : this.height;
        this.interval = isNaN(select.interval) == true ? 1500 : select.interval;
        this.activeSlide = 0;
        this.downY = null;
        this.downX = null;
        this.diffX = null;
        this.diffY = null;
        this.moveX = null;
        this.moveY = null;
        this.sliderLine.style = ` 
                                position: relative; 
                                height: ${this.height}px; 
                                `

        for (let i = 0; i < this.slides.length; i++) {
            const sl = this.slides[i];
            sl.style = `     position: absolute;    `;
            sl.ondragstart = function () {
                return false;
            };
            if (i != this.activeSlide) {
                sl.style.transform = `translate${this.direct}(${this.stepSize}px)`;
            }
            if (i === this.slides.length - 1) {
                sl.style.transform = `translate${this.direct}(${-this.stepSize}px)`;
            }
            sl.addEventListener('touchstart', (e) => {
                this.downX = e.touches[0].clientX;
                this.downY = e.touches[0].clientY;
                this.touch(); 
            }, false)
            sl.addEventListener('mousedown', (e) => {
                this.downX = e.clientX;
                this.downY = e.clientY;
                this.touch();
            }, false)
            sl.addEventListener('touchmove', (e) => {
                this.moveX = e.touches[0].clientX;
                this.moveY = e.touches[0].clientY; 
                this.swipe()
            }, false)
            sl.addEventListener('mousemove', (e) => {
                this.moveX = e.clientX;
                this.moveY = e.clientY;
                this.swipe() 
            }, false)
            sl.addEventListener('touchend', () => {
                this.endTouch()
            }, false)
            sl.addEventListener('mouseup', () => {
                this.endTouch()
            }, false)
            sl.addEventListener('mouseleave', () => {
                this.endTouch() 
            }, false)
        }



        if (select.autoplay === true) {
            let interval = setInterval(() => {
                this.move(this.next)
            }, this.interval)
            this.slider.addEventListener('mouseenter', () => {
                clearInterval(interval)
            })
            this.slider.addEventListener('touchstart', () => {
                clearInterval(interval)
            })
            this.slider.addEventListener('mouseleave', () => {
                interval = setInterval(() => {
                    this.move(this.next)
                }, this.interval)
            })
            this.slider.addEventListener('touchend', () => {
                interval = setInterval(() => {
                    this.move(this.next)
                }, this.interval)
            })
        }

        this.next.addEventListener('click', () => this.move(this.next))
        this.prev.addEventListener('click', () => this.move(this.prev))
    }

    move(btn) {
        this.next.disabled = true
        this.prev.disabled = true
        setTimeout(() => {
            this.next.disabled = false
            this.prev.disabled = false
        }, this.timeSlide)

        let btnLeftOrRight = btn == this.next ? this.stepSize * -1 : this.stepSize;

        for (let i = 0; i < this.slides.length; i++) {
            const slide = this.slides[i];
            slide.classList.remove('active');
            slide.style.transition = '0ms';
            if (i != this.activeSlide) {
                slide.style.transform = `  translate${this.direct}(${btnLeftOrRight * -1}px) `; 
            }
        }

        this.slides[this.activeSlide].style.transform = `translate${this.direct}(${btnLeftOrRight}px)`;
        this.slides[this.activeSlide].style.transition = this.timeSlide + 'ms';
        this.slides[this.activeSlide].classList.add('active');

        if (btn == this.next) {
            this.activeSlide++
            if (this.activeSlide >= this.slides.length) {
                this.activeSlide = 0;
            }
        } else if (btn == this.prev) {
            this.activeSlide--;
            if (this.activeSlide < 0) {
                this.activeSlide = this.slides.length - 1
            }
        }

        this.slides[this.activeSlide].style.transform = `translate${this.direct}(0)`;
        this.slides[this.activeSlide].style.transition = this.timeSlide + 'ms';
    }
    touch() { 
     
        for (let i = 0; i < this.slides.length; i++) {
            const slide = this.slides[i];
            slide.classList.remove('active')
            slide.style.transition = '0ms';
            if (i != this.activeSlide) {
                slide.style.transform = `translate${this.direct}(${this.stepSize}px)`;
            }
        }
        if (this.activeSlide < this.slides.length - 1 && this.activeSlide > 0) {
            this.slides[this.activeSlide - 1].style.transform = `translate${this.direct}(-${this.stepSize}px)`;
            this.slides[this.activeSlide + 1].style.transform = `translate${this.direct}(${this.stepSize}px)`;
        }
        if (this.activeSlide == 0) {
            this.slides[this.slides.length - 1].style.transform = `translate${this.direct}(-${this.stepSize}px)`;
            this.slides[this.activeSlide + 1].style.transform = `translate${this.direct}(${this.stepSize}px)`;
        }
        if (this.activeSlide == this.slides.length - 1) {
            this.slides[0].style.transform = `translate${this.direct}(${this.stepSize}px)`;
            this.slides[this.activeSlide - 1].style.transform = `translate${this.direct}(-${this.stepSize}px)`;
        }
        this.slides[this.activeSlide].style.transform = `translate${this.direct}(0)`;
    }
    swipe() {
       
        if (!this.downX || !this.downY) {
            return false
        }

        this.diffX = this.moveX - this.downX;
        this.diffY = this.moveY - this.downY;
        if (this.activeSlide < this.slides.length - 1 && this.activeSlide > 0) {
            this.slides[this.activeSlide - 1].style.transform = `translate${this.direct}(${-this.stepSize + this.diffX}px)`;
            this.slides[this.activeSlide + 1].style.transform = `translate${this.direct}(${this.stepSize + this.diffX}px)`;
        }
        if (this.activeSlide == 0) {
            this.slides[this.slides.length - 1].style.transform = `translate${this.direct}(${-this.stepSize + this.diffX}px)`;
            this.slides[this.activeSlide + 1].style.transform = `translate${this.direct}(${this.stepSize + this.diffX}px)`;
        }
        if (this.activeSlide == this.slides.length - 1) {
            this.slides[0].style.transform = `translate${this.direct}(${this.stepSize + this.diffX}px)`;
            this.slides[this.activeSlide - 1].style.transform = `translate${this.direct}(${-this.stepSize + this.diffX}px)`;
        }
        this.slides[this.activeSlide].style.transform = `translate${this.direct}(${this.diffX}px)`;
       
    }
    endTouch() {
        this.next.disabled = true
        this.prev.disabled = true
        setTimeout(() => {
            this.next.disabled = false
            this.prev.disabled = false
        }, this.timeSlide)
        for (let i = 0; i < this.slides.length; i++) {
            const slide = this.slides[i];
            slide.style.transition = this.timeSlide + 'ms';
        }
        if (this.diffX < 0) {
            if (this.activeSlide < this.slides.length - 1 && this.activeSlide > 0) {
                this.slides[this.activeSlide + 1].style.transform = `translate${this.direct}(0)`;
            }
            if (this.activeSlide == 0) {
                this.slides[this.activeSlide + 1].style.transform = `translate${this.direct}(0)`;
            }
            if (this.activeSlide == this.slides.length - 1) {
                this.slides[0].style.transform = `translate${this.direct}(0)`;
            }
            this.slides[this.activeSlide].style.transform = `translate${this.direct}(${-this.stepSize}px)`;
            this.slides[this.activeSlide].style.transition = this.timeSlide + 'ms';
            this.slides[this.activeSlide].classList.add('active');
            this.activeSlide++;
            if (this.activeSlide >= this.slides.length) {
                this.activeSlide = 0;
            }
        } else if (this.diffX > 0) {
            if (this.activeSlide < this.slides.length - 1 && this.activeSlide > 0) {
                this.slides[this.activeSlide - 1].style.transform = `translate${this.direct}(0)`;
            }
            if (this.activeSlide == 0) {
                this.slides[this.slides.length - 1].style.transform = `translate${this.direct}(0)`;
            }
            if (this.activeSlide == this.slides.length - 1) {
                this.slides[this.activeSlide - 1].style.transform = `translate${this.direct}(0)`;
            }
            this.slides[this.activeSlide].style.transform = `translate${this.direct}(${this.stepSize}px)`;
            this.slides[this.activeSlide].style.transition = this.timeSlide + 'ms';
            this.slides[this.activeSlide].classList.add('active');
            this.activeSlide--;
            if (this.activeSlide < 0) {
                this.activeSlide = this.slides.length - 1
            }
        }

        this.downY = null;
        this.downX = null;
        this.diffX = null;
        this.diffY = null;
        this.moveX = null;
        this.moveY = null;
    }

}

const slider = new SLIDER({
    el: '.slider',
    autoplay: true,
    direction: 'X',
    time: 1000,
    interval: 2000,
})

const burgerBtn = document.querySelector('.nav__burger-menu'),
    boxBar = document.querySelector('.header__side-bar'),
    sideBar = document.querySelector('.side-bar__content'),
    closeSB = document.querySelector('.side-bar__close'),
    nav = document.querySelector('.nav'),
    head = document.querySelector('.header'),
    logo = document.querySelector('.nav__logo'),
    btnUp = document.querySelector('.btn__up');
burgerBtn.addEventListener('click', () => {
    boxBar.style.display = 'flex';
    burgerBtn.style.display = 'none';
    setTimeout(() => { sideBar.style.transform = 'translateX(0)'; }, 100);
})
closeSB.addEventListener('click', () => {
    setTimeout(() => { boxBar.style.display = 'none'; }, 500);
    sideBar.style.transform = 'translateX(100%)';
    burgerBtn.style.display = 'inline-block';
    table.classList.remove('active');
    arrow.classList.remove('active');
})
boxBar.addEventListener('click', (e) => {
    if (window.innerWidth < 1196) {
        if (e.target == boxBar) {
            sideBar.style.transform = 'translateX(100%)';
            burgerBtn.style.display = 'inline-block';
            table.classList.remove('active');
            arrow.classList.remove('active');
            setTimeout(() => { boxBar.style.display = 'none'; }, 500);
        }
    }
})
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1196) {
        boxBar.style.display = 'flex';
        table.classList.remove('active');
        arrow.classList.remove('active');
        burgerBtn.style.display = 'none';
        sideBar.style.transform = 'translateX(0)'
        head.style.paddingTop = `21px`;
        nav.style = `position:static;`
        logo.style.color = 'var(--theme-color)';
    } else {
        boxBar.style.display = 'none';
        table.classList.remove('active');
        arrow.classList.remove('active');
        burgerBtn.style.display = 'inline-block';
        sideBar.style.transform = 'translateX(100%)'
        
    }
})

  

window.addEventListener('scroll', () => {
     
    if (pageYOffset > head.clientHeight) {  
        btnUp.style.display = 'flex';
    } else {
        btnUp.style.display = 'none';
    }
    if (window.innerWidth < 1196) {
        if (pageYOffset > 21) {
            nav.style = `
                         position:fixed;
                         top: 0;
                         left: 0;
                         width: 100%;
                         z-index:30;
                         background: var(--theme-color-opacity); `;
            logo.style.color = 'var(--white)';
            head.style.paddingTop = `${nav.clientHeight}px`
        }
        else {
            nav.style = `position:static;`;
            head.style.paddingTop = `21px`;
            logo.style.color = 'var(--theme-color)';
        }
    }
    else if (window.innerWidth >= 1196){
        head.style.paddingTop = `21px`;
        nav.style = `position:static;`
        logo.style.color = 'var(--theme-color)';
    }

    
})

 
const viewImg = document.querySelector('.picture__view-img'),
    viewDisplay = document.querySelector('.picture__view'),
    viewContent = document.querySelector('.picture__view-content'),
    productImg = document.querySelectorAll('.products__content-img img'),
    foodImg = document.querySelectorAll('.food-item__card-img'),
    body = document.querySelector('body');


foodImg.forEach(e => {
    e.addEventListener('dblclick', () => {
        viewImg.setAttribute('src', e.getAttribute('src'));
        viewDisplay.style.display = 'flex';
        body.style.overflowY = 'hidden';

    })
})
productImg.forEach(el => {
    el.addEventListener('dblclick', () => {
        viewImg.setAttribute('src', el.getAttribute('src'));
        viewDisplay.style.display = 'flex';
        body.style.overflowY = 'hidden'; 
    })
})

viewDisplay.addEventListener('click', function (e) {
    if (e.target == viewDisplay) {
        body.style.overflowY = 'visible';
        viewDisplay.style.display = 'none';
    }
})

function booking() {
    let date = new Date();
    let arr = [];
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
        month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1,
        hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
        minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    arr[0] = `${day}-${month}-${date.getFullYear()}`;
    arr[1] = `${hour}:${minute}`;
    return arr
}

function checkTime(checkTime) {
    checkTime = checkTime.split(':');
    if (checkTime[0] >= 12) {
        checkTime[0] = String(checkTime[0] - 12) == 0 ? checkTime[0] : checkTime[0] - 12;
        let result = `${checkTime.join(':')} pm`;
        return result;
    } else {
        checkTime[0] = checkTime[0] == 0 ? 12 : checkTime[0];
        let result = `${checkTime.join(':')} am`;
        return result;
    }
}

