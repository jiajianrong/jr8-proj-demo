define('libs/common.fileupload', function(require, exports, module) {
    //'use strict';
    var $ = require('zepto');
    require('libs/zepto.info');

    require('libs/photoCompress/detect');
    require('libs/photoCompress/jpegEncode2');
    require('libs/photoCompress/jpegmeta');
    require('libs/photoCompress/photocompress');

    var fileUpLoad = {

        MAX_FILESIZE: 5,

        FILE_PARAMS: {
            maxW: 1024,
            maxH: 10000,
            quality: 0.5,
            format: 'image/jpeg'
        },

        DELETE_URL: '/market/customer/loan/upload/delete',


        UPLOAD_URL: '/market/customer/loan/upload',

        loadingImg: __uri('/static/img/loading.gif'),

        tmplFun: __inline('./common.fileupload.tmpl'),

        fileUpLoadView: function(id, title, maxuploadnum, datarequire, imgarray) {
            var maindiv,
                input,
                label;
            if (id) {
                if (datarequire == true || datarequire == "true")
                    maindiv = $("<div class = 'm-list no-brd' data-require = 'true' data-state = '0'></div>");
                else
                    maindiv = $("<div class = 'm-list no-brd' data-require = 'false' data-state = '0'></div>");
                if (title)
                    maindiv.append("<div class = 'title'>" + title + "</div>");
                if (maxuploadnum && Number(maxuploadnum))
                    input = $("<input type = 'file' accept = 'image/*' name = " + id + " id = " + id + " data-maxuploadnum = " + Number(maxuploadnum) + ">");
                else
                    input = $("<input type = 'file' accept = 'image/*' name = " + id + " id = " + id + ">");
                label = $("<label class = 'm-item' for = " + id + "></label>");

                maindiv.append(input);
                maindiv.append(label);

                if (imgarray) {
                    //有默认文件
                    var len = imgarray.length;
                    divitem_count = len > (maxuploadnum || 0) ? (maxuploadnum || 0) : len;
                    for (var i = 0; i < divitem_count; i++)
                        maindiv.append($("<div class = 'm-item' style = 'background-image:url(" + imgarray[i] + ")' data-src = '" + imgarray[i] + "'></div>"));
                }
            }
            return maindiv ? maindiv : $("<div style = 'height:20px'>请输入正确的参数</div>");
        },

        selectFile: function(widget, userparams, uploadurl, maxfilesize, fileparams) {

            var _widget = $(widget),
                file = widget.files[0],
                PhotoCompress,
                currentNum,
                filesize = Number(maxfilesize) || fileUpLoad.MAX_FILESIZE,
                fileparams = fileparams || fileUpLoad.FILE_PARAMS,
                uploadurl = uploadurl || fileUpLoad.UPLOAD_URL;

            if (!file) return;

            if (file.size > filesize * 1024 * 1024) {
                $.info('图片大小不超过' + filesize + 'M');
                widget.value = '';
                return;
            }

            currentNum = _widget.closest('div.m-list').find('div.m-item').length;

            if (this.MAXUPLOADNUM && currentNum >= this.MAXUPLOADNUM) {
                $.info('上传张数已达上限(' + this.MAXUPLOADNUM + '张照)');
                widget.value = '';
                return;
            }

            this.openProgress(widget);
            // 开始压缩
            PhotoCompress = window.lib.photocompress;

            PhotoCompress.compressFile(file, fileparams, function(err, data) {
                if (err) {
                    if (err.error == PhotoCompress.ERROR.LIMIT_LARGE) {
                        $.info('所选图片尺寸过大，请换一张照片试试!');
                    } else if (err.error == PhotoCompress.ERROR.LIMIT_SMALL) {
                        $.info('加载出错，请换一张图片!');
                    } else if (err.error == PhotoCompress.ERROR.LOAD_ERROR) {
                        fileUpLoad.closeProgress(widget);
                        $.info('加载出错，请换一张图片!');
                    }
                    return;
                }
                // 开始上传
                fileUpLoad.uploadFile(widget, data.base64, userparams, uploadurl);
            });

            // 清空，防止重新选择时查看使用缩略图
            widget.value = '';

        },

        uploadFile: function(widget, src, userparams, uploadurl) {
            var params = {},
                _widget = $(widget),
                divlist = _widget.closest('div.m-list'),
                imglen = divlist.find('div.m-item').length,
                maxuploadnum = divlist.find('input[type="file"]').data('maxuploadnum');

            if (userparams && userparams.userId) { // && (typeof(maxuploadnumv) == undefined || imglen < Number(maxuploadnum))) {
                params[_widget.attr('id')] = src;
                params["userId"] = userparams.userId;
                $.ajax({
                    url: uploadurl || this.UPLOAD_URL,
                    data: params,
                    type: 'post',
                    dataType: 'json'
                }).done(function(data) {
                    if (data && data.ret == 0) {
                        divlist.append($('<div>').addClass('m-item').data('src', data.src)
                            .css('background-image', 'url(' + src + ')'));
                    } else {
                        $.info('上传失败，请重新上传！');
                    }
                    fileUpLoad.closeProgress(widget);
                }).fail(function() {
                    // 关闭进度
                    fileUpLoad.closeProgress(widget);
                    $.info('请求失败，请重新上传！');
                });
            } else {
                throw ("用户参数配置不正确");
            }
        },

        doDelete: function(widget, ev, userparams, deleteurl) {

            var _widget = $(widget),
                params = {},
                divlist = _widget.closest('div.m-list'),
                src = _widget.data('src');
            if (userparams && userparams.userId) {
                params[divlist.find('input[type=file]').attr('name')] = src;
                params["userId"] = userparams.userId;
                $.ajax({
                        url: deleteurl || this.DELETE_URL,
                        data: params,
                        type: 'post',
                        dataType: 'json'
                    }).done(function(data) {
                        if (data && data.ret == 0) {
                            $.info('删除成功！');
                            fileUpLoad.removeMaskDialog(widget);
                            _widget.remove();
                        } else {
                            $.info('删除失败，请重新操作！');
                        }
                    })
                    .fail(function() {
                        $.info('请求失败，请重新操作！');
                    });
            } else
                throw ('用户参数配置不正确');
        },

        doReview: function(widget, ev, imgsrc, userparams, deleteurl) {
            var dlgtmpl = $(this.tmplFun({
                    imgsrc: imgsrc || $(widget).data('src')
                })),
                dlgmask = $('<div/>', {
                    class: "ui-mask"
                }), //$('<div class="ui-mask"></div>'),
                dlgbtns = $('<div/>', {
                    class: "ui-dialog-btn-delete",
                    text: "删除"
                }), //$('<div class="ui-dialog-btn-delete">删除</div>'),
                state = $(widget).closest('div.m-list').data('state'),
                promptform;
            dlgtmpl.css('min-height', $(window).height());
            widget.dlgmask = dlgmask;
            widget.dlgtmpl = dlgtmpl;
            widget.dlgbtns = dlgbtns;
            promptform = $('body')
                .append(dlgmask)
                .append(dlgtmpl);

            //根据状态判断渲染按钮
            if (Number(state) === 0) {
                promptform.append(dlgbtns);
                dlgbtns.on('click', function(ev) {
                    fileUpLoad.doDelete(widget, ev, userparams, deleteurl);
                });
            }

            /*$('body').children().on('click', function(){
            })

            $('body').on('click', '.ui-mask, .ui-dialog', function(){
                fileUpLoad.removeMaskDialog(widget);
            })*/

            $('.ui-mask, .ui-dialog').on('click', function() {
                fileUpLoad.removeMaskDialog(widget);
            });

        },

        openProgress: function(widget) {
            //打开进度条
            $('label[for=' + widget.id + ']').append('<div class="label-mask"><img src="' + fileUpLoad.loadingImg + '" class="loading"></div>');
        },

        closeProgress: function(widget) {
            //关闭进度条
            $('label[for=' + widget.id + ']').find('.label-mask').remove();
        },

        removeMaskDialog: function(widget) {
            widget.dlgmask.off().remove();
            widget.dlgtmpl.off().remove();
            widget.dlgbtns.off().remove();

        },

        setState: function(state) {
            $(this).find('div.m-list').data('state', state);
        }
    }
    module.exports = fileUpLoad;
});