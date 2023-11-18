"use strict";

// slide toggle
HTMLElement.prototype.slideToggle = function (duration, callback) {
    if (this.clientHeight === 0) {
        _s(this, duration, callback, true);
    } else {
        _s(this, duration, callback);
    }
};

HTMLElement.prototype.slideUp = function (duration, callback) {
    _s(this, duration, callback);
};

HTMLElement.prototype.slideDown = function (duration, callback) {
    _s(this, duration, callback, true);
};

function _s(el, duration, callback, isDown) {

    if (typeof duration === 'undefined') duration = 400;
    if (typeof isDown === 'undefined') isDown = false;

    el.style.overflow = "hidden";
    if (isDown) el.style.display = "block";

    var elStyles = window.getComputedStyle(el);

    var elHeight = parseFloat(elStyles.getPropertyValue('height'));
    var elPaddingTop = parseFloat(elStyles.getPropertyValue('padding-top'));
    var elPaddingBottom = parseFloat(elStyles.getPropertyValue('padding-bottom'));
    var elMarginTop = parseFloat(elStyles.getPropertyValue('margin-top'));
    var elMarginBottom = parseFloat(elStyles.getPropertyValue('margin-bottom'));

    var stepHeight = elHeight / duration;
    var stepPaddingTop = elPaddingTop / duration;
    var stepPaddingBottom = elPaddingBottom / duration;
    var stepMarginTop = elMarginTop / duration;
    var stepMarginBottom = elMarginBottom / duration;

    var start;

    function step(timestamp) {

        if (start === undefined) start = timestamp;

        var elapsed = timestamp - start;

        if (isDown) {
            el.style.height = (stepHeight * elapsed) + "px";
            el.style.paddingTop = (stepPaddingTop * elapsed) + "px";
            el.style.paddingBottom = (stepPaddingBottom * elapsed) + "px";
            el.style.marginTop = (stepMarginTop * elapsed) + "px";
            el.style.marginBottom = (stepMarginBottom * elapsed) + "px";
        } else {
            el.style.height = elHeight - (stepHeight * elapsed) + "px";
            el.style.paddingTop = elPaddingTop - (stepPaddingTop * elapsed) + "px";
            el.style.paddingBottom = elPaddingBottom - (stepPaddingBottom * elapsed) + "px";
            el.style.marginTop = elMarginTop - (stepMarginTop * elapsed) + "px";
            el.style.marginBottom = elMarginBottom - (stepMarginBottom * elapsed) + "px";
        }

        if (elapsed >= duration) {
            el.style.height = "";
            el.style.paddingTop = "";
            el.style.paddingBottom = "";
            el.style.marginTop = "";
            el.style.marginBottom = "";
            el.style.overflow = "";
            if (!isDown) el.style.display = "none";
            if (typeof callback === 'function') callback();
        } else {
            window.requestAnimationFrame(step);
        }
    }

    window.requestAnimationFrame(step);
}
// slide toggle


