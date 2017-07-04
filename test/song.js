

var Music = MusicList = Musicfavor = Musicrand = Musiccai = [];
var bid = 0;//当前播放歌曲的i
var did = 0;//播放歌曲的id
var loop = 0;//0循环1单曲2随机
var curlist = 0;//0播放列表1收藏列表2随便听听
var curdance = 0;//0播放列表1收藏列表2随便听听
var count = 0;
var audio;
var lrcTime = [];
var lrcText = [];
var isok = true;
var currmusicid = "";
var pkey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCjpb+UHmzo8I3dtCi4pTRDdrtnt0fl1OK2BsdAwAp2sTIoiuXw1zVtlU/I8G9Fp0JTdNNxDo39vIvRaM6dSvCTI2kmAaikcDQf/LzOvNeoZfcVR9v5rxdyTzb2nwnkR0RG5ApN8MPpAKk26uYopbBGnbDZ8BMTO4o72KTB3xe4BQIDAQAB';
//1 绿色对勾，2 红色叉号 3 黄色问号 4 灰色小锁 5 红色苦脸 6 绿色笑脸 7 黄色叹号 
var X = {
    init: function (sign) {
        if (sign == 'playsong') {
            audio = $('#audio')[0];
            X.get_data(0);
        }
    },
    listen: function (musicid) {
        window.open("../home/playsong@song_id=" + musicid, 'play');
    },
    collection: function (musicid) {
        $.ajax({
            url: "../api/setcollection/@songid=" + musicid,
            dataType: "json",
            success: function (result) {
                if (result.state == "error") {
                    aekun.layer.msg(result.message, { icon: 2 });
                }
                else {
                    aekun.layer.msg(result.message, { icon: 1 });
                    if (result.data == 2) {
                        $("#cid_" + musicid).html("<i class=\"list_menu__icon_no_like\"></i>");
                    }
                    else if (result.data == 1) {
                        $("#cid_" + musicid).html("<i class=\"list_menu__icon_like\"></i>");
                    }
                }
            }
        });
    },
    removecollections: function (obj) {
        $.ajax({
            url: "../api/removecollection/default.htm",
            dataType: "json",
            data: obj,
            success: function (result) {
                if (result.state == "error") {
                    aekun.layer.msg(result.message, { icon: 2 });
                }
                else {
                    aekun.layer.msg(result.message, { icon: 1 });
                }
            }
        });
        setTimeout(function () {
            location.reload();
        }, 300)
    },
    removelisten: function (musicid) {
        $.ajax({
            url: "../api/removelisten/@songid=" + musicid,
            dataType: "json",
            success: function (result) {
                if (result.state == "error") {
                    aekun.layer.msg(result.message, { icon: 2 });
                }
                else {
                    aekun.layer.msg(result.message, { icon: 1 });
                }
            }
        });
        setTimeout(function () {
            location.reload();
        }, 300)
    },
    removelistens: function (obj) {
        $.ajax({
            url: "../api/removelisten/default.htm",
            dataType: "json",
            data: obj,
            success: function (result) {
                if (result.state == "error") {
                    aekun.layer.msg(result.message, { icon: 2 });
                }
                else {
                    aekun.layer.msg(result.message, { icon: 1 });
                }
            }
        });
        setTimeout(function () {
            location.reload();
        }, 300)
    },
    lookUp: function (str, cls, sign, len) {//展开收起
        sign = parseInt(sign) ? 1 : 0;
        len = parseInt(len) ? len : 100;
        sign2 = sign ? 0 : 1;
        if (str == '') return;
        if (sign == 0) {
            $('.' + cls).html(str);
            $('#' + cls).attr('title', '收起');
            $('#' + cls).attr('href', 'javascript:X.lookUp(\'' + str + '\',\'' + cls + '\',' + sign2 + ',' + len + ');');
            $('#' + cls + ' i').html('&#xe619;');
        } else {
            var str2 = str.substring(0, len);
            $('.' + cls).html(str2);
            $('#' + cls).attr('href', 'javascript:X.lookUp(\'' + str + '\',\'' + cls + '\',' + sign2 + ',' + len + ');');
            $('#' + cls).attr('title', '展开');
            $('#' + cls + ' i').html('&#xe61a;');
        }
    },
    strJie: function (str, len) {//截取固定长度
        if (str == '') document.write('暂无相关记录');;
        var strl = str.length;
        if (strl > len) {
            document.write(str.substring(0, len) + '...');
        } else {
            document.write(str);
        }
    },
    set_nice: function (id) {//歌曲赞
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(pkey);
        var obj = new Object();
        obj.songid = id + "";
        var sendData = new Object();
        for (var key in obj) {
            sendData[key] = encrypt.encrypt(obj[key]);
        }
        var url = "../api/setnice/";
        $.ajax({
            url: url,
            type: "post",
            data: sendData,
            async: false,
            dataType: "json",
            success: function (result) {
                if (result.state == "error") {
                    aekun.layer.msg(result.message, { icon: 2 });
                }
                else if (result.state == "warning") {
                    aekun.layer.msg(result.message, { icon: 3 });
                }
                else {
                    aekun.layer.msg(result.message, { icon: 1 });
                }
            }
        });
    },
    show_reply: function (id)
    {
        $.get('../account/reply@id=' + id, function (str) {
            var index = layer.open({
                area: ['50%', '80%'], //自定义文本域宽高
                resize: true,
                type: 1,
                content: str
            });
        });
    },
    song_music: function (songid)
    {
        currmusicid = songid;
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(pkey);
        var obj = new Object();
        obj.songid = songid + "";
        var sendData = new Object();
        for (var key in obj) {
            sendData[key] = encrypt.encrypt(obj[key]);
        }
        var url = "../api/getMusicbyid/";
        $.ajax({
            url: url,
            type: "post",
            data: sendData,
            async: false,
            dataType: "json",
            success: function (result) {
                var sss = '<embed src="../player.swf@soundFile=' + result.data.url + '&amp;playerID=10&amp;bg=0xeeeeee&amp;leftbg=0x1AC300&amp;lefticon=0x666666&amp;rightbg=0x666666&amp;rightbghover=0x1AC300&amp;righticon=0xffffff&amp;righticonhover=0xffffff&amp;text=0x666666&amp;slider=0x666666&amp;track=0xFFFFFF&amp;border=0xcccccc&amp;loader=0x1AC300&amp;loop=yes&amp;initialvolume=100&amp;titles=' + result.data.song_name + '&amp;autostart=yes" type="application/x-shockwave-flash" wmode="transparent" height="60" width="100%">';
                var str = '<audio id="player2" autoplay="autoplay" preload="none" controls style="max-width: 100%"> <source id="audiosongurl" src="' + result.data.url + '" type="audio/mp3"></audio>';
                var playstr = "";
                ///**/
                if (sss.indexOf("ctyunapi") > 0 || sss.indexOf(".wma") > 0) {
                    $(".player").html(str);
                    var player = new MediaElementPlayer('player2', {
                        loop: true,
                        success: function (player, node) {
                            $('.player').css('visibility', 'visible');
                            player.addEventListener('ended', function (e) {
                                X.song_music(songid);
                            });
                            player.addEventListener('canplay', function (e) {
                                var sc = parseInt(player.duration);
                                X.set_duration(songid, sc);
                                console.log(sc);
                            });
                        }
                    });
                }
                else {
                    $(".player").html(sss);
                }
            }
        });
    },
    down_file: function (songid, isok)
    {
        if (isok === 0) {
            $.get('../api/setnice@musicId=' + songid, function (result) {
                if (result.state == "error") {
                    aekun.layer.msg(result.message, { icon: 2 });
                }
                else if (result.state == "warning") {
                    aekun.layer.msg(result.message, { icon: 3 });
                }
                else {
                    aekun.layer.msg(result.message, { icon: 1 });
                }
            }, 'json');
        }
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(pkey);
        var obj = new Object();
        obj.songid = songid + "";
        var sendData = new Object();
        for (var key in obj) {
            sendData[key] = encrypt.encrypt(obj[key]);
        }
        var url = "../api/downMusicbyid/";
        $.ajax({
            url: url,
            type: "post",
            data: sendData,
            beforeSend: function () {
                imageLayer = layer.msg('正在获取下载地址，请稍等...', {
                    icon: 16,
                    shade: 0.3,
                    skin: "layui-layer-molv",
                    time: 0
                });
            },
            dataType: "json",
            success: function (result) {
                layer.close(imageLayer);
                if (result.state == "error") {
                    aekun.layer.msg(result.message, { icon: 2 });
                } else {
                    var timestamp = new Date().getTime();
                    $("body").append("<a href='" + result.data + "' download='temp' id='down" + "_" + timestamp + "' style='display:none;'>download</a>");
                    var name = "down" + "_" + timestamp;
                    if (document.all) {
                        document.getElementById(name).click();
                    }
                    else {
                        var evt = document.createEvent("MouseEvents");
                        evt.initEvent("click", true, true);
                        document.getElementById(name).dispatchEvent(evt);
                    }
                }
            }
        });
    },
    down: function (songid) {
        layer.open({
            type: 1
            , title: false //不显示标题栏
            , closeBtn: false
            , area: '300px;'
            , shade: 0.8
            , id: 'LAY_layuipro' //设定一个id，防止重复弹出
            , btn: ['火速好听', '残忍拒绝']
            , moveType: 1 //拖拽模式，0或者1
            , content: '<div style="padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">你知道吗？亲！<br><br>淘歌路遥、难觅挚爱！<br><br>唾手可得、不忘感恩！<br><br>轻点好听（<i class="fa fa-thumbs-o-up"></i>），素质拿歌！<br><br>让音乐倾听彼此！</div>'
            , success: function (layero) {
                var btn = layero.find('.layui-layer-btn');
                btn.css('text-align', 'center');
                btn.find('.layui-layer-btn0').attr({
                    href: 'javascript:X.down_file(' + songid + ',0);'
                });
                btn.find('.layui-layer-btn1').attr({
                    href: 'javascript:X.down_file(' + songid + ',1);'
                });
            }
        });

    }, get_change: function () {
        if (Music.length) {
            X.get_cai(bid);
        }
    }
    , get_cai: function (_id) {
        $('.cai-list').html('');
        var cid = Music.length ? Music[_id]['id'] : 1;
        $.ajax({
            type: 'get',
            url: "../api/getrandmusic/default.htm",
            dataType: "json",
            beforeSend: function () {
                imageLayer = layer.msg('正在拼命获取数据，请稍等...', {
                    icon: 16,
                    shade: 0.3,
                    skin: "layui-layer-molv",
                    time: 0
                });
            },
            success: function (result) {
                layer.close(imageLayer);
                if (result.data) {
                    Musiccai = result.data;
                    for (var i = 0; i < result.data.length; i++) {
                        var cls = (i < 3) ? '' : 'layui-btn-primary'
                        var html = '<tr align="left"><td><a class="listLeft3" href="javascript:X.cai_add(' + i + ',1);"><i class="layui-btn layui-btn-mini ' + cls + ' iwidth">' + (i + 1) + '</i>' + result.data[i]['name'] + '</a></td><td><i onclick="X.cai_add(' + i + ');" class="layui-icon">&#xe608;</i></td></tr>';
                        $('.cai-list').append(html);
                    }
                } else {
                    aekun.layer.msg('网络连接失败！', { icon: 2 });
                }
            }
        });
    }
    , cai_add: function (id) {
        var newid = 0;
        if (id != undefined) {
            var sign = 0;
            for (var i = 0; i < MusicList.length; i++) {
                if (MusicList[i]['id'] == Musiccai[id]['id']) {
                    newid = i;
                    sign = 1; break;
                }
            }
            if (sign == 0) {
                MusicList.unshift(Musiccai[id]);
                if (curlist == 0) {
                    X.play_list();
                }
                aekun.layer.msg('恭喜你,加入成功~!', { icon: 1 });
            } else {
                if (arguments[1] == 1 && curlist == 0) {
                    X.player(newid);
                } else {
                    aekun.layer.msg('抱歉,歌曲已存在列表中~!', { icon: 2 });
                }
            }
            if (arguments[1] == 1 && curlist == 0) {
                X.player(newid);
            }
        } else {
            for (var j = Musiccai.length - 1; j >= 0; j--) {
                var sid = 0;
                for (var i = MusicList.length - 1; i >= 0; i--) {
                    if (MusicList[i]['id'] == Musiccai[j]['id']) {
                        sid = 1; break;
                    }
                }
                if (sid == 0) {
                    MusicList.unshift(Musiccai[j]);
                    if (curlist == 0) {
                        X.play_list();
                    }
                }
            }
            aekun.layer.msg('恭喜你,加入成功~!', { icon: 1 });
        }
    }
    , get_data: function (_sid) {
        if (MusicList.length == 0) {
            var song_id = aekun.getquerystring("song_id");
            var obj = new Object();
            obj.songid = song_id;
            $.getJSON("../api/getmusic/default.htm", obj, function (result) {
                if (result) {
                    Music = result.data;
                    MusicList = result.data;
                    X.play_list(0);
                    if (_sid == 0 && Music.length) {
                        X.get_cai(bid);
                    }
                } else {
                    aekun.layer.msg('获取播放列表信息错误，请刷新重试', { icon: 2 });
                }
            });
        } else {
            Music = MusicList;
            X.play_list();
        }
        curlist = 0;
        $('.li_rand').removeClass('on');
        $('.li_fav').removeClass('on');
        $('.li_list').addClass('on');
        $('.title-list').html('播放列表');
    }
    , get_rand: function () {
        $.ajax({
            type: 'get',
            url: "../api/getrecommmusic/default.htm",
            dataType: "json",
            beforeSend: function () {
                imageLayer = layer.msg('正在拼命获取数据，请稍等...', {
                    icon: 16,
                    shade: 0.3,
                    skin: "layui-layer-molv",
                    time: 0
                });
            },
            success: function (result) {
                layer.close(imageLayer);
                if (result.state == "error") {
                    aekun.layer.msg(result.message, { icon: 2 });
                    X.play_list();
                } else {
                    Music = result.data;
                    Musicfavor = result.data;
                    X.play_list();
                    curlist = 2;
                    $('.li_list').removeClass('on');
                    $('.li_fav').removeClass('on');
                    $('.li_rand').addClass('on');
                    $('.title-list').html('我的推荐');
                }
            }
        });
    }
    , get_fav: function () {
        $.ajax({
            type: 'get',
            url: "../api/getcollectionmusic/default.htm",
            dataType: "json",
            beforeSend: function () {
                imageLayer = layer.msg('正在拼命获取数据，请稍等...', {
                    icon: 16,
                    shade: 0.3,
                    skin: "layui-layer-molv",
                    time: 0
                });
            },
            success: function (result) {
                layer.close(imageLayer);
                if (result.state == "error") {
                    aekun.layer.msg(result.message, { icon: 2 });
                } else {
                    Music = result.data;
                    Musicfavor = result.data;
                    X.play_list();
                    curlist = 1;
                    $('.li_list').removeClass('on');
                    $('.li_rand').removeClass('on');
                    $('.li_fav').addClass('on');
                    $('.title-list').html('我的收藏');
                }
            }
        });
    }
    , play_list: function (n) {
        $('#play_list').html('');
        var html = '';
        for (var i = 0; i < Music.length; i++) {
            var singer = (Music[i]['singer'] == '') ? '佚名' : Music[i]['singer'];
            if (did == Music[i]['id']) {
                var clss = 'style="color:green;"';
                bid = i;
                curdance = curlist;
            } else {
                var clss = '';
            }
            html += '<tr id="m_' + i + '"><td align="left"><a id="dn' + i + '" ' + clss + ' onclick="X.player(' + i + ');" href="javascript:;" title="点击播放">' + (i + 1) + '、' + Music[i]['name'] + '</a></td><td class="td-icon"><div class="disno"><a style="color: #333;" onclick="X.set_nice(' + Music[i]['id'] + ');" href="javascript:;" title="好听"><i class="fa fa-thumbs-o-up"></i></a> <a onclick="X.down(' + Music[i]['id'] + ');" href="javascript:;" title="下载"><i class="layui-icon">&#xe601;</i></a><a href="javascript:X.collection(' + Music[i]['id'] + ');" title="收藏"><i class="layui-icon">&#xe600;</i></a><a href="javascript:X.player(' + i + ');" title="试听"><i class="layui-icon">&#xe6fc;</i></a><a href="javascript:X.play_del(' + i + ');" title="删除"><i class="layui-icon">&#x1006;</i></a></div></td><td><img src="' + Music[i]['singerimage'] + '" alt="J.N.S" class="musicimg" style="display: inline-block;"><a target="_blank" href="' + Music[i]['singerlink'] + '">' + singer + '</a></td></tr>';
        }
        $('#play_list').append(html);
        if (Music.length != 0 && n != undefined) {
            X.player(n);
        }
    }
    , play_del: function (i) {
        if (i == bid && curlist == curdance) {
            aekun.layer.msg('该歌曲正在播放，不能删除', { icon: 5 }); return;
        }
        if (curlist == 1) {
            aekun.layer.msg('收藏歌曲,请勿删除', { icon: 7 }); return;
        }
        $('#m_' + i).remove();
        Music.splice(i, 1);
        if (curlist == 0) {
            MusicList.splice(i, 1);
        }
        if (curlist == 2) {
            Musicrand.splice(i, 1);
        }
        X.play_list();
    }
    , player: function (n) {
        isok = true;
        curdance = curlist;
        var songid = Music[n]['id'];
        currmusicid = songid;
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(pkey);
        var obj = new Object();
        obj.songid = songid + "";
        var sendData = new Object();
        for (var key in obj) {
            sendData[key] = encrypt.encrypt(obj[key]);
        }
        var url = "../api/getMusicbyid/";
        $.ajax({
            url: url,
            type: "post",
            data: sendData,
            async: false,
            dataType: "json",
            success: function (result) {
                audio.src = result.data.url;
                audio.addEventListener("canplay", function () {
                    if (songid === currmusicid)
                    {
                        var sc = parseInt(audio.duration);
                        X.set_duration(songid, sc);
                    }
                    console.log(sc);
                });
                $('#playImghref').attr('href', Music[n]['singerlink']);
                $('#playImg').attr('src', Music[n]['singerimage']);
                if (Music[n]['singer'] != '') {
                    $('#playSinger').html(Music[n]['singer'] + '&nbsp;-&nbsp;');
                }
                $('#playSong').html('<a style="color:#fff" href="./' + songid + '" target="_blank">' + Music[n]['name'] + '</a>');
                $('#timeNow').html('00:00');
                $('#timeEnd').html(Music[n]['time']);
                $('#playFav').attr('href', 'javascript:X.collection(' + Music[n]['id'] + ');');
                $('#playDown').attr('href', 'javascript:X.down(' + Music[n]['id'] + ');');
                $('#playNice').attr('href', 'javascript:X.set_nice(' + Music[n]['id'] + ');');
                bid = n; did = Music[n]['id'];
                for (var i = Music.length - 1; i >= 0; i--) {
                    $('#dn' + i).css('color', '#333');
                }
                $('#dn' + bid).css('color', 'green');
                $('.layui-progress-bar').css('width', '0%');
                X.play_pause(1);
            }
        });
    },
    set_duration: function (id,len) {
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(pkey);
        var obj = new Object();
        obj.songid = id + "";
        obj.len = len + "";
        var sendData = new Object();
        for (var key in obj) {
            sendData[key] = encrypt.encrypt(obj[key]);
        }
        var url = "../api/setduration/";
        $.ajax({
            url: url,
            type: "post",
            data: sendData,
            async: false,
            dataType: "json",
            success: function (result) {
                isok = false;
            }
        });
    }
    , play_pre: function () {
        var tempid = Music.length - 1;
        if (curlist != curdance) {
            X.player(0); return;
        }
        if (tempid == -1) return;
        if (loop == 0) {//循环
            if (bid == 0) {
                X.player(tempid);
            } else {
                tempid = bid - 1;
                X.player(tempid);
            }
        } else {
            if (loop == 1) {//单曲
                X.player(bid);
            } else {
                tempid = parseInt(Math.random() * tempid);
                X.player(tempid);
            }
        }
        curdance = curlist;
    }
    , play_nxt: function () {
        console.log(1);
        if (curlist != curdance) {
            X.player(0); return;
        }
        var tempid = Music.length - 1;
        if (tempid == -1) return;
        if (loop == 0) {
            if (bid == tempid) {
                X.player(0);
            } else {
                tempid = bid + 1;
                X.player(tempid);
            }
        } else {
            if (loop == 1) {//单曲
                X.player(bid);
            } else {
                tempid = parseInt(Math.random() * tempid);
                X.player(tempid);
            }
        }
        curdance = curlist;
    }
    , play_loop: function () {
        if (loop == 0) {
            loop = 1;
            aekun.layer.msg('单曲循环');
            $('#playLoop').removeClass('loop').addClass('one');
        } else {
            if (loop == 1) {
                loop = 2;
                aekun.layer.msg('随机播放');
                $('#playLoop').removeClass('one').addClass('random');
            } else {
                loop = 0;
                aekun.layer.msg('列表循环');
                $('#playLoop').removeClass('random').addClass('loop');
            }
        }
    }
    , play_vol: function () {
        if (audio.muted) {
            aekun.layer.msg('音量开启');
            $('#playVol').removeClass('offvol').addClass('onvol');
            audio.muted = false;
            audio.volume = 1;
        } else {
            aekun.layer.msg('音量关闭');
            $('#playVol').removeClass('onvol').addClass('offvol');
            audio.muted = true;
            audio.volume = 0;
        }
    }
    , play_pause: function (sign) {
        if (sign) {
            $('#playNow').removeClass('playNow1').addClass('playNow2');
            audio.play();
            player = setInterval("X.play_progress()", "20");
        } else {
            if (audio.paused) {//paused yes
                audio.play();
                $('#playNow').removeClass('playNow1').addClass('playNow2');
                player = setInterval("X.play_progress()", "20");
            } else {
                audio.pause();
                $('#playNow').removeClass('playNow2').addClass('playNow1');
                clearInterval(player);
            }
        }
    }
    , play_progress: function () {
        if (audio.ended) {
            X.play_nxt();
        }
        var nowtime = audio.currentTime;
        var alltime = audio.duration;
        $('#timeNow').html(X.timetostr(audio.currentTime));
        $('#timeEnd').html(X.timetostr(audio.duration));
        var play_jd = nowtime / alltime * 100 + '%';
        $('.playDot').css('left', play_jd);
        $('.layui-progress-bar1').css('width', play_jd);
    }
    , timetostr: function (second) {
        return [parseInt(second / 60) % 60, parseInt(second % 60)].join(":").replace(/\b(\d)\b/g, "0$1");
    }
    , get_pro: function () {
        var l = $('.layui-progress1').offset().left;
        var e = event || window.event;
        var p = e.pageX;
        var pro = (p - l) / 460 * 100 + '%';
        $('.playDot').css('left', pro);
        $('.layui-progress-bar1').css('width', pro);
        audio.currentTime = audio.duration * (p - l) / 460;
    }
    , get_text: function (i, lrc1) {
        var result = "";
        var i = i + 1;
        if (lrc1[i]) {
            var t = lrc1[i].split("]");
            if (t[1] == "") result = X.get_text(i, lrc1);
            else result = t[1];
        }
        return result;
    }
    , get_ltime: function (tn) {
        var time = 0;
        var ta = tn.split(":");
        if (ta.length < 2) return time;
        if (ta[1].indexOf(".") > 0) {
            var tb = ta[1].split(".");
            time = ta[0] * 60 * 1000 + tb[0] * 1000 + tb[1] * 10
        } else time = ta[0] * 60 * 1000 + ta[1] * 1000;
        return time;
    }
}