$.ajax({type: "GET", url: "csv/data.yml", success: function(d){window.f = jsyaml.load(d)}, async:false})
var dataDef = _.keys(f);
var _idx = 1;
var options = {
  valueNames: dataDef
};

var mediaList = new List('contacts', options);



var commonFunc = {
  displayData : function(){
    $("#contacts tr").on("click", function(){
      commonFunc.editData(this);
      $("button#input-renew").show();
      return false;
    });
  },
  editData : function(el){
    $("#contacts tr").css({"background-color": "#FFF"});
    $(el).css({"background-color": "#FFFAF0"});
    var itemId = $(el).closest('tr').find('.id').text();
    var d = mediaList.get("id", itemId)[0].values();
    _.each(_.keys(d), function(e,idx){
      $("#input-" + e).val(d[e]);
    })
  },
  renewData: function(){
    $("button.input-button").on("click", function(){
      var ids = $(this).attr("id");
      var obj_d = {}
      _.each(dataDef, function(e){
        var ids = "input-" + e;
        obj_d[e] = $("#" + ids).val()
      })
      if(commonFunc.checkUrl(obj_d["lp"])){
        if(ids === "input-renew"){
          mediaList.remove("id", obj_d["id"]);
        }else{
          _idx++;
          obj_d["id"] = _idx;
        }
        mediaList.add(obj_d);
        mediaList.sort('id', { order: "asc" });
        commonFunc.renewDisplay();
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
    $(".remove>button").on("click", function(){
      var itemId = $(this).closest('tr').find('.id').text();
      var result = confirm( "消去してよろしいですか？" + itemId );
      if(result){
        mediaList.remove("id", itemId);
        commonFunc.renewDisplay();
      }
      commonFunc.renewDisplay();
      return false;
    });
  },
  renewDisplay: function(){
    $("#contacts tr").off("click");
    $("button.input-button").off("click");
    $(".remove>button").off("click");
    $("#contacts tr").css({"background-color": "#FFF"});
    commonFunc.showDisplay();
  },
  showDisplay: function(){
    commonFunc.displayData();
    commonFunc.renewData();
    commonFunc.removeData();
  },
  makeSelectBox : function(){
    _.each(_.keys(f), function(e){
      if(f[e].type == "list"){
        var idName = "input-" + e;
        _.each(f[e].data, function(dataStr){
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

$(function(){
  commonFunc.makeSelectBox();
  commonFunc.showDisplay();
  commonFunc.dispSegments();
  $("#makeCsv").click(function(){
    alert("CSVが生成されてメールが飛びます（きっと）")
  })
  $(".segs").hide();
});
