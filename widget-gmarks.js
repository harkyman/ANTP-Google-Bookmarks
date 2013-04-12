/*
 * The MIT License
 *
 * Copyright (c) 2012, Daniel Petisme
 * Portions (c) 2013, Roland Hess
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


//Clear the HTML outputs to prevent some UI errors
function clearDisplay(){
  $("#widget-rss-header").html(''); //Reset the header
  $("#widget-rss-feed-container-interior").html(''); //Reset the feeds
}

function adjustScroll() {
    var totalWidgetHeight = $("body").height();
    var headerHeight = $("#widget-rss-header").outerHeight();
    console.log(totalWidgetHeight, headerHeight);
    $("#widget-rss-feed-container").outerHeight(totalWidgetHeight - headerHeight);
}

//Simply display the RSS
function display(){
    chrome.extension.sendMessage("pleaseupdate",
        function(response) {
            feed = response.feed;
            //Display each entry title & link
            clearDisplay();
            $("#widget-rss-header").html(' \
            <div class="well well-small header-container header-grey"> \
              <h4>Google Bookmarks</h4>');
            $.each(feed, function(index, entry){
              $('#widget-rss-feed-container-interior').append(' \
                <div class="row-fluid"> \
                  <div class="span1 prepended-arrow-container"><i class="icon-chevron-right"></i></div> \
                  <div class="span11 entry-container"><a href="{0}" target="_blank" >{1}</a></div> \
                </div>'.format(entry.url, entry.title));
            });
            adjustScroll();
        }
    );         
    $("#widget-rss-header").html(' \
        <div class="well well-small header-container header-grey"> \
          <h4>Google Bookmarks</h4>');
      $('#widget-rss-feed-container-interior').html(' \
            <div> \
              Google Bookmarks are unavailable. You must already be logged in to your Google account in this browser to retrieve them.\
            </div>');
  }; 

/* -------------------------------------- */
/*                 Main                   */
/* -------------------------------------- */

//Event handling
$(document).ready(function() {
 // Initial setup of the widget
    display();
     $(window).bind("storage", function (e) {
        if(e.originalEvent.key === "bookmarks") {
          display();
        }
      });
      
      $(window).bind("resize", function(e) {
          adjustScroll();
      });
});