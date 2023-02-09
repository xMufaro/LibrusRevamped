// ==UserScript==
// @name         LibrusRevamped
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  a userscript for LIBRUS Synergia that improves the UI
// @author       Mufaro
// @match        https://synergia.librus.pl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=synergia.librus.pl
// @resource     importedCss file:///C:/Users/komputer01/Desktop/LibrusRevamped-main/style.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

const cache = new Map();

async function load(url) {
  if (cache.has(url)) {
    console.log(`${url} już załadowane`);
    return;
  }

  const parser = new DOMParser();
  const response = await fetch(url).then((r) => r.text());
  const resDocument = parser.parseFromString(response, "text/html");

  $(resDocument).ready(() => {
    $(".fold-end").attr("class", "fold-empty")
    $(".fold-start").attr("class", "fold-empty")
  })  
  
  console.log(`Ładowanie ${url}`);

  cache.set(url, resDocument.getElementById("body"));
}

function replaceAnchors() {
  for (const anchor of document.getElementsByTagName("a")) {
    const url = new String(anchor.href);

    if (!anchor.href.startsWith("http")) continue;

    anchor.href = "javascript:void(0)";

    anchor.onclick = () => load(url).then(() => switchTab(url));
  }
}

function switchTab(url) {
  const body = document.getElementById("body");

  body.outerHTML = cache.get(url).outerHTML;
  window.history.pushState({}, "", url);

  replaceAnchors();
  removeExtensionWarning();
}

function removeExtensionWarning() {
  for (const scriptTag of document.getElementsByTagName("script")) {
    if (scriptTag.innerHTML.includes("librusowy-asystent-ucznia")) {
      console.log("Usunięto ogłoszenie o rozszerzeniach");
      scriptTag.remove();
    }
  }
}

window.addEventListener("load", () => {
  cache.set(window.location.toString(), document.getElementById("body"));

  replaceAnchors();
  removeExtensionWarning();
});

(function () {
  ("use strict");
  const css = GM_getResourceText("importedCss");
  GM_addStyle(css);


  $("#footer").remove();
  $("#top-banner-container>a").remove();
  $("#graphic-menu>ul>*").attr("class", "_nav-child");
  $(".main-menu-list>*>ul").attr("class", "nav-context-menu");
  $("#cookieBox").remove();


    // const pageContent = $(".container");
    // const pageContentBackground = pageContent.find("container-background").clone();

    // const pageContentNotBackground = $(`.container>*:not(.container-background)`).clone();
    // $(".container").append(`<div class="contentHeaderWrapper"></div>`)
    // $(".contentHeaderWrapper").append(pageContentNotBackground)
    // $(".fold-end").attr("class", "fold-empty")
    // $(".fold-start").attr("class", "fold-empty")

  const header = $("#header");
  const mainNavigation = header.find(
    "#main-navigation-container>#main-navigation"
  );
  const mainMenu = mainNavigation.find("#main-menu").clone();
  const topBannerContainer = header.find("#top-banner-container").clone();
  const userSection = header.find("#user-section").clone();
    $(".fold-end").attr("class", "fold-empty")
    $(".fold-start").attr("class", "fold-empty")

  $("#top-banner-container").remove();
  $("#user-section").remove();
  $("#main-menu").remove();

  $(document).ready(() => {
    header.append(userSection);

    mainNavigation.append(topBannerContainer);
    mainNavigation.append(mainMenu);

    cache.set(window.location.toString(), document.getElementById("body"));
  });
})();
