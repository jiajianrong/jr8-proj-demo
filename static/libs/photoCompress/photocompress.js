define("libs/photoCompress/photocompress", function(require, exports, module){




var $ = require('zepto');


(function($, lib) {
    var JpegMeta = lib.jpegmeta;
    var JPEGEncoder = lib.jpegencode2;
    var ERROR = {
        LIMIT_LARGE: 1, 
        LIMIT_SMALL: 2,
        LOAD_ERROR: 3
    };
    

    var ImageCompresser = {isIOSSubSample: function(img) {
            var w = img.naturalWidth;
            var h = img.naturalHeight;
            var hasSubSample = false;
            if (w * h > 1024 * 1024) {
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                canvas.width = canvas.height = 1;
                ctx.drawImage(img, -w + 1, 0);
                hasSubSample = 
                !!(ctx.getImageData(0, 0, 1, 1).data[3] === 0);
                canvas = ctx = null
            }
            return hasSubSample
        },
        getIOSImageRatio: function(img, w, h) {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            canvas.width = 1;
            canvas.height = h;
            ctx.drawImage(img, 0, 0);
            var data = ctx.getImageData(0, 0, 1, h).data;
            var sy = 0;
            var ey = h;
            var py = h;
            while (py > sy) {
                var alpha = data[(py - 1) * 4 + 3];
                if (alpha === 0)
                    ey = py;
                else
                    sy = py;
                py = ey + sy >> 1
            }
            return py / h
        },
        transformCT: function(canvas, width, height, orientation) {
            if (orientation >= 5 && orientation <= 8) {
                canvas.width = height;
                canvas.height = width
            } else {
                canvas.width = width;
                canvas.height = height
            }
            var ctx = canvas.getContext("2d");
            switch (orientation) {
                case 2:
                    ctx.translate(width, 0);
                    ctx.scale(-1, 1);
                    break;
                case 3:
                    ctx.translate(width, height);
                    ctx.rotate(Math.PI);
                    break;
                case 4:
                    ctx.translate(0, height);
                    ctx.scale(1, -1);
                    break;
                case 5:
                    ctx.rotate(0.5 * Math.PI);
                    ctx.scale(1, -1);
                    break;
                case 6:
                    ctx.rotate(0.5 * Math.PI);
                    ctx.translate(0, -height);
                    break;
                case 7:
                    ctx.rotate(0.5 * Math.PI);
                    ctx.translate(width, -height);
                    ctx.scale(-1, 1);
                    break;
                case 8:
                    ctx.rotate(-0.5 * 
                    Math.PI);
                    ctx.translate(-width, 0);
                    break;
                default:
                    break
            }
        },
        acfix: function(natural, max) {
            var naturalWidth = natural.width;
            var naturalHeight = natural.height;
            var maxW = max.width;
            var maxH = max.height;
            var width, height;
            if (naturalWidth > maxW && naturalWidth / naturalHeight >= maxW / maxH) {
                width = maxW;
                height = naturalHeight * maxW / naturalWidth
            } else if (naturalHeight > maxH && naturalHeight / naturalWidth >= maxH / maxW) {
                width = naturalWidth * maxH / naturalHeight;
                height = maxH
            } else {
                width = naturalWidth;
                height = naturalHeight
            }
            return {width: width,height: height}
        },
        getImageBase64: function(img, param, callback) {
            param = $.extend({maxW: 800,maxH: 800,quality: 0.9,orien: 1}, param);
            var naturalW = img.naturalWidth;
            var naturalH = img.naturalHeight;
            if (($.os.iphone || $.os.ipad) && ImageCompresser.isIOSSubSample(img)) {
                naturalW = naturalW / 2;
                naturalH = naturalH / 2
            }
            var maxH = param.maxH, maxW = param.maxW;
            var orienW = naturalW, orienH = naturalH;
            if (param.orien >= 5 && param.orien <= 8) {
                orienW = naturalH;
                orienH = naturalW
            }
            if (orienW > orienH) {
                maxH = maxH + maxW;
                maxW = maxH - maxW;
                maxH = maxH - maxW
            }
            var orienFix = this.acfix({width: orienW,
                height: orienH}, {width: maxW,height: maxH});
            var orienFixW = orienFix.width;
            var orienFixH = orienFix.height;
            var naturalFixW = orienFixW;
            var naturalFixH = orienFixH;
            if (param.orien >= 5 && param.orien <= 8) {
                naturalFixH = orienFixW;
                naturalFixW = orienFixH
            }
            if ($.browser.ie && 0) {
                callback({base64: -1,height: orienFixH,width: orienFixW});
                return
            }
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            this.transformCT(canvas, naturalFixW, naturalFixH, param.orien);
            $(canvas).appendTo(document.body).css({display: "none"});
            if ($.os.iphone || $.os.ipad) {
                var tmpCanvas = document.createElement("canvas");
                var tmpCtx = tmpCanvas.getContext("2d");
                var d = 1024;
                tmpCanvas.width = tmpCanvas.height = d;
                var vertSquashRatio = ImageCompresser.getIOSImageRatio(img, naturalW, naturalH);
                var sy = 0;
                while (sy < naturalH) {
                    if (sy + d > naturalH)
                        var sh = naturalH - sy;
                    else
                        sh = d;
                    var sx = 0;
                    while (sx < naturalW) {
                        if (sx + d > naturalW)
                            var sw = naturalW - sx;
                        else
                            sw = d;
                        tmpCtx.clearRect(0, 0, d, d);
                        tmpCtx.drawImage(img, -sx, -sy);
                        var dx = Math.floor(sx * naturalFixW / naturalW);
                        var dw = Math.ceil(sw * 
                        naturalFixW / naturalW);
                        var dy = Math.floor(sy * naturalFixH / naturalH / vertSquashRatio);
                        var dh = Math.ceil(sh * naturalFixH / naturalH / vertSquashRatio);
                        ctx.drawImage(tmpCanvas, 0, 0, sw, sh, dx, dy, dw, dh);
                        sx += d
                    }
                    sy += d
                }
                tmpCanvas = tmpCtx = null
            } else
                ctx.drawImage(img, 0, 0, naturalW, naturalH, 0, 0, naturalFixW, naturalFixH);
            /*var thumbStr = "";
            if (canvas.width > 200 && canvas.height > 200) {
                var thumb = document.createElement("canvas");
                thumb.width = thumb.height = 70;
                var _ctx = thumb.getContext("2d");
                if (canvas.width > canvas.height)
                    _ctx.drawImage(canvas, 
                    0, 0, canvas.height, canvas.height, 0, 0, 70, 70);
                else
                    _ctx.drawImage(canvas, 0, 0, canvas.width, canvas.width, 0, 0, 70, 70);
                thumbStr = thumb.toDataURL("image/png")
            }*/
            var base64Str;
            if (param.format == "image/jpeg" && $.os.android) {
                var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                var encoder = new JPEGEncoder(param.quality * 100);
                encoder.encode(imgData, param.quality * 100, function(base64) {
                    encoder = null;
                    callback({base64: base64,height: orienFixH,width: orienFixW})
                })
            } else {
                base64Str = canvas.toDataURL(param.format, param.quality);
                callback({base64: base64Str,height: orienFixH,width: orienFixW})
            }
            $(canvas).remove();
            canvas = ctx = null
        }};
    function compressSrc(dataUrl, param, callback) {
        var img = new Image;
        img.onload = function() {

            // 图片宽高小于300， 报错。
            if (this.naturalWidth < 3 || this.naturalHeight < 3) {
                // 图片太小
                callback({
                    error: ERROR.LIMIT_SMALL
                }); 
                return;
            }

            // 图片大于5000 * 5000
            if (this.naturalWidth * this.naturalHeight > 5000 * 5000) {
                // 图片太大
                callback({
                    error: ERROR.LIMIT_LARGE      
                }); 
                return;
            }

            ImageCompresser.getImageBase64(this, param, function(result) {
                
                var data = $.extend({}, {param: param});
                data.dataUrl = dataUrl;
                if (result.base64 == -1) {
                    data.base64 = dataUrl;
                } else {
                    data.base64 = result.base64;
                    data.thumb = result.thumb
                }
                data.width = result.width;
                data.height = result.height;
                data.rawWidth = img.naturalWidth;
                data.rawHeight = img.naturalHeight;
                callback(null, data)
            })
        };
        img.onerror = function() {
            callback({error: ERROR.LOAD_ERROR});
        };
        img.src = dataUrl
    }
    function getImageMeta(file, callback) {
        var r = new FileReader;
        var err = null;
        var meta = null;
        r.onload = function(event) {
            if (file.type === "image/jpeg")
                try {
                    meta = new JpegMeta.JpegFile(event.target.result, file.name)
                } catch (ex) {
                    err = ex
                }
            callback(err, meta)
        };
        r.onerror = function(event) {
            callback(event.target.error, meta)
        };
        r.readAsBinaryString(file)
    }
    function getURLObject() {
        if ($.browser.uc && 
        $.browser.version == "8.4")
            return false;
        return window.URL || window.webkitURL || window.mozURL
    }
    function getImageURL(file, callback) {
        var url = getURLObject();
        if (url)
            callback(null, url.createObjectURL(file));
        else {
            var r = new FileReader;
            r.onload = function(event) {
                callback(null, event.target.result)
            };
            r.onerror = function(event) {
                callback(event.target.error, null)
            };
            r.readAsDataURL(file)
        }
    }
    function compressFile(file, picParam, callback) {
        if (!file)
            return;
        var param = $.extend({format: file.type == "image/png" ? "image/png" : "image/jpeg"}, 
        picParam);
        getImageURL(file, function(err, dataUrl) {
            if (err) {
                callback(new Error("\u62ff\u4e0d\u5230URL"), null);
            } else if (!$.browser.ieMobile) {
                getImageMeta(file, function(err, meta) {
                    if (meta && meta.tiff && meta.tiff.Orientation) {
                        param = $.extend({orien: meta.tiff.Orientation.value,make: meta.tiff.Make && meta.tiff.Make.value,model: meta.tiff.Model && meta.tiff.Model.value,date: meta.tiff.DateTime && meta.tiff.DateTime.value}, param);
                    }
                    compressSrc(dataUrl, param, callback)
                });
            } else {
                compressSrc(dataUrl, param, callback)
            }
        })
    }

    lib.photocompress = {
        getImageData: compressFile,
        compressFile: compressFile,
        compressSrc: compressSrc,
        // 错误类型枚举值
        ERROR: ERROR
    };
})($, window.lib);







});