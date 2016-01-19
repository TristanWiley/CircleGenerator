$(document).ready(function () {
    drawCircle('green')

    $('.show-color').text("#008000");

    $('#download').on("click", function () {
        var canvas = document.getElementById("circleCanvas"), ctx = canvas.getContext("2d");

        cropImageFromCanvas(ctx, canvas);
    });

    document.getElementById("color").addEventListener("input", function () {
        var bg = $(".color");
        var content= document.getElementById("color");

        bg.css('background-color', content);

        drawCircle(document.getElementById("color").textContent);
    }, false);

});

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

$(".bGround").on('mousemove', function () {

    var bg = $(".color");

    var redVal = $(".red").val();
    var greenVal = $(".green").val();
    var blueVal = $(".blue").val();

    var whatIs = 'rgb(' + redVal + ',' + greenVal + ',' + blueVal + ')';

    bg.css('background-color', whatIs);
    drawCircle(whatIs);

    $('.show-color').text(rgbToHex(redVal, greenVal, blueVal));
    //console.log(whatIs);
});

$(".saveit").click(function (e) {
    self = $(this);
    if (self.find(".woba").length == 0)
        self.prepend("<span class='woba'></span>");

    woba = self.find(".woba");

    woba.removeClass("animate");


    if (!woba.height() && !woba.width()) {

        d = Math.max(self.outerWidth(), self.outerHeight());
        woba.css({height: d, width: d});
    }


    x = e.pageX - self.offset().left - woba.width() / 2;
    y = e.pageY - self.offset().top - woba.height() / 2;


    woba.css({top: y + 'px', left: x + 'px'}).addClass("animate");


})

var clip = new Clipboard('.saveit');

clip.on('success', function (e) {
    $('h2').text('COPIED').delay(1000).queue(function () {
        $('h2').text('COPY').dequeue();
    });
});

function rgbToHex(R, G, B) {
    return "#" + toHex(R) + toHex(G) + toHex(B)
}
function toHex(n) {
    n = parseInt(n, 10);
    if (isNaN(n)) return "00";
    n = Math.max(0, Math.min(n, 255));
    return "0123456789ABCDEF".charAt((n - n % 16) / 16)
        + "0123456789ABCDEF".charAt(n % 16);
}

function drawCircle(color) {
    var canvas = document.getElementById('circleCanvas');
    var context = canvas.getContext('2d');

    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = canvas.width / 4;

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
    context.lineWidth = 35;
    context.strokeStyle = '000000';
    context.stroke();
}

function cropImageFromCanvas(ctx, canvas) {

    var w = canvas.width,
        h = canvas.height,
        pix = {x:[], y:[]},
        imageData = ctx.getImageData(0,0,canvas.width,canvas.height),
        x, y, index;

    for (y = 0; y < h; y++) {
        for (x = 0; x < w; x++) {
            index = (y * w + x) * 4;
            if (imageData.data[index+3] > 0) {

                pix.x.push(x);
                pix.y.push(y);

            }
        }
    }
    pix.x.sort(function(a,b){return a-b});
    pix.y.sort(function(a,b){return a-b});
    var n = pix.x.length-1;

    w = pix.x[n] - pix.x[0];
    h = pix.y[n] - pix.y[0];

    var cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

    canvas.width = w;
    canvas.height = h;
    ctx.putImageData(cut, 0, 0);

    //var image = canvas.toDataURL();
        canvas.toBlob(function (blob) {
            saveAs(blob, "MyCircle.png");
        });
    //var win=window.open(image, '_blank');
    //win.focus();
}
