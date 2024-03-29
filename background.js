/*
 * The MIT License
 *
 * Copyright (c) 2012, Daniel Petisme
 * Portions (c) 2013, Roland Hess
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

// For https://chrome.google.com/webstore/detail/mgmiemnjjchgkmgbeljfocdjjnpjnmcg

// Learn more about poke v3 here:
// http://wiki.antp.co/
var info = {
  "poke"    :   3,              // poke version 2
  "width"   :   2,              // 200 px default
  "height"  :   1,              // 200 px default
  "path"    :   "widget-gmarks.html",
  "v2"      :   {
                  "resize"    :   true,   // Set to true ONLY if you create a range below.
                                          // Set to false to disable resizing
                  "min_width" :   1,      // Required; set to default width if not resizable
                  "max_width" :   3,      // Required; set to default width if not resizable
                  "min_height":   1,      // Required; set to default height if not resizable
                  "max_height":   5       // Required; set to default height if not resizable
                },
  "v3"      :   {
                  "multi_placement": false // Allows the widget to be placed more than once
                                          // Set to false unless you allow users to customize each one
                }
};

chrome.extension.onMessageExternal.addListener(function(request, sender, sendResponse) {
  if(request === "mgmiemnjjchgkmgbeljfocdjjnpjnmcg-poke") {
    chrome.extension.sendMessage(
      sender.id,
      {
        head: "mgmiemnjjchgkmgbeljfocdjjnpjnmcg-pokeback",
        body: info
      }
    );
  }
});
// Above is the required poke listener
// DO NOT MODIFY ANY OF THE ABOVE CODE

/* -------------------------------------- */
/*          Widget GMarks specific */
/* -------------------------------------- */

//To be sure there is at least one instance and to ease exception handling
var instance = localStorage.getItem("bookmarks");

if (instance === null) {
    instance = $().extend({}, DEFAULT_RSS_INSTANCE);
    instance.lastUpdate = 0;
    localStorage.setItem("bookmarks", JSON.stringify(instance));
    retrieveLatestBookmarks();
} else {
    instance = JSON.parse(instance);
    var rightNow = (new Date()).getTime();
    if (rightNow - instance.lastUpdate < (1000 * 60 * 15)) { // only call for a network update every 15 minutes
        retrieveLatestBookmarks();
    };
};

function retrieveLatestBookmarks() {
    $.ajax({
        url: 'https://www.google.com/bookmarks/?output=xml&num=1000',
        dataType: 'xml',
        success: function(data) {
            var bookmarkArray = [];
            $(data).find("bookmark").each(function() {
                var thisTitle = $(this).find("title").text();
                var thisLink = $(this).find("url").text();
                bookmarkArray.push({"title": thisTitle, "url": thisLink});
                });
                bookmarkArray = bookmarkArray.sort(function(a,b) { if (a.title < b.title) { return -1;} else {return 1;} });
                instance.feed = bookmarkArray;
                instance.lastUpdate = (new Date()).getTime();
                localStorage.setItem("bookmarks", JSON.stringify(instance));
          },
          error: function() {
              instance.lastUpdate = (new Date()).getTime();
              instance.feed = {"error": "Google Bookmarks are unavailable. You must already be logged in to your Google account in this browser to retrieve them."};
              localStorage.setItem("bookmarks", JSON.stringify(instance));
          }
    });
};

// give the current localStorage back to the main script
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.type = "pleaseupdate") {
            retrieveLatestBookmarks();
        };
    }
);

setInterval(retrieveLatestBookmarks, (1000 * 60 * 15));