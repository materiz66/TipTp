const button = document.querySelector('#button');
const svgProgress = document.querySelector('#icon');
const lineOne = document.querySelector('.lineOne');
const lineTwo = document.querySelector('.lineTwo');
const lineThree = document.querySelector('.lineThree');
const buttonPlayPause = document.querySelector('#pp_icon');
const h4Percent = document.querySelector("h4");
const h3Remaining = document.querySelector(".remaining");
const closeButton = document.querySelector(".close");

var root = document.querySelector(':root');
var toggle = false;
var timelineProgress;

button.addEventListener('click', (event) => {
    if (button == event.target) {
        button.classList.add("active");

        anime.timeline({
            duration: 1000,
            easing: "linear"
        })
        .add({
            targets: [lineOne, lineTwo],
            translateY: '-10',
            duration: 250
        })
        .add({
            targets: [lineOne, lineTwo],
            translateY: '40px',
            duration: 250,
        })
        .add({
            targets: lineThree,
            d: [
                {value: "M20,38.5 Q20,38.5 20,38.5"},
                {value: "M20,42 Q20,42 20,42"},
            ],
            delay: 50,
        })
        .add({
            targets: button,
            width: "500px",
            height: "160px",
            easing: "easeInOutQuad",
            duration: 250,
        }, "-=300")
        .add({
            targets: "#container",
            opacity: "1"
        })
    }
});

buttonPlayPause.addEventListener('click', (event) => {
    if (buttonPlayPause == event.target) {
        anime.timeline({
            duration: 100,
            easing: "linear"
        })
        .add({
            targets: ".play",
            strokeDasharray: toggle ? "34px" : "68px"
        })
        .add({
            targets: ".pause",
            strokeDasharray: toggle ? "0" : "18px",
            strokeDashoffset: toggle ? "0" : "18px",
            easing: 'easeInOutQuad'
        })

        if (!toggle) {
            timelineProgress.pause();
            console.log(timelineProgress)
            toggle = true;
            svgProgress.classList.remove("lineUp");
            svgProgress.classList.add("lineDown");
            pathLines()
        } else {
            toggle = false;
            setTimeout(() => {timelineProgress.play()}, 500);
            svgProgress.classList.remove("lineDown");
            svgProgress.classList.add("lineUp");
            pathLines()
        }
    }
});

new ResizeObserver(progressBar).observe(button);

function progressBar() {
    const width = button.offsetWidth;
    var updates = 0;
    var time = 5000;

    if (width == 500) {
        svgProgress.classList.add("progress");

        timelineProgress = anime.timeline({
            duration: time,
            easing: "linear",
            autoplay: true,
            began: true
        });

        timelineProgress.add({
            targets: lineTwo,
            strokeDashoffset: "0px",
            update: function(anim) {
                updates++;
                time = time - 16;
                var secands = Math.round(time / 1000);
                h4Percent.innerHTML = `${Math.round(anim.progress)}%`;
                h3Remaining.innerHTML = `${secands} ${secands <= 1 ? "secand" : "secands"} remaining`;
            },
            complete: function() {
                downloadCompletedOrClosed();
              }
        })
    }
}

function pathLines() {
    var strokeDashoffset = lineTwo.style.strokeDashoffset;
    strokeDashoffset = 500 - parseInt(strokeDashoffset);

    root.style.setProperty('--lineUpPath1', `'M2,38 Q${strokeDashoffset/2},38 ${strokeDashoffset-2},38'`);

    root.style.setProperty('--lineUpPath2', `'M2,20 Q${strokeDashoffset/2},5 ${strokeDashoffset-2},20'`);

    root.style.setProperty('--lineUpPath3', `'M2,20 Q${strokeDashoffset/2},20 ${strokeDashoffset-2},20'`);

    root.style.setProperty('--lineDownPath1', `'M2,20 Q${strokeDashoffset/2},20 ${strokeDashoffset-2},20'`);

    root.style.setProperty('--lineDownPath2', `'M2,20 Q${strokeDashoffset/2},38 ${strokeDashoffset-2},30'`);

    root.style.setProperty('--lineDownPath3', `'M2,30 Q${strokeDashoffset/2},38 ${strokeDashoffset-2},38'`);

    root.style.setProperty('--lineDownPath4', `'M2,38 Q${strokeDashoffset/2},30 ${strokeDashoffset-2},38'`);

    root.style.setProperty('--lineDownPath5', `'M2,38 Q${strokeDashoffset/2},20 ${strokeDashoffset-2},38'`);

    root.style.setProperty('--lineDownPath6', `'M2,38 Q${strokeDashoffset/2},38 ${strokeDashoffset-2},38'`);
}

function downloadCompletedOrClosed() {
    button.classList.remove("active");
    svgProgress.classList.remove("progress");
    lineTwo.style.transform = "translateY(0)";
    lineTwo.style.strokeDashoffset = "500px";
    document.querySelector("#container").style.opacity = "0";
    timelineProgress.pause();
    toggle = false;

    anime.timeline({
        duration: 600,
        easing: "linear"
    })
    .add({
        targets: button,
        width: "120px",
        height: "120px",
        easing: "easeInOutQuad",
        duration: 250,
    }, '-=300')
    .add({
        targets: lineTwo,
        keyframes: [
            {translateY: "8px"}, {translateY: "0"},
            {translateY: "8px"}, {translateY: "0"},
        ],
    })
    .add({
        targets: lineOne,
        translateY: "0",
    }, "-=350")
    .add({
        targets: lineThree,
        d: [
            {value: "M20,38.5 Q20,38.5 20,38.5"},
            {value: "M8,38.5 Q40,38.5 30,38.5"},
        ]
    }, "-=550");
}

closeButton.addEventListener('click', () => {
    downloadCompletedOrClosed();
})