(function () {

  function makeSlideshow() {
    // Chrome wraps raw text content in a pre
    var pre = document.querySelector('pre');

    if (pre) {
      var url = document.location.href.split(/[\#\?]/, 2)[0];
      var fileName = url.split('/').slice(-1)[0];
      var slidesCss = url.slice(0, -fileName.length) + 'slides.css';
      var content = '<html>' +
      '<head><meta charset="utf-8"><title>' + fileName + '</title></head><body>' +
      '<link rel="stylesheet" href="' + chrome.extension.getURL('css/slides.css') + '">' +
      '<link rel="stylesheet" href="' + slidesCss + '">' +
      '<link rel="stylesheet" href="' + url.replace('.md', '.css') + '">' +
      '<pre id="source">' + pre.innerHTML + '</pre>' +
      '<script src="' + chrome.extension.getURL('js/remark.js') + '"></script>' +
      '<script src="' + chrome.extension.getURL('js/init.js') + '"></script>' +
      '</body></html>';
      var win = window.open('', fileName, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=' + (screen.width) + ', height=' + (screen.height) + ', top=0, left=0');
      try {
        win.focus();
        win.document.write(content);
      } catch(e) {
        // blocked
        var file = new Blob( [ content ], { type: 'text/html' } );
        var url = URL.createObjectURL( file );
        location.href = url;
      }
    }
  }

  function isMarkdown(sendResponse) {
    // If there is no title element, we're looking at a raw
    // file... It's a hack, but it's pretty effective.
    var result = !document.getElementsByTagName('title').length;

    sendResponse({ isMarkdown: result });
  }

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === 'make-slideshow') {
      makeSlideshow();
    } else if (request.message === 'is-markdown') {
      isMarkdown(sendResponse);
    }
  });

})();
