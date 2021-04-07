//global vars
let download_size = false;
let daemonInterval = null;

//window.setInterval(daemonStatus(), 5000);

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

//function to update download status
function watchdog(){
    //get peers
    $.get("/api/download_est", function(data, status){
        if (status === "success"){
            if (data["estimation"] === -1){
                alert("Download Completed!");
                $('#progressbar').css('width', '100%').attr('aria-valuenow', 100);
            } else {
                let downloaded = data["estimation"];
                $("#downloaded_label").html(downloaded);
                let percent = ( 100 * downloaded) / download_size;
                $("#progress_label").html(percent.toFixed(2));
                $('#progressbar').css('width', percent+'%').attr('aria-valuenow', percent);

            }
        }
        setTimeout(watchdog, 2000);
    });

}

$("#download").click(function(){
    $("#download").prop("disabled", true)
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
                    $("#size_label").html(download_size);
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