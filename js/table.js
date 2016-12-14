
var MediaMaster = function(f){
    this.f = f;
    this.dataDef = _.keys(f);
    this.idx = 1;
    this.options = {
      valueNames: this.dataDef
    }
    this.mediaList = new List('contacts', this.options);
    this.member = {
      agentName: "",
      agentMail:"",
      shiseidoMail:""
    }
}

MediaMaster.prototype = {
  displayData : function(){
    var that = this;
    $("#contacts tr").on("click", function(){
      that.editData(this);
      $("button#input-renew").show();
      return false;
    });
  },
  editData : function(el){
    var that = this;
    $("#contacts tr").css({"background-color": "#FFF"});
    $(el).css({"background-color": "#FFFAF0"});
    var itemId = $(el).closest('tr').find('.id').text();
    var d = that.mediaList.get("id", itemId)[0].values();
    _.each(_.keys(d), function(e,idx){
      $("#input-" + e).val(d[e]);
    })
  },
  renewData: function(){
    var that = this;
    $("button.input-button").on("click", function(){
      var ids = $(this).attr("id");
      var obj_d = {}
      _.each(that.dataDef, function(e){
        var ids = "input-" + e;
        obj_d[e] = $("#" + ids).val()
      });
      if(that.checkUrl(obj_d["lp"])){
        if(ids === "input-renew"){
          that.mediaList.remove("id", obj_d["id"]);
        }else{
          that.idx++;
          obj_d["id"] = that.idx;
        };
        that.mediaList.add(obj_d);
        that.mediaList.sort('id', { order: "asc" });
        that.renewDisplay();
        _.each($("#editTbl").find("input"), function(e,idx){$(e).val("")});
        $("button#input-renew").hide();
        return false;
      }else{
        alert("LPのURLが不正です");
        return false;
      }

    });
  },
  checkUrl: function(str){
    var urlReg = /^(https?)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/;
    if(str.match(urlReg)){
      return true;
    }else{
      return false;
    }
  },
  removeData: function(){
    var that = this;
    $(".remove>button").on("click", function(){
      var itemId = $(this).closest('tr').find('.id').text();
      var result = confirm( "消去してよろしいですか？" + itemId );
      if(result){
        that.mediaList.remove("id", itemId);
        that.renewDisplay();
      }
      that.renewDisplay();
      return false;
    });
  },
  renewDisplay: function(){
    $("#contacts tr").off("click");
    $("button.input-button").off("click");
    $(".remove>button").off("click");
    $("#contacts tr").css({"background-color": "#FFF"});
    this.showDisplay();
  },
  showDisplay: function(){
    this.displayData();
    this.renewData();
    this.removeData();
  },
  makeSelectBox : function(){
    var that = this;
    _.each(_.keys(that.f), function(e){
      if(that.f[e].type == "list"){
        var idName = "input-" + e;
        _.each(that.f[e].data, function(dataStr){
          $option = $('<option>')
            .val(dataStr)
            .text(dataStr)
            $("select#" + idName).append($option);
        });
      }
    });
  },
  dispSegments : function(){
    $("a#dispSeg").on("click", function(){
      var className = $(this).attr("class");
      if(className === "dispOff"){
        $(".segs").show();
        $(this).removeClass("dispOff")
        $(this).addClass("dispOn")
        $(this).text("セグメント情報を非表示")
      }else{
        $(".segs").hide();
        $(this).removeClass("dispOn")
        $(this).addClass("dispOff")
      $(this).text("セグメント情報を表示")
      }
      return false;
    });
  },
  bindMakeCsv : function(){
    var that = this;
    $("button#makeCsv").click(function(){
      var csvStr = that.makeCsvData();
      var inputF = $("<input>");
      inputF.val(csvStr)
        .attr("name", "csvdata")
        .css({"display":"none"})
        .prependTo($("form#csvForm"));
      $("form#csvForm").submit();
    });
    return false;
  },
  makeCsvData : function(){
    var that = this;
    var mediaHeader = ["媒体コード","デバイス区分","媒体大分類コード","媒体中分類コード","媒体名称","出稿開始年月日","出稿終了年月日","出稿内容","ランディングページURL","汎用項目1","汎用項目2","汎用項目3","汎用項目4","汎用項目5","汎用項目6","汎用項目7","汎用項目8","汎用項目9","汎用項目10","汎用項目11","汎用項目12","汎用項目13","汎用項目14","汎用項目15","汎用項目16","汎用項目17","汎用項目18","汎用項目19","汎用項目20","広告入稿用URL","媒体マスタ登録シート番号"];
    var lines = []
    lines.push(mediaHeader);
    var items = that.mediaList.items;
    _.each(items, function(e){
      //if(e._values["id"] !== "0"){
        var line = [null,"1","1","1",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
        line[8] = e._values["lp"];
        line[9] = e._values["category"];
        line[10] = e._values["cv"];
        line[11] = e._values["brand"];
        line[12] = e._values["campaign"];
        line[13] = e._values["menu"];
        line[14] = e._values["seg1"];
        line[15] = e._values["seg2"];
        line[16] = e._values["seg3"];
        line[17] = e._values["seg4"];
        line[18] = e._values["seg5"];
        line[19] = that.member.agentName;
        line[20] = that.member.agentMail;
        line[21] = that.member.shiseidoMail;
        lines.push(line);
      //}
    });
    var resStr = "";
    _.each(lines, function(l){
      resStr += l.join(",") + "<>";
    });
    //console.log(resStr);
    return resStr;
  },
  getMember: function(){
    var that = this;
    $("#member").submit(function(){
      that.member.agentName = $("input#input-m1").val();
      that.member.agentMail = $("input#input-m2").val();
      that.member.shiseidoMail = $("input#input-m3").val();
      $('[data-remodal-id=modal]').remodal().close();
      //console.log(that.member);
      return false;
    })
  }
}



$.ajax({
  type: "GET",
  url: "txt/data.yml",
  success: function(d){
    var fileObj = jsyaml.load(d);
    //window.m = new MediaMaster(fileObj);
    var m = new MediaMaster(fileObj);
    m.makeSelectBox();
    m.showDisplay();
    m.dispSegments();
    m.bindMakeCsv();
    $(".segs").hide();
    m.getMember();
    $('[data-remodal-id=modal]').remodal().open();
  }
});
