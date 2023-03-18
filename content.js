function loadCSS(css) {
  var head = document.head || document.getElementsByTagName("head")[0];
  const style = document.createElement("style");
  style.id = "extension";
  style.textContent = css;
  head.appendChild(style);
}

function unloadCSS() {
  var cssNode = document.getElementById("extension");
  cssNode?.parentNode?.removeChild(cssNode);
}

function setBg(css) {
  unloadCSS();
  setTimeout(() => {
    loadCSS(css)
    removeAssets();
  });
}

/** START: Remove LN assets  */
function hideElement(query) {
	const element = document.querySelector(query);
	element && (element.style.display = 'none');
}

function changeFavicon() {
  var link = document.getElementById('favicon-svg')
  if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = 'https://stackoverflow.com/favicon.ico';
}

function changeTitle() {
  document.title = document.title.replace("LinkedIn", "Glassdor")
}

function changeHeader() {
  hideElement('.global-nav__branding-logo');
  hideElement('.nav__logo-link');
  hideElement('.footer__base__wrapper')
  hideElement('#linkedin-logo')

  const globalNav = document.getElementById('global-nav')

	if (globalNav) {
	  globalNav.style.display = 'none';
	  globalNav.style.display = ''
	
	  window.addEventListener('mousemove', function(event) {
	    if (event.clientY < 100) {
	      globalNav.style.display = 'block'
	    }
	    else {
	      globalNav.style.display = 'none'
	    }
	  })
	}
}

function changeFooter() {
	hideElement('.global-footer-compact__content');
	hideElement('#compactfooter-copyright');
}

// Remove assets (meta title, logo)
function removeAssets() {
  setTimeout(() => {
    changeFavicon();
    changeTitle();
    changeHeader();
    changeFooter();
  });
}

/** END: Remove LN assets  */

chrome.runtime.onMessage.addListener((req, p1, p2) => {
  if (req.cmd === "setBg") {
    setBg(req.css);
  } else if (req.cmd === "clearBg") {
    unloadCSS();
  } else if (req.cmd === "fetchBg") {
    removeAssets();
    chrome.storage.sync.get("image", (url) => {
      if (url.image) {
        setBg(convertIntoCss(url.image));
      }
    });
  }
});

function convertIntoCss(url) {
  const css = `html body { 
      background: url(${url}); \n
      image-rendering: crisp-edges; \n        
      image-rendering: -webkit-optimize-contrast; \n
      background-size:     cover; \n
      background-repeat:   no-repeat; \n
      background-position: center center; \n    
    }\n`;
  return css;
}
