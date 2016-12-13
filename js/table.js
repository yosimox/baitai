
var MediaMaster = function(f){
    this.f = f;
    this.dataDef = _.keys(f);
    this.idx = 1;
    this.options = {
      valueNames: this.dataDef
    }
    this.mediaList = new List('contacts', this.options);
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
  }
}

$.ajax({
  type: "GET",
  url: "txt/data.yml",
  success: function(d){
    var fileObj = jsyaml.load(d);
    m = new MediaMaster(fileObj);
    m.makeSelectBox();
    m.showDisplay();
    m.dispSegments();
    $("#makeCsv").click(function(){
      alert("CSVが生成されてメールが飛びます（きっと）")
    })
    $(".segs").hide();
  }
});
