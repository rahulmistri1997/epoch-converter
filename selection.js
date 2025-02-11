$(document).ready(function () {
  $("body").append('<div id="ec-bubble"><pre id="ec-bubble-text"></pre></div>');

  $(document).click(function () {
    hideBubble();
  });

  $("#ec-bubble").click(function (event) {
    event.stopPropagation();
  });

  $(document).dblclick(function (e) {
    processSelection(e);
  });

  $(document).bind("mouseup", function (e) {
    processSelection(e);
  });
});

function processSelection(e) {
  let text = getSelectedText();

  if ($.isNumeric(text) && [10, 13].includes(text.length)) {
    if (text.length == 13) {
      // Handle millisecond timestamps
      text = text / 1000;
    }
    var date = timestampToDate(text);
    showBubble(
      e,
      getLocalString(date),
      getUTCString(date),
      getRelativeTime(date)
    );
  }
}

function getSelectedText() {
  var text = "";

  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type !== "Control") {
    text = document.selection.createRange().text;
  }

  return text;
}

function timestampToDate(ts) {
  ts = ts.length === 13 ? parseInt(ts) : ts * 1000;
  return new Date(ts);
}

function getLocalString(date) {
  tz = date.getTimezoneOffset();
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )} GMT${tz < 0 ? "+" : "-"}${pad(Math.floor(tz / 60))}:${pad(tz % 60)}`;
}

function getUTCString(date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate()
  )} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(
    date.getUTCSeconds()
  )} GMT`;
}

function getRelativeTime(date) {
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }
}

function pad(v) {
  return v.toString().padStart(2, "0");
}

function showBubble(e, localDateStr, utcDateStr, relativeTimeStr) {
  $("#ec-bubble").css("top", e.pageY + 20 + "px");
  $("#ec-bubble").css("left", e.pageX - 85 + "px");
  $("#ec-bubble-text").html(
    localDateStr + "<br/>" + utcDateStr + "<br/>" + relativeTimeStr
  );
  $("#ec-bubble").css("visibility", "visible");
}

function hideBubble() {
  $("#ec-bubble").css("visibility", "hidden");
  $("#ec-bubble-text").html("");
}
