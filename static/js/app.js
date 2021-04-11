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
        url: "/api/watchdog",
        success: function(data) {
            if (data["status"] === "idle") {
                alert("Download Completed!");
                endTime = new Date();
                loop = false;
                $('.progress').fadeOut();
                progresschart.series[0].color = "#20c997";
                progresschart.series[0].addPoint(endTime, 100);
                $("#progress_label").html("Completed");
            } else {
                let peers = data["peers"];
                //update cache, datatable and pie
                Object.keys(peers).forEach(function (key) {
                    let peer = peers[key]
                    //datatables and pie update
                    if (key in cache) {
                        //already in table, updating it
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

                        //slice
                        for (let index in piechart.series[0].data){
                            if (piechart.series[0].data[index].name === peer[0]) {
                                piechart.series[0].data[index].update({y: peer[2][1]})
                                break;
                            }
                        }
                    } else {
                        //not in table, creating row
                        let newrow = [
                            "<img src='https://www.countryflags.io/" + peer[1] + "/flat/24.png'/>",
                            key, //Peer ID
                            peer[0],  //Peer IP
                            bytesToSize(peer[2][1]) //Downloaded from Peer
                        ]
                        if (peer[1] === "WORLD") //remove flag img if unknown
                            newrow[0] = "";
                        table.row.add(newrow).draw(false);

                        //creating slice
                        piechart.series[0].addPoint({y: peer[2][1], name: peer[0]})
                    }
                    //cache update
                    cache[key] = peer;
                });

                //calc downloaded
                let downloaded = get_downloaded_and_update_worldmap();
                //update UI
                $(".downloaded_label").html(bytesToSize(downloaded));
                $(".extradownloaded_label").html(bytesToSize(downloaded - data["downloaded"]));
                $("#connected").html(data["connected"]);
                let percent = (100 * data["downloaded"]) / download_size;
                percent = Math.min(percent, 99.99) // avoid going to 100% until download finished
                $("#progress_label").html(percent.toFixed(2) + "%");
                $('#progressbar').css('width', percent + '%').attr('aria-valuenow', percent);
                //update percent chart
                let duration = new Date() - startTime;
                progresschart.series[0].addPoint([duration,percent]);
                //calc average download speed
                let speed = ( downloaded / Math.floor(duration / 1000 ) );
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

//convert bytes to human readable size
function bytesToSize(bytes) {
   var sizes = ['bytes', 'kb', 'mb', 'gb', 'tb'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

//start download
$("#download").click(function(){
    disableDownloadButton(true);
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
                    alert("Error starting the download. Please restart the application");
                    disableDownloadButton(false);
                }
            } else {
                alert("Error starting the download. Please restart the application");
                disableDownloadButton(false);
            }
        });
    }
});

function disableDownloadButton(toggle){
    if (toggle){
        //disable
        $("#download").prop("disabled", true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Warming up IPFS...');
    } else {
        //enable
        $("#download").prop("disabled", false).html("Download");
    }
}

//resume download in progress
function resume(){
    //for debug
    $("#downloadform").hide();
    $("#downloadpage").show();
    $(".size_label").html(bytesToSize(download_size));
    watchdog();
}