document.addEventListener("DOMContentLoaded", () => {


    document.addEventListener("click", (e) => {
        const target = e.target;

        // menu
        if (target.closest('.icon-menu')) {
            getMenu()
        }

        // tabs
        if (target.classList.contains('tab-btn')) {

            let parentTab = target.closest('.tabs');

            let currentIndex = Array.from(parentTab.querySelectorAll('.tab-btn')).indexOf(target);

            let btns = parentTab.querySelectorAll('.tab-btn');
            let tabs = parentTab.querySelectorAll('.tab-content');
            console.log(tabs);

            btns.forEach((btn, index) => {
                btn.classList.remove('active');
            });

            tabs.forEach((tab, index) => {
                tab.classList.remove('active');
            });


            btns[currentIndex].classList.add('active');
            tabs[currentIndex].classList.add('active');
        }

        // modal
        if (target.closest("[data-modal]")) {
            const popupName = target
                .closest("[data-modal]")
                .getAttribute("href")
                .replace("#", "");
            const curentPopup = document.getElementById(popupName);
            popupOpen(curentPopup);
            e.preventDefault();
        }

        if (target.closest("[data-close-modal]") ||
            target.classList.contains("popup")) {
            popupClose(target.closest(".popup"));
            e.preventDefault();
        }

        // notification list

        if (target.closest('.notifications__button') || (!target.closest('.notifications') && document.querySelector('.notifications__button.active'))) {
            document.querySelector('.notifications__button').classList.toggle('active');
            document.querySelector('.notifications__list').classList.toggle('active');
        }

    });


    function getMenu() {
        document.body.classList.toggle('lock');
        document.querySelector('.icon-menu').classList.toggle('active');
        document.querySelector('.header').classList.toggle('active');
        document.querySelector('.header__menu').classList.toggle('open');
    }

    function popupOpen(curentPopup) {
        if (curentPopup) {
            const popupActive = document.querySelector(".popup.open");
            if (popupActive) {
                popupClose(popupActive);
            }
            document.body.classList.add('modal-lock');
            curentPopup.classList.add("open");
        }
    }

    function popupClose(popupActive) {
        popupActive.classList.remove("open");
        document.body.classList.remove('modal-lock');
    }


    // slider
    if (document.querySelector('.popup__slider')) {
        new Swiper('.popup__slider', {
            slidesPerView: 1,
            navigation: {
                nextEl: '.popup__next',
                prevEl: '.popup__prev'
            }
        })
    }

    // custom select
    if (document.querySelectorAll(".dropdown").length > 0) {

        document.querySelectorAll(".dropdown").forEach(function (dropdownWrapper) {
            const dropdownBtn = dropdownWrapper.querySelector(".dropdown__button");
            const dropdownList = dropdownWrapper.querySelector(".dropdown__list");
            const dropdownItems = dropdownList.querySelectorAll(".dropdown__list-item");
            const dropdownInput = dropdownWrapper.querySelector(".dropdown__input");

            dropdownBtn.addEventListener("click", function () {
                dropdownList.classList.toggle("visible");
                this.classList.toggle("active");
            });

            dropdownItems.forEach(function (listItem) {
                listItem.addEventListener("click", function (e) {
                    dropdownItems.forEach(function (el) {
                        el.classList.remove("active");
                    });
                    e.target.classList.add("active");
                    dropdownWrapper.classList.add('selected')
                    dropdownBtn.innerHTML = this.innerHTML;
                    dropdownInput.value = this.dataset.value;
                    dropdownList.classList.remove("visible");
                    dropdownBtn.classList.remove("active");
                });
            });

            document.addEventListener("click", function (e) {
                if (e.target !== dropdownBtn) {
                    dropdownBtn.classList.remove("active");
                    dropdownList.classList.remove("visible");
                }
            });

            document.addEventListener("keydown", function (e) {
                if (e.key === "Tab" || e.key === "Escape") {
                    dropdownBtn.classList.remove("active");
                    dropdownList.classList.remove("visible");
                }
            });
        });
    }


    // SPOLLERS
    const spollersArray = document.querySelectorAll("[data-spollers]");
    if (spollersArray.length > 0) {

        const spollersRegular = Array.from(spollersArray).filter(function (
            item,
            index,
            self
        ) {
            return !item.dataset.spollers.split(",")[0];
        });

        if (spollersRegular.length > 0) {
            initSpollers(spollersRegular);
        }


        const spollersMedia = Array.from(spollersArray).filter(function (
            item,
            index,
            self
        ) {
            return item.dataset.spollers.split(",")[0];
        });


        if (spollersMedia.length > 0) {
            const breakpointsArray = [];
            spollersMedia.forEach((item) => {
                const params = item.dataset.spollers;
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1]
                    ? paramsArray[1].trim()
                    : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            });

            // Получаем уникальные брейкпоинты
            let mediaQueries = breakpointsArray.map(function (item) {
                return (
                    "(" +
                    item.type +
                    "-width: " +
                    item.value +
                    "px)," +
                    item.value +
                    "," +
                    item.type
                );
            });
            mediaQueries = mediaQueries.filter(function (item, index, self) {
                return self.indexOf(item) === index;
            });


            mediaQueries.forEach((breakpoint) => {
                const paramsArray = breakpoint.split(",");
                const mediaBreakpoint = paramsArray[1];
                const mediaType = paramsArray[2];
                const matchMedia = window.matchMedia(paramsArray[0]);


                const spollersArray = breakpointsArray.filter(function (item) {
                    if (
                        item.value === mediaBreakpoint &&
                        item.type === mediaType
                    ) {
                        return true;
                    }
                });

                matchMedia.addListener(function () {
                    initSpollers(spollersArray, matchMedia);
                });
                initSpollers(spollersArray, matchMedia);
            });
        }

        // Инициализация
        function initSpollers(spollersArray, matchMedia = false) {
            spollersArray.forEach((spollersBlock) => {
                spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                if (matchMedia.matches || !matchMedia) {
                    spollersBlock.classList.add("_init");
                    initSpollerBody(spollersBlock);
                    spollersBlock.addEventListener("click", setSpollerAction);
                } else {
                    spollersBlock.classList.remove("_init");
                    initSpollerBody(spollersBlock, false);
                    spollersBlock.removeEventListener("click", setSpollerAction);
                }
            });
        }

        // Работа с контентом
        function initSpollerBody(spollersBlock, hideSpollerBody = true) {
            const spollerTitles =
                spollersBlock.querySelectorAll("[data-spoller]");
            if (spollerTitles.length > 0) {
                spollerTitles.forEach((spollerTitle) => {
                    if (hideSpollerBody) {
                        spollerTitle.removeAttribute("tabindex");
                        if (!spollerTitle.classList.contains("_active")) {
                            spollerTitle.parentNode.nextElementSibling.hidden = true;
                        }
                    } else {
                        spollerTitle.setAttribute("tabindex", "-1");
                        spollerTitle.parentNode.nextElementSibling.hidden = false;
                    }
                });
            }
        }

        function setSpollerAction(e) {
            const el = e.target;
            if (el.hasAttribute("data-spoller") || el.closest("[data-spoller]")) {
                const spollerTitle = el.hasAttribute("data-spoller")
                    ? el
                    : el.closest("[data-spoller]");
                const spollersBlock = spollerTitle.closest("[data-spollers]");
                const oneSpoller = spollersBlock.hasAttribute(
                    "data-one-spoller"
                )
                    ? true
                    : false;
                if (!spollersBlock.querySelectorAll("._slide").length) {
                    if (
                        oneSpoller &&
                        !spollerTitle.classList.contains("_active")
                    ) {
                        hideSpollersBody(spollersBlock);
                    }
                    spollerTitle.classList.toggle("_active");
                    spollerTitle.parentNode.classList.toggle('_active-parent');
                    spollerTitle.style.setProperty('pointer-events', 'none');
                    spollerTitle.parentNode.nextElementSibling.slideToggle(500, () => {
                        spollerTitle.removeAttribute('style');
                    });

                }
                e.preventDefault();
            }
            if (el.hasAttribute("data-close-spoller") || el.closest("[data-close-spoller]")) {
                const spollerBody = el.closest('._active-parent');
                const spollerTitle = spollerBody.querySelector('[data-spoller]');
                spollerTitle.classList.remove("_active");
                spollerBody.classList.remove('_active-parent');
                spollerTitle.parentNode.nextElementSibling.slideUp(500);

            }
        }

        function hideSpollersBody(spollersBlock) {
            const spollerActiveTitle = spollersBlock.querySelector(
                "[data-spoller]._active"
            );
            if (spollerActiveTitle) {
                spollerActiveTitle.classList.remove("_active");
                spollerActiveTitle.parentNode.nextElementSibling.slideUp(500)
            }
        }
    }



    // Tooltips

    let tooltipElem;

    document.onmouseover = function (event) {
        let target = event.target;

        let tooltipHtml = target.dataset.tooltip;
        if (!tooltipHtml) return;

        tooltipElem = document.createElement('div');
        tooltipElem.className = 'tooltip';
        tooltipElem.innerHTML = tooltipHtml;
        document.body.append(tooltipElem);

        let coords = target.getBoundingClientRect();

        let left = coords.left + (target.offsetWidth - tooltipElem.offsetWidth) / 2;
        if (left < 0) left = 0;

        let top = coords.top - tooltipElem.offsetHeight - 5;
        if (top < 0) {
            top = coords.top + target.offsetHeight + 5;
        }

        tooltipElem.style.left = left + 'px';
        tooltipElem.style.top = top + 'px';
    };

    document.onmouseout = function (e) {

        if (tooltipElem) {
            tooltipElem.remove();
            tooltipElem = null;
        }

    };




});

