//set all anchor link to the same class then we can assign property smooth scroll
//then they do what they have to -> go to specified href
document.querySelectorAll('#link-btn').forEach(anchor => {
    console.log("I'm here")
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

