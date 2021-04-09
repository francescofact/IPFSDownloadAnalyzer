//global vars
let download_size = false;
let cache = {};
let loop = true;
let countries = [];

let startTime = false;
let endTime = false;

//initialize stuff
let table = $("#peerstable").DataTable({
    columnDefs: [
       { type: 'file-size', targets: 3 }
     ],
    "order": [[ 3, "desc" ]],
    "searching": false,
    "bLengthChange": false,
});


//function to update download status and cache peer help
function watchdog(){
    //get peers
    loop = true;
    $.ajax({
        url: "/api/peers",
        success: function(data) {
            if (data["status"] === "idle") {
                alert("Download Completed!");
                endTime = new Date();
                loop = false;
                $('#progressbar').css('width', '100%').attr('aria-valuenow', 100);
            } else {
                let peers = data["peers"];
                //update cache and datatable
                Object.keys(peers).forEach(function (key) {
                    let peer = peers[key]
                    //datatables update
                    if (key in cache) {
                        let skip = false;
                        table.rows().every(function (index) {
                            if (!skip) {
                                let row = this.data();
                                if (row[1] === key) {
                                    row[3] = bytesToSize(peer[2][1]);
                                    table.row(index).data(row).draw(false);
                                    skip = true;
                                }
                            }

                        });
                    } else {
                        let newrow = [
                            "<img src='https://www.countryflags.io/" + peer[1] + "/flat/24.png'/>",
                            key, //Peer ID
                            peer[0],  //Peer IP
                            bytesToSize(peer[2][1]) //Downloaded from Peer
                        ]
                        if (peer[1] === "WORLD") //remove flag img if unknown
                            newrow[0] = "";

                        table.row.add(newrow).draw(false);
                    }
                    //cache update
                    cache[key] = peer;
                });

                //calc downloaded
                let downloaded = get_downloaded_and_update_worldmap();
                //update UI
                $(".downloaded_label").html(bytesToSize(downloaded));
                $("#connected").html(data["connected"]);
                let percent = (100 * downloaded) / download_size;
                $("#progress_label").html(percent.toFixed(2) + "%");
                $('#progressbar').css('width', percent + '%').attr('aria-valuenow', percent);

                //calc average download speed
                console.log([downloaded, Math.floor((new Date() - startTime)/ 1000 )])
                let speed = ( downloaded / Math.floor((new Date() - startTime)/ 1000 ) );
                if (isNaN(speed)) speed=0;
                $("#speed").html(bytesToSize(speed)+"/s");
            }
        },
        complete: function() {
            if (loop)
                setTimeout(watchdog, 5000);
        }
    });
}

//compute and update gui
function get_downloaded_and_update_worldmap(){
    let downloaded = 0;
    Object.keys(cache).forEach(function(key) {
        //downloaded size
        downloaded += cache[key][2][1];
        
        //worldmap
        if (!(countries.includes(cache[key][1]))){
            let toadd = {"id": cache[key][1], "showAsSelected": true};
            map.dataProvider.areas.push(toadd);
            countries.push(cache[key][1]);
        }
    });

    $("#countries_label").html(countries.length);
    map.validateData();
    return downloaded;
}

//update world map


//convert bytes to human readable size
function bytesToSize(bytes) {
   var sizes = ['bytes', 'kb', 'mb', 'gb', 'tb'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
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
                    $("#downloadpage").fadeIn();
                    startTime = new Date();
                    download_size = data["size"];
                    $("#cid_label").html(cid);
                    $(".size_label").html(bytesToSize(download_size));
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
    $("#downloadpage").show();
    $(".size_label").html(bytesToSize(download_size));
    watchdog();
}