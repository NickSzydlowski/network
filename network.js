//spreadsheet variables - edit these to point to your spreadsheet
var spreadsheetID = "1ASgBkCuUxzDuiqIscjjluKlCDgQDir1sm-AzqO0jIWA";
var siteSheet ='837918006';
var formURL = 'https://docs.google.com/forms/d/e/1FAIpQLScqbDBQnvwlwBICWObPDUorrnancpW1xvvE0MVqKvbOVbM0Ng/viewform';
var siteData;
var rowCount;
var fadeTime;


//primary function
$(document).ready(function() {

//load data from Google Sheet using Visualization API
google.charts.load('current', {
    packages: ['corechart']
  }).then(function () {

        //first we query the Site sheet for basic site information
        var query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/'+spreadsheetID+'/gviz/tq?gid='+siteSheet+'&headers=1');
        query.send(function (response) {
        if (response.isError()) {
            console.log('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
            return;
        };
        var siteDT = response.getDataTable();
        var siteJsonData = siteDT.toJSON();
        siteJsonData = JSON.parse(siteJsonData);

        createSite(siteJsonData);



        });
    });  
});
//start the loop
function createSite(siteJsonData) {
    siteData = siteJsonData.rows;
    rowCount = siteData.length;
    console.log(siteData);
    fadeTime = 0;
    itemCallback();
    var intervalID = window.setInterval(itemCallback, 20000); 
    new QRCode(document.getElementById("share"), formURL);
    console.log('finished loading');
    $('main').attr('aria-busy', 'false');

}
//create each item - function that runs in a loop
function itemCallback() {
    var item = siteData[Math.floor(Math.random()*rowCount)];
    console.log(item);
    //fade out
    $('#item-container').animate({    
        opacity: 0,
      }, fadeTime, function() {
        //message
    if (item.c['1']){
        $('#message').text(item.c['1'].v);
      }
    else {
        $('#message').text('No message');
    }
    //name
    if (item.c['2']){
        $('#name').text(item.c['2'].v);
      }
    else {
        $('#name').text('');
    }
    //QR Code
    $('#qr-label').empty();
    $('#qr').empty();
    if (item.c['6']){
        var linkMode = item.c['6'].v 
        var link;
        if (linkMode == 'Email') {                  
            if (item.c['3']) {
                $('#qr-label').text('Connect via email');   
                link ='mailto::' + item.c['3'].v
                new QRCode(document.getElementById("qr"), link);
            }
        }
        else if (linkMode == 'ORCID') {
            if (item.c['4']) {
                $('#qr-label').text('Find me on ORCID');  
                link ='https://orcid.org/' + item.c['4'].v+"/"
                new QRCode(document.getElementById("qr"), link);
            }
        }
        else if (linkMode == 'LinkedIn') {
            console.log(linkMode)
            if (item.c['5']) {
                $('#qr-label').text('Connect on LinkedIn');    
                link ='https://www.linkedin.com/in/' + item.c['5'].v+"/"
                new QRCode(document.getElementById("qr"), link);
            }
        }
        

    }
    //fade back in
    fadeTime = 2000;
    $('#item-container').animate({    
        opacity: 1,
      }, fadeTime, function() {

      });
      })
    
}

