//global vars
let download_size = false;
let daemonInterval = null;
let cache = {};

//initialize stuff
//window.setInterval(daemonStatus(), 5000);
let table = $("#peerstable").DataTable({
    columnDefs: [
       { type: 'file-size', targets: 3 }
     ],
    "order": [[ 3, "desc" ]]
});

function daemonStatus(){
    $.get("/api/status", function(data, status){
        if (status === "success"){
            if (data["status"] === "active"){
                $("#daemonstatus").html("Downloading " + data["file"])
            } else {
                $("#daemonstatus").html("idle")
            }
        }
    });
}

//function to update download status and cache peer help
function watchdog(){
    //get peers
    let loop = true;
    $.get("/api/peers", function(data, status){
        if (status === "success"){
            if (data["status"] === "idle"){
                alert("Download Completed!");
                loop = false;
                $('#progressbar').css('width', '100%').attr('aria-valuenow', 100);
            } else {
                let peers = data["peers"];
                //update cache and datatable
                Object.keys(peers).forEach(function(key) {
                    let peer = peers[key]
                    //datatables update
                    if (key in cache){
                        let skip = false;
                        table.rows().every( function (index) {
                            if (!skip){
                               let row = this.data();
                                if (row[1] === key){
                                   row[3] = bytesToSize(peer[2][1]);
                                   table.row(index).data(row).draw(false);
                                   skip = true;
                                }
                            }

                        });
                    } else {
                        table.row.add([
                            "<img src='https://www.countryflags.io/" + peer[1] + "/flat/24.png'/>",
                            key, //Peer ID
                            peer[0],  //Peer IP
                            bytesToSize(peer[2][1]) //Downloaded from Peer
                        ]).draw(false);
                    }
                    //cache update
                    cache[key] = peer;
                });

                //calc downloaded and update UI
                let downloaded = calc_downloaded();
                $("#downloaded_label").html(bytesToSize(downloaded));
                let percent = ( 100 * downloaded) / download_size;
                $("#progress_label").html(percent.toFixed(2));
                $('#progressbar').css('width', percent+'%').attr('aria-valuenow', percent);

            }
        }
        if (loop)
            setTimeout(watchdog, 5000);
    });

}

//get downloaded part summing peers in cache
function calc_downloaded(){
    let downloaded = 0;
    Object.keys(cache).forEach(function(key) {
        downloaded += cache[key][2][1];
    });
    return downloaded;
}

//convert bytes to human readable size
function bytesToSize(bytes) {
   var sizes = ['bytes', 'kb', 'mb', 'gb', 'tb'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

//start download
$("#download").click(function(){
    $("#download").prop("disabled", true)
    cache = {};
    let cid = $("#cid").val().trim();
    if (cid === ""){
        alert("Insert a CID")
    } else {
        $.get("/api/download/"+cid, function(data, status){
            if (status === "success"){
                if (data["status"] === "started"){
                    $("#downloadform").hide();
                    $("#downloadprogress").fadeIn();
                    download_size = data["size"];
                    $("#cid_label").html(cid);
                    $("#size_label").html(bytesToSize(download_size));
                    watchdog();
                } else {
                    alert("Error starting the download. Please restart the application")
                    $("#download").prop("disabled", false)
                }
            } else {
                alert("Error starting the download. Please restart the application")
                $("#download").prop("disabled", false)
            }
        });
    }
});

//resume download in progress
function resume(){
    //for debug
    $("#downloadform").hide();
    $("#downloadprogress").show();
    watchdog();
}